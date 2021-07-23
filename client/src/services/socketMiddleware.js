import io from 'socket.io-client';
import addListeners from './listeners';
import { PLAYER_LEAVE_ROOM } from './constants';

const Constants = require('../../../shared/constants');

const socketMiddleware = () => {
    let socket;

    return store => next => action => {
        if (action.type === Constants.LISTENER_TYPE.ROOM_JOIN) {
            socket = io();

            let dispatch = store.dispatch;

            addListeners(dispatch, socket);
        }

        if (action.type === PLAYER_LEAVE_ROOM) {
            if (socket) socket.disconnect();
        }
        else {
            if (socket && action.emit) {
                socket.emit(action.type, action.payload, action.callback);
            }
        }
        next(action);
    }
}

export default socketMiddleware;