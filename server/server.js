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

const REQUIRED_NUM_PLAYERS = 4;
let clients = {};
let rooms = {};

io.on('connection', socket => {
    console.log('Player connected ', socket.id);

    clients[socket.id] = socket;

    let currentPlayerUsername = undefined;
    let currentPlayerRoomName = undefined;

    socket.on(Constants.ROOM_JOIN, ({ username, roomName }) => {
        console.log(`Socket ${socket.id} joining ${roomName}`);

        currentPlayerUsername = username;
        currentPlayerRoomName = roomName;
        let currentPlayerRoom;

        socket.join(currentPlayerRoomName);

        if (currentPlayerRoomName in rooms) {
            currentPlayerRoom = rooms[currentPlayerRoomName];
            if (currentPlayerUsername in currentPlayerRoom.players) {
                // same username but different socket
                currentPlayerRoom.reconnectPlayer(socket, currentPlayerUsername);

                // TO DO: update user's screen on latest updates to current game
            } else {
                // a new player
                currentPlayerRoom.addPlayer(socket, currentPlayerUsername);
            }
        }
        else {
            rooms[currentPlayerRoomName] = new Room(io, currentPlayerRoomName);
            currentPlayerRoom = rooms[currentPlayerRoomName];
            currentPlayerRoom.addPlayer(socket, currentPlayerUsername);
        }

        currentPlayerRoom.ClientAPI.updatePlayerList();
        console.log(currentPlayerRoom.getConnectedPlayerCount());
        if (currentPlayerRoom.getConnectedPlayerCount() === REQUIRED_NUM_PLAYERS) {
            currentPlayerRoom.startState(Constants.ROOM_STATES.ROOM_COUNTDOWN);
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id, " disconnected");
        if (socket.id in clients) {
            delete clients[socket.id];
        }
        if (currentPlayerUsername && currentPlayerRoomName in rooms) {
            let room = rooms[currentPlayerRoomName];
            room.disconnectPlayer(currentPlayerUsername);
            room.ClientAPI.updatePlayerList();

            let connectedPlayerCount = room.getConnectedPlayerCount();
            if (connectedPlayerCount === 0) {
                delete rooms[currentPlayerRoomName];
            } else if (connectedPlayerCount < REQUIRED_NUM_PLAYERS) {
                room.startState(Constants.ROOM_STATES.ROOM_PENDING);
            }
        }
    });
});
