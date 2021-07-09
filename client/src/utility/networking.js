import io from 'socket.io-client';
const Constants = require('../../../shared/constants');

let socket;

export const initiateSocket = ({username, roomName}) => {
    socket = io();
    if (socket && roomName) socket.emit(Constants.ROOM_JOIN, {username, roomName});
}
export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

export const subscribeUpdatePlayers = (callback) => {
    if (!socket) return (true);

    socket.on(Constants.CLIENT_API.UPDATE_PLAYER_LIST, playerObjects => {
        return callback(null, playerObjects);
    });
}

// export const sendMessage = (room, message) => {
//     if (socket) socket.emit('chat', { message, room });
// }