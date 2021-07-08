import io from 'socket.io-client';
let socket;

export const initiateSocket = ({username, roomName}) => {
    socket = io();
    if (socket && roomName) socket.emit('join', {username, roomName});
}
export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

export const subscribeUpdatePlayers = (callback) => {
    if (!socket) return (true);

    socket.on('players', msg => {
        return callback(null, msg);
    });
}

// export const sendMessage = (room, message) => {
//     if (socket) socket.emit('chat', { message, room });
// }