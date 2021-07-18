const Utility = require('../../shared/utility');
const Constants = require('../../shared/constants');
const Player = require('./Player');
const Card = require('./Card');
const Trick = require('./Trick');
const Events = require('./Events');

const COUNTDOWN_INTERVAL_TIME = 1000;
const ROUND_END_DELAY = 3500;
const DEVELOPMENT_MODE = false;

const SUITS = Object.keys(Constants.CARD_TYPE.SUITS);
const RANKS = Object.keys(Constants.CARD_TYPE.RANKS);

function createShuffledDeck() {
    let deck = [];
    SUITS.forEach(suit => RANKS.forEach(rank => deck.push(new Card(rank, suit))));
    deck = Utility.shuffleArray(deck);
    if (DEVELOPMENT_MODE) return deck.slice(0, Math.ceil(deck.length / 13)); // Just play one trick for development purposes
    return deck;
}

class Room {
    constructor(io, roomName) {
        this.io = io;
        this.roomName = roomName;

        this.players = {};
        this.teams = {
            [Constants.TEAM_TYPE.TEAM_A]: {
                points: 0,
                members: []
            },
            [Constants.TEAM_TYPE.TEAM_B]: {
                points: 0,
                members: []
            }
        };
        this.currentState = Constants.ROOM_STATES.ROOM_PENDING;
        this.countdownInterval = undefined;
        this.gamePaused = false;

        this.currentTrick = undefined;
        this.queenSpadeRecipient = undefined;
        this.trickWinnerPlayer = undefined;
        this.trickEndTimeoutStarted = false;
        this.doubleHeartPoints = false;

        this.Events = new Events(this);
    }

    startState(newState) {
        console.log(newState);
        if (newState !== Constants.ROOM_STATES.ROOM_PAUSE) {
            this.currentState = newState;
        }

        this.Events.updateRoomState();

        switch (newState) {
            case Constants.ROOM_STATES.ROOM_PAUSE:
                this.togglePause(true);
                break;
            case Constants.ROOM_STATES.ROOM_PENDING:
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                    this.countdownInterval = undefined;
                    this.Events.updateCountdown(null);
                }
                break;
            case Constants.ROOM_STATES.ROOM_COUNTDOWN:
                this.removeDisconnectedPlayers();
                this.countdownInterval = this.beginStartingCountdown();
                break;
            case Constants.ROOM_STATES.ROOM_SETUP:
                if (!this.isRoomFull()) {
                    this.startState(Constants.ROOM_STATES.ROOM_PENDING);
                    return;
                }
                let connectedPlayers = this.getConnectedPlayers();
                Utility.shuffleArray(connectedPlayers);
                this.determineTeams(connectedPlayers);
                this.determinePlayerOrder(connectedPlayers);

                this.Events.updatePlayerList();
                this.startState(Constants.ROOM_STATES.ROUND_DEAL);
                break;
            case Constants.ROOM_STATES.ROUND_DEAL:
                let roundPlayers = this.getConnectedPlayers();

                // Clear collected cards from last round
                roundPlayers.forEach(player => {
                    player.collectedCards = [];
                });
                this.Events.updatePlayerList();

                let shuffledDeck = createShuffledDeck();
                roundPlayers.forEach((player, index) => {
                    player.currentHand = shuffledDeck.slice(index * shuffledDeck.length / 4, (index + 1) * shuffledDeck.length / 4);
                    this.Events.updatePlayerCards(player);
                });
                this.startState(Constants.ROOM_STATES.ROUND_CONFIRM);
                break;
            case Constants.ROOM_STATES.ROUND_CONFIRM:
                Object.keys(this.players).forEach(playerUsername => {
                    let player = this.players[playerUsername];
                    if (!player.hasConfirmedHand) {
                        this.Events.askConfirmHand(player);
                    }
                });
                break;
            case Constants.ROOM_STATES.ROUND_START:
                if (this.queenSpadeRecipient) {
                    this.currentTrick = new Trick(this.queenSpadeRecipient.playerId);
                } else if (!this.currentTrick) {
                    let randomFirstPlayerId = Utility.chooseRandom(this.getConnectedPlayers()).playerId;
                    this.currentTrick = new Trick(randomFirstPlayerId);
                }
                this.startState(Constants.ROOM_STATES.TRICK_PLAY);
                break;
            case Constants.ROOM_STATES.TRICK_PLAY:
            case Constants.ROOM_STATES.TRICK_PENDING:
                this.Events.updateCurrentTrick();
                break;
            case Constants.ROOM_STATES.TRICK_END:
                if (!this.trickWinnerPlayer || !this.currentTrick.winnerPlayerName) {
                    let winningPlayerId = this.currentTrick.determineWinner();
                    let winningPlayer = Object.values(this.players).filter(player => player.playerId === winningPlayerId)[0];
                    this.currentTrick.winnerPlayerName = winningPlayer.username;
                    this.trickWinnerPlayer = winningPlayer;
                }
                this.Events.updateCurrentTrick();
                let thisRoom = this;
                if (!this.trickEndTimeoutStarted) {
                    this.trickEndTimeoutStarted = true;
                    setTimeout(function () {
                        let newCollectedCards = thisRoom.currentTrick.collectCards();
                        let winningPlayer = thisRoom.trickWinnerPlayer;
                        if (newCollectedCards.filter(card => card.suit === 'SPADE' && card.rank === 'QUEEN').length) {
                            thisRoom.queenSpadeRecipient = winningPlayer;
                        }
                        winningPlayer.collectedCards = winningPlayer.collectedCards.concat(newCollectedCards);
                        thisRoom.Events.updatePlayerList();
                        thisRoom.trickWinnerPlayer = undefined;

                        if (winningPlayer.currentHand.length) {
                            thisRoom.currentTrick = new Trick(winningPlayer.playerId);
                            thisRoom.trickEndTimeoutStarted = false;
                            thisRoom.startState(Constants.ROOM_STATES.TRICK_PLAY);
                        } else {
                            thisRoom.currentTrick = undefined;
                            thisRoom.trickEndTimeoutStarted = false;
                            thisRoom.getConnectedPlayers().forEach(player => {
                                player.pointsOutdated = true;
                            });
                            thisRoom.startState(Constants.ROOM_STATES.ROUND_END);
                        }
                    }, ROUND_END_DELAY);
                }
                break;
            case Constants.ROOM_STATES.ROUND_END:
                this.Events.updateCurrentTrick(); // clears the table from last trick
                this.getConnectedPlayers().forEach(player => {
                    if (player.pointsOutdated) {
                        player.points += player.calculatePoints(this.doubleHeartPoints);

                        // Reset everything
                        player.hasConfirmedHand = false;
                        player.hasConfirmedStartRound = false;
                        player.currentHand = [];
                        player.numFaceDown = 0;
                        player.pointsOutdated = false;
                    }
                });
                this.doubleHeartPoints = false;
                this.Events.updatePlayerList();

                Object.keys(this.players).forEach(playerUsername => {
                    let player = this.players[playerUsername];
                    if (!player.hasConfirmedStartRound) {
                        this.Events.askStartRound(player);
                    }
                });
                break;
            default:
        }
    }

    addPlayer(socket, username) {
        this.players[username] = new Player(socket, username);
        console.log(username, this.players[username].playerId);
        this.Events.updatePlayerList();
    }

    replacePlayer(playerToReplace, newSocket, newUsername) {
        if (!(newUsername || newSocket)) return;
        delete this.players[playerToReplace.username];
        playerToReplace.username = newUsername;
        playerToReplace.socket = newSocket;
        playerToReplace.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;
        this.players[newUsername] = playerToReplace;
        this.Events.updatePlayerList();
    }

    updateClient(username) {
        let player = this.players[username];

        this.Events.updateRoomState(player);

        if (this.gamePaused
            && this.currentState !== Constants.ROOM_STATES.ROOM_PENDING
            && this.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN) {
            this.Events.pauseGame(true, player);
        }

        switch (this.currentState) {
            case Constants.ROOM_STATES.TRICK_PLAY:
            case Constants.ROOM_STATES.TRICK_PENDING:
                this.Events.updateCurrentTrick();
            case Constants.ROOM_STATES.ROUND_END:
            case Constants.ROOM_STATES.TRICK_END:
            case Constants.ROOM_STATES.ROUND_DEAL:
            case Constants.ROOM_STATES.ROUND_CONFIRM:
            case Constants.ROOM_STATES.ROUND_START:
                this.Events.updatePlayerCards(player);
                break;
        }

    }

    disconnectPlayer(username) {
        if (!(username in this.players)) return;
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_DISCONNECTED;
        this.players[username].socket = null;
        this.Events.updatePlayerList();
    }

    removeDisconnectedPlayers() {
        Object.keys(this.players).forEach(username => {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED) {
                delete this.players[username];
            }
        });
        this.Events.updatePlayerList();
    }

    fetchDisconnectedPlayer() {
        for (var username in this.players) {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED) {
                return playerObj;
            }
        }
        return null;
    }

    getConnectedPlayerCount() {
        let count = 0;
        Object.keys(this.players).forEach(username => {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED) count++;
        });
        return count;
    }

    getConnectedPlayers() {
        let connectedPlayers = Array(Constants.REQUIRED_NUM_PLAYERS);
        let index = 0;
        Object.keys(this.players).forEach(username => {
            let playerObj = this.players[username];
            if (index < Constants.REQUIRED_NUM_PLAYERS
                && playerObj
                && playerObj.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED) {
                connectedPlayers[index++] = playerObj;
            }
        });
        return connectedPlayers;
    }

    determineTeams(shuffledPlayerList) {
        if (Constants.REQUIRED_NUM_PLAYERS === 4) {
            // Player teams: Team A - 0, 2 ; Team B - 1, 3
            this.teams[Constants.TEAM_TYPE.TEAM_A].members = [shuffledPlayerList[0], shuffledPlayerList[2]];
            shuffledPlayerList[0].currentTeam = shuffledPlayerList[2].currentTeam = Constants.TEAM_TYPE.TEAM_A;

            this.teams[Constants.TEAM_TYPE.TEAM_B].members = [shuffledPlayerList[1], shuffledPlayerList[3]];
            shuffledPlayerList[1].currentTeam = shuffledPlayerList[3].currentTeam = Constants.TEAM_TYPE.TEAM_B;
        }
    }

    determinePlayerOrder(shuffledPlayerList) {
        if (Constants.REQUIRED_NUM_PLAYERS === 4) {
            // Player order: 0 (Team A) -> 1 (Team B) -> 2 (Team A) -> 3 (Team B)
            for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
                shuffledPlayerList[playerIndex].nextPlayer = shuffledPlayerList[(playerIndex + 1) % 4];
            }
        }
    }

    beginStartingCountdown() {
        let currentRoom = this;
        let roomEvents = currentRoom.Events;

        let countdown = 5;
        let startingCountdown = setInterval(function () {
            // Be careful: 'this' does not refer to Room obj inside the interval
            if (countdown === 0) {
                roomEvents.updateCountdown(null);
                currentRoom.countdownInterval = undefined;
                clearInterval(startingCountdown);
                currentRoom.startState(Constants.ROOM_STATES.ROOM_SETUP);
            }
            roomEvents.updateCountdown(countdown);
            countdown--;
        }, COUNTDOWN_INTERVAL_TIME);

        return startingCountdown;
    }

    isUsernameTaken(username) {
        return this.players
            && this.players.hasOwnProperty(username)
            && this.players[username]
            && this.players[username]["status"] === Constants.PLAYER_STATUS.PLAYER_CONNECTED;
    }

    isRoomFull() {
        return this.getConnectedPlayerCount() === Constants.REQUIRED_NUM_PLAYERS;
    }

    togglePause(paused) {
        this.Events.pauseGame(paused);
        this.gamePaused = paused;
    }
}



module.exports = Room;