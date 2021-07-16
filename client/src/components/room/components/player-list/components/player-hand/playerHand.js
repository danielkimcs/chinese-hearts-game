import React from "react";
import { getCardImage } from "../../../../../../shared/assets";
import { sendFaceDownCard } from '../../../../../../utility/networking';
const Constants = require('../../../../../../../../shared/constants');

const isSpecialCard = (card) => {
    return Constants.CARD_TYPE.SPECIAL.includes(card.rank + card.suit);
}

const compareCards = (card1, card2) => {
    if (card1.suit !== card2.suit) {
        return Constants.CARD_TYPE.SUITS[card2.suit] - Constants.CARD_TYPE.SUITS[card1.suit];
    } else {
        return Constants.CARD_TYPE.RANKS[card2.rank] - Constants.CARD_TYPE.RANKS[card1.rank];
    }
}
const cardDimensions = 'h-32 w-24 my-2';

export const PlayerHand = ({
    currentCards,
    playCard,
    pause,
    myPlayerId,
    isLegalMove,
    currentTrick,
    hasNotConfirmedHand
}) => {
    let sortedCurrentCards = currentCards.sort(compareCards);

    const setFaceDown = (card) => {
        if (card.faceDown) return;
        if (!isSpecialCard(card)) return;
        if (pause) return;

        sendFaceDownCard(card);
    }

    
    return (
        <div className="grid justify-items-center">
            <div className="flex flex-row flex-wrap justify-center">
                {sortedCurrentCards.map((card) => {
                    if (!card.faceDown && hasNotConfirmedHand) {
                        let isSpecial = isSpecialCard(card);
                        return (
                            <div key={`${card.suit}${card.rank}`}
                                className={`${cardDimensions} ` + (isSpecial ? 'card-active' : 'opacity-40')}
                                onClick={isSpecial ? () => setFaceDown(card) : undefined}>
                                {getCardImage(card.rank, card.suit)}
                            </div>
                        );
                    } else if (!card.faceDown
                        && currentTrick
                        && currentTrick.currentTurnPlayerId === myPlayerId) {
                        let isLegal = isLegalMove(currentTrick, currentCards, card);
                        return (
                            <div key={`${card.suit}${card.rank}`}
                                className={`${cardDimensions} ` + (isLegal ? 'card-active' : 'opacity-40')}
                                onClick={isLegal ? () => playCard(card) : undefined}>
                                {getCardImage(card.rank, card.suit)}
                            </div>
                        );
                    } else {
                        if (card.faceDown) return null;
                        return (
                            <div key={`${card.suit}${card.rank}`}
                                className={`${cardDimensions} opacity-40`}>
                                {getCardImage(card.rank, card.suit)}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}