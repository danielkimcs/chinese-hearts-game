import io from 'socket.io-client';
const Constants = require('../../../shared/constants');

let socket;

export const initiateSocket = ({ username, roomName }, callback) => {
    socket = io();
    if (socket && roomName) {
        socket.emit(Constants.SERVER_EVENTS.ROOM_JOIN, { username, roomName }, (response) => {
            callback(response);
        });
    } else {
        callback(false);
    }
}

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

export const sendFaceDownCard = (card) => {
    if (!socket) return true;

    socket.emit(Constants.SERVER_EVENTS.CARD_FACE_DOWN, card);
}

export const sendPlayedCard = (card) => {
    if (!socket) return true;

    socket.emit(Constants.SERVER_EVENTS.CARD_PLAYED, card);
}

export const sendHandConfirmation = () => {
    if (!socket) return true;

    socket.emit(Constants.SERVER_EVENTS.FACE_DOWN_CONFIRMED);
}

export const subscribeUpdatePlayerList = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.UPDATE_PLAYER_LIST, playerObjects => {
        return callback(null, playerObjects);
    });
}

export const subscribeStartingCountdown = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.GAME_STARTING_COUNTDOWN, counter => {
        return callback(null, counter);
    });
}

export const subscribePause = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.GAME_PAUSE, paused => {
        return callback(null, paused);
    });
}

export const subscribeUpdatePlayerCards = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.UPDATE_PLAYER_CARDS, cards => {
        return callback(null, cards);
    });
}

export const subscribeRoomState = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.UPDATE_ROOM_STATE, roomState => {
        return callback(null, roomState);
    });
}

export const subscribeAskConfirmHand = (callback) => {
    if (!socket) return true;

    socket.on(Constants.CLIENT_API.ASK_CONFIRM_HAND, () => {
        return callback(null);
    });
}

export const subscribeAskCard = (callback) => {
    if (!socket) return true;
    socket.on(Constants.CLIENT_API.TRICK_ASK_CARD, (trick) => {
        return callback(null, trick);
    });
}

// export const sendMessage = (room, message) => {
//     if (socket) socket.emit('chat', { message, room });
// }