const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on('disconnect', () => {
        console.log(socket.id, " disconnected");
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        if (!(currentPlayerRoomName in rooms)) return;

        let room = rooms[currentPlayerRoomName];
        room.disconnectPlayer(currentPlayerUsername);

        let connectedPlayerCount = room.getConnectedPlayerCount();
        if (connectedPlayerCount === 0) {
            delete rooms[currentPlayerRoomName];
        }
        else if (connectedPlayerCount < Constants.REQUIRED_NUM_PLAYERS) {
            if (room.currentState === Constants.ROOM_STATES.ROOM_PENDING) return;
            if (room.gamePaused) return;

            if (room.currentState === Constants.ROOM_STATES.ROOM_COUNTDOWN) {
                room.startState(Constants.ROOM_STATES.ROOM_PENDING);
            }
            else if (!room.gamePaused) {
                room.startState(Constants.ROOM_STATES.ROOM_PAUSE);
            }
        }
    });
}