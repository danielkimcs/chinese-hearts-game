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

            // At this point, the room is not full, and there is no connected player with same username
            if (currentPlayerRoom.currentState === Constants.ROOM_STATES.ROOM_PENDING) {
                currentPlayerRoom.addPlayer(socket, socketInfo.currentPlayerUsername);
            }
            else {
                // Bring player to rejoin panel
                currentPlayerRoom.Events.updatePlayerList();
                currentPlayerRoom.Events.updateRoomState({ socket });
                callback({
                    status: false,
                    message: Constants.ROOM_JOIN_FAILURE_MSG_TYPE.REJOIN_PENDING
                });

                return;
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
        currentPlayerRoom.resumeGameIfPossible();

        socketInfo.currentPlayerJoined = true;
        callback({
            status: true,
            message: ""
        });
    });
}