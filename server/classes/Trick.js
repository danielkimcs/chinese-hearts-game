const Constants = require('../../shared/constants');
const { isSpecialCard } = require('../../shared/utility');

class Trick {
    constructor(startingPlayerId) {
        this.startingPlayerId = startingPlayerId;
        this.currentTurnPlayerId = startingPlayerId;
        this.leadingSuit = "";
        this.playedCards = {};
        this.winnerPlayerName = undefined;
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
                isSpecialCard(card));

        return playedCardsList;
    }
}

module.exports = Trick;