const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.CARD_FACE_DOWN, (card) => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;

        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROUND_CONFIRM) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        let actualCard = currentPlayer.currentHand.filter(c => c.suit === card.suit && c.rank === card.rank)[0];

        actualCard.faceDown = true;
        if (actualCard.suit === 'HEART' && actualCard.rank === 'ACE') {
            room.doubleHeartPoints = true;
        }
        currentPlayer.numFaceDown++;
        room.Events.updatePlayerList();
        room.Events.updatePlayerCards(currentPlayer);
    });
}