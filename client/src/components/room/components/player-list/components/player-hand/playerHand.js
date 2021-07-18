import React from "react";
import { compareCards } from '../../../../../../utility/helpers';
import { sendFaceDownCard } from '../../../../../../utility/networking';
import PlayableCard from './playableCard';
const Utility = require('../../../../../../../../shared/utility');


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
        if (!Utility.isSpecialCard(card)) return;
        if (pause) return;

        sendFaceDownCard(card);
    }

    return (
        <div className="grid justify-items-center">
            <div className="flex flex-row flex-wrap justify-center">
                {sortedCurrentCards.map((card) => {
                    if (!card.faceDown && hasNotConfirmedHand) {
                        let isSpecial = Utility.isSpecialCard(card);
                        return (
                            <PlayableCard card={card} enabled={isSpecial} onClick={() => setFaceDown(card)} />
                        );
                    } else if (!card.faceDown
                        && currentTrick
                        && currentTrick.currentTurnPlayerId === myPlayerId) {
                        let isLegal = isLegalMove(currentTrick, currentCards, card);
                        return (
                            <PlayableCard card={card} enabled={isLegal} onClick={() => playCard(card)} />
                        );
                    } else {
                        if (card.faceDown) return null;
                        return (
                            <PlayableCard card={card} enabled={false} />
                        );
                    }
                })}
            </div>
        </div>
    );
}