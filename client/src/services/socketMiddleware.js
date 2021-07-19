import io from 'socket.io-client';
import {
    setPlayers,
    setStartingCountdown,
    setGamePause,
    setRoomState,
    setCurrentTrick
} from './room/actions';
import {
    setPlayerCards,
    setHandConfirmation,
    setStartRoundConfirmation
} from './user/actions';
import { PLAYER_LEAVE_ROOM } from './constants';

const Constants = require('../../../shared/constants');

const socketMiddleware = () => {
    let socket;

    return store => next => action => {
        if (action.type === Constants.LISTENER_TYPE.ROOM_JOIN) {
            socket = io();

            let dispatch = store.dispatch;

            socket.on(Constants.EVENT_TYPE.UPDATE_PLAYER_LIST, playerObjects => {
                dispatch(setPlayers(playerObjects));
            });

            socket.on(Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN, counter => {
                dispatch(setStartingCountdown(counter));
            });

            socket.on(Constants.EVENT_TYPE.GAME_PAUSE, paused => {
                dispatch(setGamePause(paused));
            });

            socket.on(Constants.EVENT_TYPE.UPDATE_ROOM_STATE, roomState => {
                dispatch(setRoomState(roomState));
            });

            socket.on(Constants.EVENT_TYPE.TRICK_ASK_CARD, (trick) => {
                dispatch(setCurrentTrick(trick));
            });

            socket.on(Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS, cards => {
                dispatch(setPlayerCards(cards));
            });

            socket.on(Constants.EVENT_TYPE.ASK_CONFIRM_HAND, () => {
                dispatch(setHandConfirmation(false));
            });

            socket.on(Constants.EVENT_TYPE.ASK_START_ROUND, () => {
                dispatch(setStartRoundConfirmation(false));
            });
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