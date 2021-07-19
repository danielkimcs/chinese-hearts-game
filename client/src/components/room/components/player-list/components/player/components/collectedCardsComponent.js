import React from "react";
import { getCardImage } from "../../../../../../../shared/assets";
import { compareCards } from "../../../../../../../utility/helpers";


const CollectedCardsComponent = ({ collectedCards }) => {
    let sortedCollectedCards = collectedCards.sort(compareCards);
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