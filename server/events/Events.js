const Constants = require('../../shared/constants');

class Events {
    constructor(parent) {
        this.room = parent;
    }

    updatePlayerList(player = null) {
        let filteredPlayers = Object.values(this.room.players).map(player => {
            return {
                username: player.username,
                playerId: player.playerId,
                status: player.status,
                currentTeam: player.currentTeam,
                nextPlayerUsername: player.nextPlayer ? player.nextPlayer.username : "",
                hasConfirmedHand: player.hasConfirmedHand,
                hasConfirmedStartRound: player.hasConfirmedStartRound,
                numFaceDown: player.numFaceDown,
                collectedCards: player.collectedCards,
                points: player.points,
                votes: player.votes,
            }
        });
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.to(roomDestination).emit(Constants.EVENT_TYPE.UPDATE_PLAYER_LIST, filteredPlayers);
    }

    updateCountdown(countdown, eventType) {
        this.room.io.in(this.room.roomName).emit(eventType, countdown);
    }

    updateRoomState(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.UPDATE_ROOM_STATE, this.room.currentState);
    }

    updateCurrentTrick() {
        let currentTrick = this.room.currentTrick;
        this.room.io.in(this.room.roomName).emit(Constants.EVENT_TYPE.TRICK_ASK_CARD, currentTrick);
    }

    updatePlayerCards(player) {
        if (!player
            || !player.socket
            || !player.socket.id
            || player.status !== Constants.PLAYER_STATUS.PLAYER_CONNECTED) return;
        this.room.io.in(player.socket.id).emit(Constants.EVENT_TYPE.UPDATE_PLAYER_CARDS, player.currentHand);
    }

    announceWinningTeam(winner) {
        this.room.io.in(this.room.roomName).emit(Constants.EVENT_TYPE.ANNOUNCE_WINNER, winner);
    }

    pauseGame(paused, player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.GAME_PAUSE, paused);
    }

    askConfirmHand(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.ASK_CONFIRM_HAND, player.hasConfirmedHand);
    }

    askStartRound(player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.ASK_START_ROUND, player.hasConfirmedStartRound);
    }

    updateDisplayStatus(response, player) {
        this.room.io.in(player.socket.id).emit(Constants.EVENT_TYPE.UPDATE_DISPLAY_STATUS, response);
    }

    sendNotification(message, player = null) {
        let roomDestination = player ? player.socket.id : this.room.roomName;
        this.room.io.in(roomDestination).emit(Constants.EVENT_TYPE.NOTIFICATION, message);
    }
}

module.exports = Events;