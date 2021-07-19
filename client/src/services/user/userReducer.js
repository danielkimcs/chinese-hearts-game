import { PLAYER_SET_USERNAME } from '../constants';
const Constants = require('../../../../shared/constants');

const initialState = {
    username: null,
    currentCards: [],
    hasConfirmedHand: null,
    confirmedStartRound: null
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case PLAYER_SET_USERNAME:
            return {
                ...state,
                username: action.payload
            }
        case Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS:
            return {
                ...state,
                currentCards: action.payload
            }
        case Constants.EVENT_TYPE.ASK_CONFIRM_HAND:
            return {
                ...state,
                hasConfirmedHand: action.payload
            }
        case Constants.EVENT_TYPE.ASK_START_ROUND:
            return {
                ...state,
                confirmedStartRound: action.payload
            }
        default:
            return state
    }
}

export default userReducer;