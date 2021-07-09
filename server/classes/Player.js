const Constants = require('../../shared/constants');

class Player {
    constructor(socket, username) {
        this.username = username;
        this.socket = socket;
        this.status = "connected";

        this.currentHand = [];
        this.currentTeam = "";
        this.collectedCards = [];
        this.nextPlayer = undefined;
    }
    

}

module.exports = Player;