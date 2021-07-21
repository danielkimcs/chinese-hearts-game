const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.SELECT_TEAM, (selectedTeam) => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROOM_SETUP) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.currentTeam = selectedTeam;

        room.Events.updatePlayerList();

        // Check if players have been evenly divided into 2 teams; if so, move on to next phase
    });
}