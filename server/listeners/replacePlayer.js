const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.REPLACE_PLAYER, (replacingPlayerUsername) => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || currentPlayerJoined) return;

        let room = rooms[currentPlayerRoomName];
        if (!room.gamePaused) return;
        let playerToReplace = room.players[replacingPlayerUsername];
        room.replacePlayer(playerToReplace, socket, currentPlayerUsername);

        room.updateClient(currentPlayerUsername); // Now update player screen

        socketInfo.currentPlayerJoined = true;

        room.Events.updateDisplayStatus({
            status: true,
            message: ""
        }, playerToReplace);

        room.Events.sendNotification(`${currentPlayerUsername} has replaced ${replacingPlayerUsername}!`);

        room.resumeGameIfPossible();
    });
}