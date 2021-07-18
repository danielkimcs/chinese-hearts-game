const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.START_NEW_ROUND_CONFIRMED, () => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROUND_END) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.hasConfirmedStartRound = true;

        room.Events.updatePlayerList();

        // Check if every connected player has confirmed starting round
        let everyoneHasConfirmed = room.getConnectedPlayers()
            .reduce((confirmedSoFar, nextPlayer) => confirmedSoFar && nextPlayer.hasConfirmedStartRound, true);

        if (everyoneHasConfirmed) {
            room.startState(Constants.ROOM_STATES.ROUND_DEAL);
        }
    });
}
