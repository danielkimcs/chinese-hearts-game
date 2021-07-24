const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.VOTE_RANDOMIZED_TEAMS, () => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROOM_SETUP
            && room.currentState !== Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.votes.randomizedTeams = true;

        room.Events.updatePlayerList();

        // Check if every connected player has confirmed starting round
        let everyoneHasVoted = room.getConnectedPlayers()
            .reduce((confirmedSoFar, nextPlayer) => confirmedSoFar && nextPlayer.votes.randomizedTeams, true);

        if (everyoneHasVoted) {
            room.randomizedTeams = true;
            room.startState(Constants.ROOM_STATES.ROOM_SETUP);
        }
    });
}
