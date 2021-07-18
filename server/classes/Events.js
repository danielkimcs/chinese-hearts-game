const Constants = require('../../shared/constants');

class Events {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayerList() {
        let playerObjects = Object.values(this.room.players).map(playerObj => {
            return {
                username: playerObj.username,
                playerId: playerObj.playerId,
                status: playerObj.status,
                currentTeam: playerObj.currentTeam,
                nextPlayerUsername: playerObj.nextPlayer ? playerObj.nextPlayer.username : "",
                hasConfirmedHand: playerObj.hasConfirmedHand,
                hasConfirmedStartRound: playerObj.hasConfirmedStartRound,
                numFaceDown: playerObj.numFaceDown,
                collectedCards: playerObj.collectedCards,
                points: playerObj.points,
            }
        });
        this.room.io.to(this.room.roomName).emit(Constants.EVENT_TYPE.UPDATE_PLAYER_LIST, playerObjects);
    }

    updateCountdown(countdown) {
        this.room.io.in(this.room.roomName).emit(Constants.EVENT_TYPE.GAME_STARTING_COUNTDOWN, countdown);
    }

    updateRoomState(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.UPDATE_ROOM_STATE, this.room.currentState);
    }

    pauseGame(paused, player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.GAME_PAUSE, paused);
    }

    updatePlayerCards(player) {
        if (!player
            || !player.socket
            || !player.socket.id
            || player.status !== Constants.PLAYER_STATUS.PLAYER_CONNECTED) return;
        this.room.io.in(player.socket.id).emit(Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS, player.currentHand);
    }

    askConfirmHand(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.ASK_CONFIRM_HAND);
    }

    askStartRound(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.ASK_START_ROUND);
    }

    updateCurrentTrick() {
        let currentTrick = this.room.currentTrick;
        this.room.io.in(this.room.roomName).emit(Constants.EVENT_TYPE.TRICK_ASK_CARD, currentTrick);
    }
}

module.exports = Events;