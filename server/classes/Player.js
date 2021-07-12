const { v4: uuidv4 } = require('uuid');
const Constants = require('../../shared/constants');

class Player {
    constructor(socket, username) {
        this.username = username;
        this.playerId = uuidv4();
        this.socket = socket;
        this.status = Constants.PLAYER_STATUS.PLAYER_CONNECTED;

        this.currentTeam = "";
        this.nextPlayer = undefined;
        this.hasConfirmedHand = false;
        
        this.currentHand = [];
        this.numFaceDown = 0; // TO DO: update this count when a player plays a face down card!
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
        if (returnCard.faceDown) this.numFaceDown--;
        
        return returnCard;
    }
}

module.exports = Player;