const Constants = require('../../shared/constants');

class Trick {
    constructor(startingPlayerUsername) {
        this.startingPlayerUsername = startingPlayerUsername;
        this.currentTurnPlayerUsername = startingPlayerUsername;
        this.leadingSuit = "";
        this.playedCards = {};
    }    
}

module.exports = Trick;