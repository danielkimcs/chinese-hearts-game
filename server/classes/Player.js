const Constants = require('../../shared/constants');

class Player {
    constructor(socket, username) {
        this.username = username;
        this.socket = socket;
        this.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;

        this.currentTeam = "";
        this.nextPlayer = undefined;
        
        this.currentHand = [];
        this.collectedCards = [];
    }

    
}

module.exports = Player;