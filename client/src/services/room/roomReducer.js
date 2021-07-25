import { displayStatusValues } from '../../shared/constants';
import { ROOM_SET_DISPLAY_STATUS } from '../constants';
const Constants = require('../../../../shared/constants');

const initialState = {
    displayStatus: { status: displayStatusValues.LOADING, message: "" },
    players: [],
    roomState: Constants.ROOM_STATES.ROOM_PENDING,
    startingCountdown: null,
    setupCountdown: null,
    pause: false,
    currentTrick: null,
    winningTeam: null,
};

function roomReducer(state = initialState, action) {
    switch (action.type) {
        case ROOM_SET_DISPLAY_STATUS:
            return {
                ...state,
                displayStatus: action.payload
            }
        case Constants.EVENT_TYPE.UPDATE_PLAYER_LIST:
            return {
                ...state,
                players: action.payload
            }
        case Constants.EVENT_TYPE.UPDATE_ROOM_STATE:
            return {
                ...state,
                roomState: action.payload
            }
        case Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN:
            return {
                ...state,
                startingCountdown: action.payload
            }
        case Constants.EVENT_TYPE.ROOM_SETUP_COUNTDOWN:
            return {
                ...state,
                setupCountdown: action.payload
            }
        case Constants.EVENT_TYPE.GAME_PAUSE:
            return {
                ...state,
                pause: action.payload
            }
        case Constants.EVENT_TYPE.TRICK_ASK_CARD:
            return {
                ...state,
                currentTrick: action.payload
            }
        case Constants.EVENT_TYPE.ANNOUNCE_WINNER:
            return {
                ...state,
                winningTeam: action.payload
            }
        default:
            return state
    }
}

export default roomReducer;