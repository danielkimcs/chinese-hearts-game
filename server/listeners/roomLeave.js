const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on('disconnect', () => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        console.log(socket.id, " disconnected");
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
            else if (room.currentState === Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN) {
                room.startState(Constants.ROOM_STATES.ROOM_SETUP);
                room.startState(Constants.ROOM_STATES.ROOM_PAUSE);
            }
            else if (!room.gamePaused) {
                room.startState(Constants.ROOM_STATES.ROOM_PAUSE);
            }
        }

        room.Events.sendNotification(`${currentPlayerUsername} has disconnected!`);
    });
}