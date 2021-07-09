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
    }

    reconnectPlayer(newSocket, username) {
        if (!(username in this.players)) return;
        this.players[username].setSocket(newSocket);
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;
    }

    disconnectPlayer(username) {
        // delete this.sockets[socket.id];
        if (!(username in this.players)) return;
        this.players[username].status = Constants.PLAYER_STATUS.PLAYER_DISCONNECTED;
        this.players[username].socket = null;
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
                this.countdownInterval = this.beginStartingCountdown();
                break;
            case Constants.ROOM_STATES.ROOM_SETUP:

                break;
            default:
        }
    }

    beginStartingCountdown() {
        let clientAPI = this.ClientAPI;

        let countdown = 5;
        let startingCountdown = setInterval(function () {
            // Be careful: 'this' does not refer to Room obj inside the interval
            if (countdown === 0) {
                clientAPI.updateCountdown(null);
                clearInterval(startingCountdown);
                this.countdownInterval = undefined;
            }
            clientAPI.updateCountdown(countdown);
            countdown--;
        }, 1000);

        return startingCountdown;
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