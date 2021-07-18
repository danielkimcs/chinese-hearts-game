const Constants = require('../../shared/constants');

module.exports = function(rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.CARD_PLAYED, (card) => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;

        let room = rooms[currentPlayerRoomName];
        if (!(room.currentState === Constants.ROOM_STATES.TRICK_PLAY
            || room.currentState === Constants.ROOM_STATES.TRICK_PENDING)) return;
        if (room.gamePaused) return;
        if (!room.currentTrick) return;

        let currentPlayer = room.players[currentPlayerUsername];
        if (room.currentTrick.currentTurnPlayerId !== currentPlayer.playerId) return;

        let actualCard = currentPlayer.removeCard(card);
        room.Events.updatePlayerCards(currentPlayer);
        room.Events.updatePlayerList();

        let currentTrick = room.currentTrick;
        currentTrick.playedCards[currentPlayer.playerId] = actualCard;

        currentTrick.currentTurnPlayerId = currentPlayer.nextPlayer.playerId;

        if (currentPlayer.playerId === currentTrick.startingPlayerId
            && !currentTrick.leadingSuit.length) {
            currentTrick.leadingSuit = actualCard.suit;
            room.startState(Constants.ROOM_STATES.TRICK_PENDING);
        }
        else if (currentTrick.currentTurnPlayerId === currentTrick.startingPlayerId) {
            // Everyone has played their cards
            currentTrick.currentTurnPlayerId = undefined;
            room.startState(Constants.ROOM_STATES.TRICK_END);
        }
        else {
            room.startState(Constants.ROOM_STATES.TRICK_PENDING);
        }
    });
}