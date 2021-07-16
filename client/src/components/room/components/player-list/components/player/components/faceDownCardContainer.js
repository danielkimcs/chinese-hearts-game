import React from "react";
import FaceDownCard from './faceDownCard';


const FaceDownCardContainer = ({ numFaceDown, myFaceDownCards, isLegalMoveWrapper, playCard, currentTurn }) => {
    return (
        <div className="col-span-1 relative">
            {numFaceDown > 0 ? myFaceDownCards ? myFaceDownCards.map((card, index) =>
                <FaceDownCard  key={index} {...{card, index, isLegalMoveWrapper, playCard, currentTurn}} />
            ) : [...Array(numFaceDown)].map((_, index) =>
                <FaceDownCard key={index} card={null} index={index} />
            ) : <div className="h-20 w-16" />}
        </div>
    );
}

export default FaceDownCardContainer;