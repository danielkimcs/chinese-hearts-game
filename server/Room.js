const Constants = require('../shared/constants');

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
        this.players[socket.id] = username;
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    printPlayers() {
        console.log(this.players);
    }
}

class ClientAPI {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayers() {
        this.room.io.to(this.room.roomName).emit("players", Object.values(this.room.players));
    }
}

module.exports = Room;