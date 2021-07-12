const Constants = require('../../shared/constants');

class Player {
    constructor(socket, username) {
        this.username = username;
        this.socket = socket;
        this.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;

        this.currentTeam = "";
        this.nextPlayer = undefined;
        
        this.currentHand = [];
        this.numFaceDown = 0;
        this.hasConfirmedHand = false;
        this.collectedCards = [];
    }

    removeCard(card) {
        let returnCardIndex = -1;
        for (let index in this.currentHand) {
            let currentCard = this.currentHand[index];
            if (currentCard.suit === card.suit && currentCard.rank === card.rank) {
                returnCardIndex = index;
                break;
            }
        }
        if (returnCardIndex < 0) return null;

        let returnCard = this.currentHand[returnCardIndex];
        this.currentHand.splice(returnCardIndex, 1);
        return returnCard;
    }
}

module.exports = Player;