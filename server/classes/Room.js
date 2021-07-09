const Utility = require('../../shared/utility');
const Constants = require('../../shared/constants');
const Player = require('./Player');

class Room {
    constructor(io, roomName) {
        this.io = io;
        this.roomName = roomName;

        this.players = {};
        // this.sockets = {};
        this.teams = {};
        this.currentTrick = undefined;
        this.currentState = Constants.ROOM_STATES.ROOM_PENDING;

        this.countdownInterval = undefined;

        this.ClientAPI = new ClientAPI(this);
    }

    addPlayer(socket, username) {
        // this.sockets[socket.id] = socket;
        this.players[username] = new Player(socket, username);
        this.ClientAPI.updatePlayerList();
    }

    reconnectPlayer(newSocket, username) {
        if (!(username in this.players)) return;
        this.players[username].setSocket(newSocket);
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;
        this.ClientAPI.updatePlayerList();
    }

    disconnectPlayer(username) {
        // delete this.sockets[socket.id];
        if (!(username in this.players)) return;
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_DISCONNECTED;
        this.players[username].socket = null;
        this.ClientAPI.updatePlayerList();
    }

    removeDisconnectedPlayers() {
        for (var username in this.players) {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED) {
                delete this.players[username];
            }
        }
        this.ClientAPI.updatePlayerList();
    }

    getConnectedPlayerCount() {
        let count = 0;
        for (var username in this.players) {
            let playerObj = this.players[username];
            if (playerObj && playerObj.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED) count++;
        }
        return count;
    }

    startState(newState) {
        switch (newState) {
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
                console.log("time to decide teams!");
                break;
            default:
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
        }, 1000);

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
}

class ClientAPI {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayerList() {
        let playerObjects = Object.values(this.room.players).map(playerObj => {
            return {
                username: playerObj.username,
                status: playerObj.status
            }
        });
        this.room.io.to(this.room.roomName).emit(Constants.CLIENT_API.UPDATE_PLAYER_LIST, playerObjects);
    }

    updateCountdown(countdown) {
        this.room.io.in(this.room.roomName).emit(Constants.CLIENT_API.GAME_STARTING_COUNTDOWN, countdown);
    }
}

module.exports = Room;