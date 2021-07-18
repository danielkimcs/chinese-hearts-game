const Room = require('../classes/Room');
const Constants = require('../../shared/constants');


module.exports = function (rooms, socket, socketInfo, io) {
    socket.on(Constants.LISTENER_TYPE.ROOM_JOIN, ({ username, roomName }, callback) => {
        socketInfo.currentPlayerUsername = username;
        socketInfo.currentPlayerRoomName = roomName;

        let currentPlayerRoom;

        if (socketInfo.currentPlayerRoomName in rooms) {
            currentPlayerRoom = rooms[socketInfo.currentPlayerRoomName];
            if (currentPlayerRoom.isRoomFull()) {
                callback({
                    status: false,
                    message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_FULL
                });
                return;
            }
            if (currentPlayerRoom.isUsernameTaken(socketInfo.currentPlayerUsername)) {
                callback({
                    status: false,
                    message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.USERNAME_TAKEN
                });
                return;
            }

            console.log(`Socket ${socket.id} joining ${roomName}`);
            socket.join(socketInfo.currentPlayerRoomName);

            // Room is not full, and there is no connected player with same username
            if (currentPlayerRoom.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                currentPlayerRoom.addPlayer(socket, socketInfo.currentPlayerUsername);
            }
            else {
                // Replace disconnected player
                let playerToReplace = (socketInfo.currentPlayerUsername in currentPlayerRoom.players) ?
                    currentPlayerRoom.players[socketInfo.currentPlayerUsername]
                    : currentPlayerRoom.fetchDisconnectedPlayer();
                if (!playerToReplace) {
                    callback({
                        status: false,
                        message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.GENERAL_ERROR
                    });
                    return;
                }
                currentPlayerRoom.replacePlayer(playerToReplace, socket, socketInfo.currentPlayerUsername);
                // Now update player screen
                currentPlayerRoom.updateClient(socketInfo.currentPlayerUsername);
            }
        }
        else {
            console.log(`Socket ${socket.id} joining ${roomName}`);
            socket.join(socketInfo.currentPlayerRoomName);

            rooms[socketInfo.currentPlayerRoomName] = new Room(io, socketInfo.currentPlayerRoomName);
            currentPlayerRoom = rooms[socketInfo.currentPlayerRoomName];
            currentPlayerRoom.addPlayer(socket, socketInfo.currentPlayerUsername);
        }

        // Room is now full so start countdown or resume game
        if (currentPlayerRoom.isRoomFull()) {
            if (currentPlayerRoom.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                currentPlayerRoom.startState(Constants.ROOM_STATES.ROOM_COUNTDOWN);
            }
            else if (currentPlayerRoom.currentState !== Constants.ROOM_STATES.ROOM_COUNTDOWN
                && currentPlayerRoom.gamePaused) {
                currentPlayerRoom.startState(currentPlayerRoom.currentState);
                currentPlayerRoom.togglePause(false);
            }
        }

        socketInfo.currentPlayerJoined = true;
        callback({
            status: true,
            message: ""
        });
    });
}