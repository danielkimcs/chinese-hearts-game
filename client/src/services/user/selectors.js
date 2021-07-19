export const getUsername = store => store.user.username;

export const getPlayerId = store => store.room.players.filter(player => player.username === store.user.username)[0].playerId;

export const getCurrentCards = store => store.user.currentCards;

export const getConfirmedHandStatus = store => store.user.hasConfirmedHand;

export const getStartRoundStatus = store => store.user.confirmedStartRound;
