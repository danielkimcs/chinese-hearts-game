import React from "react";
import { getCardImage } from "../../../../../../../shared/assets";
const Constants = require('../../../../../../../../../shared/constants');


const CollectedCardsComponent = ({ collectedCards }) => {
    let sortedCollectedCards = collectedCards.sort((card1, card2) => {
        if (card1.suit !== card2.suit) {
            return Constants.CARD_TYPE.SUITS[card2.suit] - Constants.CARD_TYPE.SUITS[card1.suit];
        } else {
            return Constants.CARD_TYPE.RANKS[card2.rank] - Constants.CARD_TYPE.RANKS[card1.rank];
        }
    });
    return (
        <div className="col-span-1 relative mt-5">
            {sortedCollectedCards.map((card, index) =>
                <div key={index} className={`h-20 w-12 absolute top-0 ${card.faceDown ? '-mt-2' : ''}`} style={{ marginLeft: `${index}rem` }}>
                    {card.faceDown ? <div className="absolute -top-5 -rotate-45"><span className="text-red-600 font-bold text-xs">x2</span></div> : null}
                    {getCardImage(card.rank, card.suit)}
                </div>
            )}
        </div>
    );
}

export default CollectedCardsComponent;