import { PLAYER_SET_USERNAME } from '../constants';
const Constants = require('../../../../shared/constants');

export const setPlayerUsername = (username) => (
    {
        type: PLAYER_SET_USERNAME,
        payload: username
    }
);

export const setPlayerCards = (currentCards) => (
    {
        type: Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS,
        payload: currentCards
    }
);

export const setNotification = (message) => (
    {
        type: Constants.EVENT_TYPE.NOTIFICATION,
        payload: message
    }
);

export const setHandConfirmation = (hasConfirmedHand) => (
    {
        type: Constants.EVENT_TYPE.ASK_CONFIRM_HAND,
        payload: hasConfirmedHand
    }
);

export const setStartRoundConfirmation = (confirmedStartRound) => (
    {
        type: Constants.EVENT_TYPE.ASK_START_ROUND,
        payload: confirmedStartRound
    }
);

export const sendFaceDownCard = (card) => (
    {
        type: Constants.LISTENER_TYPE.CARD_FACE_DOWN,
        payload: card,
        emit: true
    }
);

export const sendPlayedCard = (card) => (
    {
        type: Constants.LISTENER_TYPE.CARD_PLAYED,
        payload: card,
        emit: true
    }
);

export const sendHandConfirmation = () => (
    {
        type: Constants.LISTENER_TYPE.FACE_DOWN_CONFIRMED,
        emit: true
    }
);

export const sendNewRoundConfirmation = () => (
    {
        type: Constants.LISTENER_TYPE.START_NEW_ROUND_CONFIRMED,
        emit: true
    }
);

export const sendSelectedTeam = (selectedTeam) => (
    {
        type: Constants.LISTENER_TYPE.SELECT_TEAM,
        payload: selectedTeam,
        emit: true
    }
);

export const sendReplacingPlayerUsername = (playerUsername) => (
    {
        type: Constants.LISTENER_TYPE.REPLACE_PLAYER,
        payload: playerUsername,
        emit: true
    }
);

export const sendVoteRandomTeams = () => (
    {
        type: Constants.LISTENER_TYPE.VOTE_RANDOMIZED_TEAMS,
        emit: true
    }
);