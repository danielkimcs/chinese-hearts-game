module.exports = Object.freeze({
    REQUIRED_NUM_PLAYERS: 4,
    ROOM_JOIN: 'ROOM_JOIN',
    ROOM_JOIN_FAILURE_MSG_TYPE: {
        USERNAME_TAKEN: 'USERNAME_TAKEN',
        ROOM_FULL: 'ROOM_FULL',
        ROOM_IN_PROGRESS: 'ROOM_IN_PROGRESS',
    },
    TEAM_TYPE: {
        TEAM_A: 'TEAM_A',
        TEAM_B: 'TEAM_B'
    },
    CLIENT_API: {
        UPDATE_PLAYER_LIST: 'UPDATE_PLAYER_LIST',
        GAME_STARTING_COUNTDOWN: 'GAME_STARTING_COUNTDOWN',
        GAME_PAUSE: 'GAME_PAUSE',
    },
    PLAYER_STATUS: {
        PLAYER_CONNECTED: 'PLAYER_CONNECTED',
        PLAYER_DISCONNECTED: 'PLAYER_DISCONNECTED',
    },
    ROOM_STATES: {
        ROOM_PENDING: 'ROOM_PENDING',
        ROOM_COUNTDOWN: 'ROOM_COUNTDOWN',
        ROOM_SETUP: 'ROOM_SETUP',
        ROUND_DEAL: 'ROUND_DEAL',
        ROUND_CONFIRM: 'ROUND_CONFIRM',
        ROUND_START: 'ROUND_START',
        TRICK_PLAY: 'TRICK_PLAY',
        TRICK_PENDING: 'TRICK_PENDING',
        TRICK_END: 'TRICK_END',
        ROUND_END: 'ROUND_END',
        ROOM_PAUSE: 'ROOM_PAUSE'
    },
});
