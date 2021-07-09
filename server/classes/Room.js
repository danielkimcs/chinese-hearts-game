const Constants = require('../../shared/constants');
const Player = require('./Player');

class Room {
    constructor(io, roomName) {
        this.io = io;
        this.roomName = roomName;

        this.players = {};
        this.sockets = {};
        this.teams = {};
        this.currentTrick = undefined;
        this.currentState = Constants.ROOM_STATES.ROOM_PENDING;

        this.ClientAPI = new ClientAPI(this);
    }

    addPlayer(socket, username) {
        this.sockets[socket.id] = socket;
        this.players[socket.id] = new Player(socket, username);
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    getPlayerCount() {
        return Object.keys(this.players).length;
    }

    startState(newState) {
        switch (newState) {
            case Constants.ROOM_STATES.ROOM_SETUP:
                
                break;
            default:
        }
    }
}

class ClientAPI {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayerList() {
        let playerNames = Object.values(this.room.players).map(playerObj => playerObj.username);
        this.room.io.to(this.room.roomName).emit(Constants.CLIENT_API.UPDATE_PLAYER_LIST, playerNames);
    }
}

module.exports = Room;