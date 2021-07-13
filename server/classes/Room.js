const Utility = require('../../shared/utility');
const Constants = require('../../shared/constants');
const Player = require('./Player');
const Card = require('./Card');
const Trick = require('./Trick');

const COUNTDOWN_INTERVAL_TIME = 300;

const SUITS = Object.keys(Constants.CARD_TYPE.SUITS);
const RANKS = Object.keys(Constants.CARD_TYPE.RANKS);

function createShuffledDeck() {
    let deck = [];
    SUITS.forEach(suit => RANKS.forEach(rank => deck.push(new Card(rank, suit))));
    deck = Utility.shuffleArray(deck);
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

        this.ClientAPI = new ClientAPI(this);
    }

    startState(newState) {
        console.log(newState);
        if (newState !== Constants.ROOM_STATES.ROOM_PAUSE) {
            this.currentState = newState;
        }

        this.ClientAPI.updateRoomState();

        switch (newState) {
            case Constants.ROOM_STATES.ROOM_PAUSE:
                this.togglePause(true);
                break;
            case Constants.ROOM_STATES.ROOM_PENDING:
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                    this.countdownInterval = undefined;
                    this.ClientAPI.updateCountdown(null);
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

                this.ClientAPI.updatePlayerList();
                this.startState(Constants.ROOM_STATES.ROUND_DEAL);
                break;
            case Constants.ROOM_STATES.ROUND_DEAL:
                let shuffledDeck = createShuffledDeck();
                this.getConnectedPlayers().forEach((player, index) => {
                    player.currentHand = shuffledDeck.slice(index * 13, (index + 1) * 13);
                    this.ClientAPI.updatePlayerCards(player);
                });
                this.startState(Constants.ROOM_STATES.ROUND_CONFIRM);
                break;
            case Constants.ROOM_STATES.ROUND_CONFIRM:
                Object.keys(this.players).forEach(playerUsername => {
                    let player = this.players[playerUsername];
                    if (!player.hasConfirmedHand) {
                        this.ClientAPI.askConfirmHand(player);
                    }
                });
                break;
            case Constants.ROOM_STATES.ROUND_START:
                if (!this.currentTrick) {
                    let randomFirstPlayerId = Utility.chooseRandom(this.getConnectedPlayers()).playerId;
                    this.currentTrick = new Trick(randomFirstPlayerId);
                }
                this.startState(Constants.ROOM_STATES.TRICK_PLAY);
                break;
            case Constants.ROOM_STATES.TRICK_PLAY:
            case Constants.ROOM_STATES.TRICK_PENDING:
                this.ClientAPI.askCard();
                break;
            case Constants.ROOM_STATES.TRICK_END:
                this.ClientAPI.askCard();
                let thisRoom = this;
                setTimeout(function () {
                    let winningPlayerId = thisRoom.currentTrick.determineWinner();
                    let winningPlayer = Object.values(thisRoom.players).filter(player => player.playerId === winningPlayerId)[0];
                    let newCollectedCards = thisRoom.currentTrick.collectCards();
                    winningPlayer.collectedCards = winningPlayer.collectedCards.concat(newCollectedCards);
                    thisRoom.ClientAPI.updatePlayerList();

                    if (winningPlayer.currentHand.length) {
                        thisRoom.currentTrick = new Trick(winningPlayerId);
                        thisRoom.startState(Constants.ROOM_STATES.TRICK_PLAY);
                    } else {
                        thisRoom.currentTrick = undefined;
                        thisRoom.startState(Constants.ROOM_STATES.ROUND_END);
                    }
                }, 2500);
                break;
            default:
        }
    }

    addPlayer(socket, username) {
        this.players[username] = new Player(socket, username);
        console.log(username, this.players[username].playerId);
        this.ClientAPI.updatePlayerList();
    }

    replacePlayer(playerToReplace, newSocket, newUsername) {
        if (!(newUsername || newSocket)) return;
        delete this.players[playerToReplace.username];
        playerToReplace.username = newUsername;
        playerToReplace.socket = newSocket;
        playerToReplace.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;
        this.players[newUsername] = playerToReplace;
        this.ClientAPI.updatePlayerList();
    }

    updateClient(username) {
        let player = this.players[username];

        this.ClientAPI.updateRoomState(player);

        if (this.gamePaused
            && this.currentState !== Constants.ROOM_STATES.ROOM_PENDING
            && this.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN) {
            this.ClientAPI.pauseGame(true, player);
        }

        switch (this.currentState) {
            case Constants.ROOM_STATES.TRICK_PLAY:
            case Constants.ROOM_STATES.TRICK_PENDING:
                this.ClientAPI.askCard();
            case Constants.ROOM_STATES.ROUND_DEAL:
            case Constants.ROOM_STATES.ROUND_CONFIRM:
            case Constants.ROOM_STATES.ROUND_START:
                this.ClientAPI.updatePlayerCards(player);
                break;
        }

    }

    disconnectPlayer(username) {
        if (!(username in this.players)) return;
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_DISCONNECTED;
        this.players[username].socket = null;
        this.ClientAPI.updatePlayerList();
    }

    removeDisconnectedPlayers() {
        Object.keys(this.players).forEach(username => {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED) {
                delete this.players[username];
            }
        });
        this.ClientAPI.updatePlayerList();
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
        let clientAPI = currentRoom.ClientAPI;

        let countdown = 5;
        let startingCountdown = setInterval(function () {
            // Be careful: 'this' does not refer to Room obj inside the interval
            if (countdown === 0) {
                clientAPI.updateCountdown(null);
                currentRoom.countdownInterval = undefined;
                clearInterval(startingCountdown);
                currentRoom.startState(Constants.ROOM_STATES.ROOM_SETUP);
            }
            clientAPI.updateCountdown(countdown);
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
        this.ClientAPI.pauseGame(paused);
        this.gamePaused = paused;
    }
}

class ClientAPI {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayerList() {
        let playerObjects = Object.values(this.room.players).map(playerObj => {
            return {
                username: playerObj.username,
                playerId: playerObj.playerId,
                status: playerObj.status,
                currentTeam: playerObj.currentTeam,
                nextPlayerUsername: playerObj.nextPlayer ? playerObj.nextPlayer.username : "",
                hasConfirmedHand: playerObj.hasConfirmedHand,
                numFaceDown: playerObj.numFaceDown,
                collectedCards: playerObj.collectedCards
            }
        });

        this.room.io.to(this.room.roomName).emit(Constants.CLIENT_API.UPDATE_PLAYER_LIST, playerObjects);
    }

    updateCountdown(countdown) {
        this.room.io.in(this.room.roomName).emit(Constants.CLIENT_API.GAME_STARTING_COUNTDOWN, countdown);
    }

    updateRoomState(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.CLIENT_API.UPDATE_ROOM_STATE, this.room.currentState);
    }

    pauseGame(paused, player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.CLIENT_API.GAME_PAUSE, paused);
    }

    updatePlayerCards(player) {
        if (!player
            || !player.socket
            || !player.socket.id
            || player.status !== Constants.PLAYER_STATUS.PLAYER_CONNECTED) return;
        this.room.io.in(player.socket.id).emit(Constants.CLIENT_API.UPDATE_PLAYER_CARDS, player.currentHand);
    }

    askConfirmHand(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.CLIENT_API.ASK_CONFIRM_HAND);
    }

    askCard() {
        let currentTrick = this.room.currentTrick;
        if (!currentTrick) return;
        this.room.io.in(this.room.roomName).emit(Constants.CLIENT_API.TRICK_ASK_CARD, currentTrick);
    }
}

module.exports = Room;