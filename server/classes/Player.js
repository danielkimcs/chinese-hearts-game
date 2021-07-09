const Constants = require('../../shared/constants');

class Player {
    constructor(socket, username) {
        this.username = username;
        this.socket = socket;
        this.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;

        this.currentHand = [];
        this.currentTeam = "";
        this.collectedCards = [];
        this.nextPlayer = undefined;
    }
    
    setSocket(newSocket) {
        this.socket = newSocket;
    }
}

module.exports = Player;