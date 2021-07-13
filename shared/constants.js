module.exports = Object.freeze({
    REQUIRED_NUM_PLAYERS: 4,
    SERVER_EVENTS: {
        ROOM_JOIN: 'ROOM_JOIN',
        CARD_FACE_DOWN: 'CARD_FACE_DOWN',
        FACE_DOWN_CONFIRMED: 'FACE_DOWN_CONFIRMED',
        CARD_PLAYED: 'CARD_PLAYED',
        START_NEW_ROUND_CONFIRMED: 'START_NEW_ROUND_CONFIRMED'
    },
    ROOM_JOIN_FAILURE_MSG_TYPE: {
        USERNAME_TAKEN: 'USERNAME_TAKEN',
        ROOM_FULL: 'ROOM_FULL',
        GENERAL_ERROR: 'GENERAL_ERROR',
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
        UPDATE_ROOM_STATE: 'UPDATE_ROOM_STATE',
        UPDATE_PLAYER_CARDS: 'UPDATE_PLAYER_CARDS',
        ASK_CONFIRM_HAND: 'ASK_CONFIRM_HAND',
        ANNOUNCE_STARTING_PLAYER: 'ANNOUNCE_STARTING_PLAYER',
        TRICK_ASK_CARD: 'TRICK_ASK_CARD',
        ASK_START_ROUND: 'ASK_START_ROUND'
    },
    PLAYER_STATUS: {
        PLAYER_CONNECTED: 'PLAYER_CONNECTED',
        PLAYER_DISCONNECTED: 'PLAYER_DISCONNECTED',
    },
    CARD_TYPE: {
        RANKS: {
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            JACK: 11,
            QUEEN: 12,
            KING: 13,
            ACE: 14
        },
        SUITS: {
            HEART: 4,
            CLUB: 3,
            DIAMOND: 2,
            SPADE: 1
        },
        SPECIAL: ['JACKDIAMOND', 'QUEENSPADE', '10CLUB', 'ACEHEART']
    },
    CARD_POINTS: {
        JACKDIAMOND: 100,
        QUEENSPADE: -100,
        '10CLUB': 50,
        HEART: {
            '2': 0,
            '3': 0,
            '4': 0,
            '5': -10,
            '6': -10,
            '7': -10,
            '8': -10,
            '9': -10,
            '10': -10,
            JACK: -20,
            QUEEN: -30,
            KING: -40,
            ACE: -50
        }
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
