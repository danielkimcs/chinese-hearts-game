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
        this.points = 0;
        this.pointsOutdated = false;

        this.hasConfirmedHand = false;
        this.currentHand = [];
        this.numFaceDown = 0;
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

    calculatePoints(doubleHearts) {
        if (!this.collectedCards.length) return 0;
        if (this.collectedCards.length === 1
            && this.collectedCards[0].rank === '10'
            && this.collectedCards[0].suit === 'CLUB') {
            // Player only has the multiplier card, which is +50 points (+100 if face down)
            let currentCardMultiplier = this.collectedCards[0].faceDown ? 2 : 1;
            return Constants.CARD_POINTS['10CLUB'] * currentCardMultiplier;
        }

        let points = 0;
        let overall_multiplier = 1;
        this.collectedCards.forEach(card => {
            if (card.suit === 'HEART') {
                let currentCardMultiplier = doubleHearts ? 2 : 1;
                points += Constants.CARD_POINTS.HEART[card.rank] * currentCardMultiplier;
            } else {
                let key = card.rank + card.suit;
                let currentCardMultiplier = card.faceDown ? 2 : 1;
                if (key === 'JACKDIAMOND' || key === 'QUEENSPADE') {
                    points += Constants.CARD_POINTS[key] * currentCardMultiplier;
                } else if (key === '10CLUB') {
                    overall_multiplier = 2 * currentCardMultiplier;
                } else {
                    console.log("huh??");
                }
            }
        });
        points *= overall_multiplier;
        return points;
    }
}

module.exports = Player;