import React from "react";
import { getCardImage } from "../../../../../../shared/assets";

const cardDimensions = 'h-32 w-24 my-2';

const PlayableCard = ({ card, enabled, onClick }) => (
    <div className={`${cardDimensions} ` + (enabled ? 'card-active' : 'opacity-40')}
        onClick={enabled ? onClick : undefined}>
        {getCardImage(card.rank, card.suit)}
    </div>
);

export default PlayableCard;