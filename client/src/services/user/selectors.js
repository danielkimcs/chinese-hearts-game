export const getUsername = store => store.user.username;

export const getPlayer = store => store.room.players.filter(player => player.username === store.user.username)[0];

export const getPlayerId = store => getPlayer(store).playerId;

export const getCurrentCards = store => store.user.currentCards;

export const getConfirmedHandStatus = store => store.user.hasConfirmedHand;

export const getStartRoundStatus = store => store.user.confirmedStartRound;
