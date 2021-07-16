import React from "react";
import { getCardImage } from "../../../../../../../shared/assets";

const faceDownCardMarginOffset = ["", "ml-4", "ml-8", "ml-12"];

const FaceDownCard = ({ card, index, isLegalMoveWrapper, playCard, currentTurn }) => {
    let isLegal = currentTurn ? isLegalMoveWrapper(card) : false;
    let playableCardStyling = currentTurn && isLegal ? 'hover:cursor-pointer transform hover:-translate-y-4 transition-transform duration-300' : '';

    return (
        <>
            {index === 0 ?
                <div
                    className={`h-20 w-16 ${playableCardStyling}`}
                    onClick={currentTurn && isLegal ? () => playCard(card) : undefined} >
                    {card ? getCardImage(card.rank, card.suit) : getCardImage()}
                </div> : <div
                    className={`h-20 w-16 absolute top-0 ${faceDownCardMarginOffset[index]} ${playableCardStyling}`}
                    onClick={currentTurn && isLegal ? () => playCard(card) : undefined} >
                    {card ? getCardImage(card.rank, card.suit) : getCardImage()}
                </div>
            }
        </>
    );
}

export default FaceDownCard;