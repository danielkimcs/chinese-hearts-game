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

    socket.on(Constants.ROOM_JOIN, ({ username, roomName }) => {
        console.log(`Socket ${socket.id} joining ${roomName}`);
        currentPlayerUsername = username;
        currentPlayerRoomName = roomName;

        socket.join(currentPlayerRoomName);
        if (currentPlayerRoomName in rooms) {
            rooms[currentPlayerRoomName].addPlayer(socket, currentPlayerUsername);
        }
        else {
            rooms[currentPlayerRoomName] = new Room(io, currentPlayerRoomName);
            rooms[currentPlayerRoomName].addPlayer(socket, currentPlayerUsername);
        }

        rooms[currentPlayerRoomName].ClientAPI.updatePlayerList();
    });

    socket.on('disconnect', () => {
        console.log(socket.id, " disconnected");
        if (socket.id in clients) {
            delete clients[socket.id];
        }
        if (currentPlayerRoomName in rooms) {
            let room = rooms[currentPlayerRoomName];
            room.removePlayer(socket);
            if (room.getPlayerCount() == 0) {
                delete rooms[currentPlayerRoomName];
            } else {
                room.ClientAPI.updatePlayerList();
            }
        }

    });
});
