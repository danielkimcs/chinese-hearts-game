import io from 'socket.io-client';
const Constants = require('../../../shared/constants');

let socket;

export const initiateSocket = ({ username, roomName }, callback) => {
    socket = io();
    if (socket && roomName) {
        socket.emit(Constants.LISTENER_TYPE.ROOM_JOIN, { username, roomName }, (response) => {
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

    socket.emit(Constants.LISTENER_TYPE.CARD_FACE_DOWN, card);
}

export const sendPlayedCard = (card) => {
    if (!socket) return true;

    socket.emit(Constants.LISTENER_TYPE.CARD_PLAYED, card);
}

export const sendHandConfirmation = () => {
    if (!socket) return true;

    socket.emit(Constants.LISTENER_TYPE.FACE_DOWN_CONFIRMED);
}

export const sendNewRoundConfirmation = () => {
    if (!socket) return true;

    socket.emit(Constants.LISTENER_TYPE.START_NEW_ROUND_CONFIRMED);
}

export const subscribeUpdatePlayerList = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.UPDATE_PLAYER_LIST, playerObjects => {
        return callback(null, playerObjects);
    });
}

export const subscribeStartingCountdown = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN, counter => {
        return callback(null, counter);
    });
}

export const subscribePause = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.GAME_PAUSE, paused => {
        return callback(null, paused);
    });
}

export const subscribeUpdatePlayerCards = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS, cards => {
        return callback(null, cards);
    });
}

export const subscribeRoomState = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.UPDATE_ROOM_STATE, roomState => {
        return callback(null, roomState);
    });
}

export const subscribeAskConfirmHand = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.ASK_CONFIRM_HAND, () => {
        return callback(null);
    });
}

export const subscribeAskStartRound = (callback) => {
    if (!socket) return true;

    socket.on(Constants.EVENT_TYPE.ASK_START_ROUND, () => {
        return callback(null);
    });
}

export const subscribeAskCard = (callback) => {
    if (!socket) return true;
    socket.on(Constants.EVENT_TYPE.TRICK_ASK_CARD, (trick) => {
        return callback(null, trick);
    });
}

// export const sendMessage = (room, message) => {
//     if (socket) socket.emit('chat', { message, room });
// }