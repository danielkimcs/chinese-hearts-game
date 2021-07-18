const socketio = require('socket.io');

const initListeners = require('./listeners');

var sockets = {};

sockets.init = function (server) {
    const io = socketio(server);

    let rooms = {};

    io.on('connection', socket => {
        console.log('Player connected ', socket.id);

        let socketInfo = {
            currentPlayerUsername: undefined,
            currentPlayerRoomName: undefined,
            currentPlayerJoined: false
        };

        initListeners(rooms, socket, socketInfo, io);
    });
}

module.exports = sockets;