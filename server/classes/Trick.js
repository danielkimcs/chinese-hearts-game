const Constants = require('../../shared/constants');

class Trick {
    constructor(startingPlayerId) {
        this.startingPlayerId = startingPlayerId;
        this.currentTurnPlayerId = startingPlayerId;
        this.leadingSuit = "";
        this.playedCards = {};
    }    
}

module.exports = Trick;