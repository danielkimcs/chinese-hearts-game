const express = require('express');
const socketio = require('socket.io');
const history = require('connect-history-api-fallback');
const path = require("path");

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.dev.js');

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

// Listen for socket.io connections
io.on('connection', socket => {
    console.log('Player connected ', socket.id);

    socket.on('disconnect', () => {
        console.log(socket.id, " disconnected");
    });
});
