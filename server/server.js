const express = require('express');
const socketio = require('socket.io');
const history = require('connect-history-api-fallback');
const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.dev.js');

const Room = require('./classes/Room');
const Constants = require('../shared/constants');

// Setup an Express server
const app = express();

if (process.env.NODE_ENV === 'development') {
    // Setup Webpack for development
    const compiler = webpack(webpackConfig);
    app.use(history());
    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/'
    }));
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

let clients = {};
let rooms = {};

io.on('connection', socket => {
    console.log('Player connected ', socket.id);

    clients[socket.id] = socket;

    let currentPlayerUsername = undefined;
    let currentPlayerRoomName = undefined;
    let currentPlayerJoined = false;

    socket.on(Constants.SERVER_EVENTS.ROOM_JOIN, ({ username, roomName }, callback) => {
        currentPlayerUsername = username;
        currentPlayerRoomName = roomName;
        let currentPlayerRoom;

        if (currentPlayerRoomName in rooms) {
            currentPlayerRoom = rooms[currentPlayerRoomName];
            if (currentPlayerRoom.isRoomFull()) {
                callback({
                    status: false,
                    message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_FULL
                });
                return;
            }
            if (currentPlayerRoom.isUsernameTaken(currentPlayerUsername)) {
                callback({
                    status: false,
                    message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.USERNAME_TAKEN
                });
                return;
            }

            console.log(`Socket ${socket.id} joining ${roomName}`);
            socket.join(currentPlayerRoomName);

            // Room is not full, and there is no connected player with same username
            if (currentPlayerRoom.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                currentPlayerRoom.addPlayer(socket, currentPlayerUsername);
            } else {
                // Replace disconnected player
                let playerToReplace = (currentPlayerUsername in currentPlayerRoom.players) ?
                    currentPlayerRoom.players[currentPlayerUsername]
                    : currentPlayerRoom.fetchDisconnectedPlayer();
                if (!playerToReplace) {
                    callback({
                        status: false,
                        message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.GENERAL_ERROR
                    });
                    return;
                }
                currentPlayerRoom.replacePlayer(playerToReplace, socket, currentPlayerUsername);
                // Now update player screen
                currentPlayerRoom.updateClient(currentPlayerUsername);
            }
        } else {
            console.log(`Socket ${socket.id} joining ${roomName}`);
            socket.join(currentPlayerRoomName);

            rooms[currentPlayerRoomName] = new Room(io, currentPlayerRoomName);
            currentPlayerRoom = rooms[currentPlayerRoomName];
            currentPlayerRoom.addPlayer(socket, currentPlayerUsername);
        }

        // Room is now full so start countdown or resume game
        if (currentPlayerRoom.isRoomFull()) {
            if (currentPlayerRoom.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                currentPlayerRoom.startState(Constants.ROOM_STATES.ROOM_COUNTDOWN);
            }
            else if (currentPlayerRoom.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN
                && currentPlayerRoom.gamePaused) {
                currentPlayerRoom.startState(currentPlayerRoom.currentState);
                currentPlayerRoom.togglePause(false);
            }
        }

        currentPlayerJoined = true;
        callback({
            status: true,
            message: ""
        });
    });

    socket.on('disconnect', () => {
        console.log(socket.id, " disconnected");
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        if (!(currentPlayerRoomName in rooms)) return;

        if (socket.id in clients) {
            delete clients[socket.id];
        }

        let room = rooms[currentPlayerRoomName];
        room.disconnectPlayer(currentPlayerUsername);

        let connectedPlayerCount = room.getConnectedPlayerCount();
        if (connectedPlayerCount === 0) {
            delete rooms[currentPlayerRoomName];
        } else if (connectedPlayerCount < Constants.REQUIRED_NUM_PLAYERS) {
            if (room.currentState === Constants.ROOM_STATES.ROOM_PENDING) return;
            if (room.gamePaused) return;

            if (room.currentState === Constants.ROOM_STATES.ROOM_COUNTDOWN) {
                room.startState(Constants.ROOM_STATES.ROOM_PENDING);
            } else if (!room.gamePaused) {
                room.startState(Constants.ROOM_STATES.ROOM_PAUSE);
            }
        }
    });

    socket.on(Constants.SERVER_EVENTS.CARD_FACE_DOWN, (card) => {
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;

        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROUND_CONFIRM) return;

        let currentPlayer = room.players[currentPlayerUsername];
        let actualCard = currentPlayer.currentHand.filter(c => c.suit === card.suit && c.rank === card.rank)[0];

        actualCard.faceDown = true;
        currentPlayer.numFaceDown++;
        room.ClientAPI.updatePlayerList();
        room.ClientAPI.updatePlayerCards(currentPlayer);
    });

    socket.on(Constants.SERVER_EVENTS.FACE_DOWN_CONFIRMED, () => {
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROUND_CONFIRM) return;
        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.hasConfirmedHand = true;

        room.ClientAPI.updatePlayerList();

        // Check if every connected player has confirmed hand
        let everyoneHasConfirmed = room.getConnectedPlayers()
            .reduce((confirmedSoFar, nextPlayer) => confirmedSoFar && nextPlayer.hasConfirmedHand, true);

        if (everyoneHasConfirmed) {
            room.startState(Constants.ROOM_STATES.ROUND_START);
        }
    });
});
