import {
    setPlayers,
    setStartingCountdown,
    setSetupCountdown,
    setGamePause,
    setRoomState,
    setCurrentTrick,
    setDisplayStatus
} from './room/actions';
import {
    setPlayerCards,
    setHandConfirmation,
    setStartRoundConfirmation,
    setNotification
} from './user/actions';

const Constants = require('../../../shared/constants');


const addListeners = (dispatch, socket) => {
    socket.on(Constants.EVENT_TYPE.UPDATE_PLAYER_LIST, playerObjects => {
        dispatch(setPlayers(playerObjects));
    });

    socket.on(Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN, counter => {
        dispatch(setStartingCountdown(counter));
    });

    socket.on(Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN, counter => {
        dispatch(setSetupCountdown(counter));
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

    socket.on(Constants.EVENT_TYPE.ASK_CONFIRM_HAND, (hasConfirmed) => {
        dispatch(setHandConfirmation(hasConfirmed));
    });

    socket.on(Constants.EVENT_TYPE.ASK_START_ROUND, (hasConfirmed) => {
        dispatch(setStartRoundConfirmation(hasConfirmed));
    });

    socket.on(Constants.EVENT_TYPE.UPDATE_DISPLAY_STATUS, (response) => {
        dispatch(setDisplayStatus(response));
    });

    socket.on(Constants.EVENT_TYPE.NOTIFICATION, (message) => {
        dispatch(setNotification(message));
    });
}

export default addListeners;