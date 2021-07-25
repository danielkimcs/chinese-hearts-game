import { displayStatusValues } from '../../shared/constants';
import { PLAYER_LEAVE_ROOM, ROOM_SET_DISPLAY_STATUS } from '../constants';
const Constants = require('../../../../shared/constants');

export const joinRoom = ({ username, roomName }, callback) => (
    {
        type: Constants.LISTENER_TYPE.ROOM_JOIN,
        payload: { username, roomName },
        emit: true,
        callback: callback
    }
);

export const setDisplayStatus = (response) => (
    {
        type: ROOM_SET_DISPLAY_STATUS,
        payload: {
            status: response.status ?
                displayStatusValues.JOIN_SUCCESS :
                displayStatusValues.JOIN_FAILURE,
            message: response.message
        }
    }
);

export const leaveRoom = () => (
    {
        type: PLAYER_LEAVE_ROOM
    }
);

export const setPlayers = (players) => (
    {
        type: Constants.EVENT_TYPE.UPDATE_PLAYER_LIST,
        payload: players
    }
);

export const setRoomState = (roomState) => (
    {
        type: Constants.EVENT_TYPE.UPDATE_ROOM_STATE,
        payload: roomState
    }
);

export const setStartingCountdown = (startingCountdown) => (
    {
        type: Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN,
        payload: startingCountdown
    }
);

export const setSetupCountdown = (startingCountdown) => (
    {
        type: Constants.EVENT_TYPE.ROOM_SETUP_COUNTDOWN,
        payload: startingCountdown
    }
);

export const setGamePause = (pause) => (
    {
        type: Constants.EVENT_TYPE.GAME_PAUSE,
        payload: pause
    }
);

export const setCurrentTrick = (currentTrick) => (
    {
        type: Constants.EVENT_TYPE.TRICK_ASK_CARD,
        payload: currentTrick
    }
);

export const setWinningTeam = (winner) => (
    {
        type: Constants.EVENT_TYPE.ANNOUNCE_WINNER,
        payload: winner
    }
);
