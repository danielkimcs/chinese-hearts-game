const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.FACE_DOWN_CONFIRMED, () => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROUND_CONFIRM) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.hasConfirmedHand = true;

        room.Events.updatePlayerList();

        // Check if every connected player has confirmed hand
        let everyoneHasConfirmed = room.getConnectedPlayers()
            .reduce((confirmedSoFar, nextPlayer) => confirmedSoFar && nextPlayer.hasConfirmedHand, true);

        if (everyoneHasConfirmed) {
            room.startState(Constants.ROOM_STATES.ROUND_START);
        }
    });
}