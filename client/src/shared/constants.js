const Constants = require('../../../shared/constants');

export const displayStatusValues = {
    LOADING: 'LOADING',
    JOIN_SUCCESS: 'JOIN_SUCCESS',
    JOIN_FAILURE: 'JOIN_FAILURE'
}

export const displayMessageValues = {
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.USERNAME_TAKEN]: 'Someone has already taken that username in this game!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_FULL]: 'This game is full!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_IN_PROGRESS]: 'This game is currently in progress!'
}
