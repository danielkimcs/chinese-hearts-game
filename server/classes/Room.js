const Utility = require('../../shared/utility');
const Constants = require('../../shared/constants');
const Player = require('./Player');
const Card = require('./Card');
const Trick = require('./Trick');
const Events = require('../events/Events');

const COUNTDOWN_INTERVAL_TIME = 1000;
const ROUND_END_DELAY = 3500;
const LOSING_POINTS_CUTOFF = -1000;
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
                // points: 0,
                members: []
            },
            [Constants.TEAM_TYPE.TEAM_B]: {
                // points: 0,
                members: []
            }
        };
        this.randomizedTeams = false;
        this.currentState = Constants.ROOM_STATES.ROOM_PENDING;
        this.countdownInterval = undefined;
        this.gamePaused = false;

        this.currentTrick = undefined;
        this.queenSpadeRecipient = undefined;
        this.trickWinnerPlayer = undefined;
        this.trickEndTimeoutStarted = false;
        this.doubleHeartPoints = false;
        this.reset = false;

        this.Events = new Events(this);

        this.stateActions = undefined;

        this.stateActions = {
            [Constants.ROOM_STATES.ROOM_PAUSE]: this.roomPause,
            [Constants.ROOM_STATES.ROOM_PENDING]: this.roomPending,
            [Constants.ROOM_STATES.ROOM_COUNTDOWN]: this.roomCountdown,
            [Constants.ROOM_STATES.ROOM_SETUP]: this.roomSetup,
            [Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN]: this.roomSetupCountdown,
            [Constants.ROOM_STATES.ROUND_DEAL]: this.roundDeal,
            [Constants.ROOM_STATES.ROUND_CONFIRM]: this.roundConfirm,
            [Constants.ROOM_STATES.ROUND_START]: this.roundStart,
            [Constants.ROOM_STATES.TRICK_PLAY]: this.trickPlay,
            [Constants.ROOM_STATES.TRICK_PENDING]: this.trickPending,
            [Constants.ROOM_STATES.TRICK_END]: this.trickEnd,
            [Constants.ROOM_STATES.ROUND_END]: this.roundEnd
        };

        this.bindStateActions();
    }

    // MAIN GAME LOGIC

    // Constructor helper functions

    bindStateActions() {
        Object.keys(this.stateActions).forEach(state =>
            this.stateActions[state] = this.stateActions[state].bind(this));
    }

    startState(newState) {
        console.log(newState);
        if (newState !== Constants.ROOM_STATES.ROOM_PAUSE) {
            this.currentState = newState;
        }

        this.Events.updateRoomState();

        this.stateActions[newState]();
    }

    // State action functions

    roomPause() {
        this.togglePause(true);
    }

    roomPending() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = undefined;
            this.Events.updateCountdown(null, Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN);
        }
    }

    roomCountdown() {
        this.removeDisconnectedPlayers();
        this.countdownInterval = this.beginCountdown(5, Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN, Constants.ROOM_STATES.ROOM_SETUP);
    }

    roomSetup() {
        if (this.reset) {
            this.reset = false;
            this.resetTeams();
            this.Events.announceWinningTeam(null);
            this.queenSpadeRecipient = undefined;
        }

        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = undefined;
            this.Events.updateCountdown(null, Constants.EVENT_TYPE.ROOM_SETUP_COUNTDOWN);
        }
        if (this.randomizedTeams) {
            // Randomize teams and determine player order
            let connectedPlayers = this.getConnectedPlayers();
            Utility.shuffleArray(connectedPlayers);
            this.determineTeams(connectedPlayers);
            this.determinePlayerOrder(connectedPlayers);

            this.Events.updatePlayerList();
            this.randomizedTeams = false;
            this.Events.sendNotification("Teams have been randomized!");
            this.startState(Constants.ROOM_STATES.ROUND_DEAL);
        } else {
            this.Events.updatePlayerList();
        }
    }

    roomSetupCountdown() {
        this.countdownInterval = this.beginCountdown(5, Constants.EVENT_TYPE.ROOM_SETUP_COUNTDOWN, Constants.ROOM_STATES.ROUND_DEAL, true);
    }

    roundDeal() {
        let roundPlayers = this.getConnectedPlayers();

        roundPlayers.forEach(player => {
            player.votes.randomizedTeams = false;
        });

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
    }

    roundConfirm() {
        Object.keys(this.players).forEach(playerUsername => {
            let player = this.players[playerUsername];
            if (!player.hasConfirmedHand) {
                this.Events.askConfirmHand(player);
            }
        });
    }

    roundStart() {
        if (this.queenSpadeRecipient) {
            this.Events.sendNotification(`${this.queenSpadeRecipient.username} collected the Queen of Spades last round, so ${this.queenSpadeRecipient.username} will start this round!`);
            this.currentTrick = new Trick(this.queenSpadeRecipient.playerId);
            this.queenSpadeRecipient = undefined;
        } else if (!this.currentTrick) {
            const randomFirstPlayer = Utility.chooseRandom(this.getConnectedPlayers());
            const randomFirstPlayerId = randomFirstPlayer.playerId;
            this.Events.sendNotification(`${randomFirstPlayer.username} has been randomly chosen to start the first trick!`);
            this.currentTrick = new Trick(randomFirstPlayerId);
        }
        this.startState(Constants.ROOM_STATES.TRICK_PLAY);
    }

    trickPlay() {
        this.Events.updateCurrentTrick();
    }

    trickPending() {
        this.Events.updateCurrentTrick();
    }

    trickEnd() {
        if (!this.trickWinnerPlayer || !this.currentTrick.winnerPlayerName) {
            let winningPlayerId = this.currentTrick.determineWinner();
            let winningPlayer = Object.values(this.players).filter(player => player.playerId === winningPlayerId)[0];
            this.currentTrick.winnerPlayerName = winningPlayer.username;
            this.trickWinnerPlayer = winningPlayer;
        }
        this.Events.updateCurrentTrick();
        if (!this.trickEndTimeoutStarted) {
            this.trickEndTimeoutStarted = true;
            setTimeout(function () {
                let newCollectedCards = this.currentTrick.collectCards();
                let winningPlayer = this.trickWinnerPlayer;
                if (newCollectedCards.filter(card => card.suit === 'SPADE' && card.rank === 'QUEEN').length) {
                    this.queenSpadeRecipient = winningPlayer;
                }
                winningPlayer.collectedCards = winningPlayer.collectedCards.concat(newCollectedCards);
                this.Events.updatePlayerList();
                this.trickWinnerPlayer = undefined;

                if (winningPlayer.currentHand.length) {
                    this.currentTrick = new Trick(winningPlayer.playerId);
                    this.trickEndTimeoutStarted = false;
                    this.startState(Constants.ROOM_STATES.TRICK_PLAY);
                } else {
                    this.currentTrick = undefined;
                    this.trickEndTimeoutStarted = false;
                    this.getConnectedPlayers().forEach(player => {
                        player.pointsOutdated = true;
                    });
                    this.startState(Constants.ROOM_STATES.ROUND_END);
                }
            }.bind(this), ROUND_END_DELAY);
        }
    }

    roundEnd() {
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

        let winner = this.determineWinner();
        if (winner) {
            this.reset = true;
            this.Events.announceWinningTeam(winner);
        }

        Object.keys(this.players).forEach(playerUsername => {
            let player = this.players[playerUsername];
            if (!player.hasConfirmedStartRound) {
                this.Events.askStartRound(player);
            }
        });
    }

    updateClient(username) {
        let player = this.players[username];

        this.Events.updateRoomState(player);

        if (this.gamePaused
            && this.currentState !== Constants.ROOM_STATES.ROOM_PENDING
            && this.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN
            && this.currentState !== Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN) {
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

    // HELPER FUNCTIONS

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

    disconnectPlayer(username) {
        if (!(username in this.players)) return;
        let disconnectedPlayer = this.players[username];
        disconnectedPlayer.status = Constants.PLAYER_STATUS.PLAYER_DISCONNECTED;
        disconnectedPlayer.socket = null;
        if (this.currentState === Constants.ROOM_STATES.ROOM_SETUP || this.currentState === Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN) {
            disconnectedPlayer.currentTeam = "";
        }
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

    resumeGameIfPossible() {
        if (this.isRoomFull()) {
            if (this.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                this.startState(Constants.ROOM_STATES.ROOM_COUNTDOWN);
            }
            else if (this.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN
                && this.gamePaused) {
                this.startState(this.currentState);
                this.togglePause(false);
            }
        }
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

    determineWinner() {
        let teamAPoints = this.teams[Constants.TEAM_TYPE.TEAM_A].members.reduce((total, currentPlayer) => total += currentPlayer.points, 0);
        let teamBPoints = this.teams[Constants.TEAM_TYPE.TEAM_B].members.reduce((total, currentPlayer) => total += currentPlayer.points, 0);
        if (teamAPoints > LOSING_POINTS_CUTOFF && teamBPoints > LOSING_POINTS_CUTOFF) {
            return null;
        }
        return (teamAPoints > teamBPoints ? Constants.TEAM_TYPE.TEAM_A : (teamAPoints < teamBPoints ? Constants.TEAM_TYPE.TEAM_B : "tie"));
    }

    determinePlayerOrder() {
        if (Constants.REQUIRED_NUM_PLAYERS === 4) {
            // Player order: 0 (Team A) -> 1 (Team B) -> 2 (Team A) -> 3 (Team B)
            let teamAPlayerIndexes = [0, 1];
            let teamBPlayerIndexes = [0, 1];
            Utility.shuffleArray(teamAPlayerIndexes);
            Utility.shuffleArray(teamBPlayerIndexes);
            const shuffledPlayerList = [
                this.teams[Constants.TEAM_TYPE.TEAM_A].members[teamAPlayerIndexes[0]],
                this.teams[Constants.TEAM_TYPE.TEAM_B].members[teamBPlayerIndexes[0]],
                this.teams[Constants.TEAM_TYPE.TEAM_A].members[teamAPlayerIndexes[1]],
                this.teams[Constants.TEAM_TYPE.TEAM_B].members[teamBPlayerIndexes[1]]
            ];
            for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
                shuffledPlayerList[playerIndex].nextPlayer = shuffledPlayerList[(playerIndex + 1) % 4];
            }
        }
    }

    resetTeams() {
        Object.keys(Constants.TEAM_TYPE).forEach(team => {
            this.teams[team].members.forEach(player => {
                player.points = 0;
                player.currentTeam = "";
                player.nextPlayer = undefined;
            });
            this.teams[team].members = [];
        });
    }

    beginCountdown(timeLengthInSeconds, eventType, nextState, changePlayerOrder = false) {
        let countdown = timeLengthInSeconds;
        let countdownInterval = setInterval(function () {
            if (countdown === 0) {
                this.Events.updateCountdown(null, eventType);
                this.countdownInterval = undefined;
                clearInterval(countdownInterval);
                if (changePlayerOrder) this.determinePlayerOrder.bind(this).call();
                this.startState(nextState);
            }
            this.Events.updateCountdown(countdown, eventType);
            countdown--;
        }.bind(this), COUNTDOWN_INTERVAL_TIME);

        return countdownInterval;
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