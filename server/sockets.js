const socketio = require('socket.io');

const listenRoomJoin = require('./listeners/roomJoin');
const listenRoomLeave = require('./listeners/roomLeave');
const listenCardFaceDown = require('./listeners/cardFaceDown');
const listenConfirmHand = require('./listeners/confirmHand');
const listenConfirmStartRound = require('./listeners/confirmStartRound');
const listenCardPlayed = require('./listeners/cardPlayed');

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
        }

        listenRoomJoin(io, rooms, socket, socketInfo);

        listenRoomLeave(rooms, socket, socketInfo);

        listenCardFaceDown(rooms, socket, socketInfo);
        
        listenConfirmHand(rooms, socket, socketInfo);

        listenConfirmStartRound(rooms, socket, socketInfo);

        listenCardPlayed(rooms, socket, socketInfo);
    });
}

module.exports = sockets;