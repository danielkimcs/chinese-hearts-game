import React from "react";
import { getCardImage } from "../../../../../../../shared/assets";

const PlayedCardComponent = ({ playedCard }) => {
    return (
        <div className="h-28 w-20 mx-auto relative">
            {playedCard ? <>
                {playedCard.faceDown ?
                    <div className="absolute -top-3 -right-2"><span className="text-red-600 font-bold">x2</span></div> : null}
                {getCardImage(playedCard.rank, playedCard.suit)}
            </> : null}
        </div>
    );
}

export default PlayedCardComponent;