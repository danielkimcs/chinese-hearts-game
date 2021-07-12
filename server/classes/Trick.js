const Constants = require('../../shared/constants');

class Trick {
    constructor(startingPlayerId) {
        this.startingPlayerId = startingPlayerId;
        this.currentTurnPlayerId = startingPlayerId;
        this.leadingSuit = "";
        this.playedCards = {};
    }

    determineWinner() {
        if (!this.leadingSuit) return;
        let winnerId = null;
        let leadingRank = -1;
        for (let playerId in this.playedCards) {
            let card = this.playedCards[playerId];
            if (card.suit === this.leadingSuit
                && Constants.CARD_TYPE.RANKS[card.rank] > leadingRank) {
                winnerId = playerId;
                leadingRank = Constants.CARD_TYPE.RANKS[card.rank];
            }
        }
        return winnerId;
    }

    collectCards() {
        let playedCardsList = Object.values(this.playedCards)
            .filter(card =>
                card.suit === 'HEART' ||
                Constants.CARD_TYPE.SPECIAL.includes(card.rank + card.suit));

        return playedCardsList;
    }
}

module.exports = Trick;