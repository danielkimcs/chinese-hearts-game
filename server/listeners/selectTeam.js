const Constants = require('../../shared/constants');

module.exports = function (rooms, socket, socketInfo) {
    socket.on(Constants.LISTENER_TYPE.SELECT_TEAM, (selectedTeam) => {
        let { currentPlayerUsername, currentPlayerRoomName, currentPlayerJoined } = socketInfo;
        if (!currentPlayerUsername || !currentPlayerRoomName || !currentPlayerJoined) return;
        let room = rooms[currentPlayerRoomName];
        if (room.currentState !== Constants.ROOM_STATES.ROOM_SETUP
            && room.currentState !== Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN) return;
        if (room.gamePaused) return;

        let currentPlayer = room.players[currentPlayerUsername];
        currentPlayer.currentTeam = selectedTeam;

        const otherTeam = Constants.TEAM_TYPE.TEAM_A === selectedTeam ? Constants.TEAM_TYPE.TEAM_B : Constants.TEAM_TYPE.TEAM_A;


        room.teams[selectedTeam].members = room.teams[selectedTeam].members
            .filter(player => player.username !== currentPlayerUsername)
            .concat(currentPlayer);

        room.teams[otherTeam].members = room.teams[otherTeam].members
            .filter(player => player.username !== currentPlayerUsername);

        room.Events.updatePlayerList();

        // Check if players have been evenly divided into 2 teams; if so, move on to next phase
        let balanced = 0;
        Object.keys(room.players).forEach(playerUsername => {
            let player = room.players[playerUsername];
            if (player.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED) {
                balanced += player.currentTeam === Constants.TEAM_TYPE.TEAM_A ? 1 :
                    player.currentTeam === Constants.TEAM_TYPE.TEAM_B ? -1 : 100;
            }
        });
        if (balanced === 0) {
            room.startState(Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN);
        } else {
            room.startState(Constants.ROOM_STATES.ROOM_SETUP);
        }
    });
}