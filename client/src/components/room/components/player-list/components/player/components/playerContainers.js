import React from "react";
import PlayerUsernameTag from './playerUsernameTag';
import FaceDownCardContainer from './faceDownCardContainer';

const TopPlayer = ({ username, status, currentTeam, numFaceDown, showConfirmedTag, currentTurn, collectedCards }) => {
    return (
        <div className={`pt-1 mx-auto w-96 ${collectedCards.length ? 'h-48' : 'h-24'}`}>
            <div className="flex flex-col px-1">
                <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                    <PlayerUsernameTag
                        {...{ username, status, currentTeam, showConfirmedTag, currentTurn }}
                        textAlign="text-left"
                        isBottom={false} />
                    <FaceDownCardContainer numFaceDown={numFaceDown} />
                </div>
            </div>
            {collectedCards.length ? <CollectedCardsComponent collectedCards={collectedCards} /> : null}
        </div>
    );
}

const LeftOrRightPlayerTag = ({ numFaceDown, username, status, currentTeam, showConfirmedTag, currentTurn, left }) => {
    let usernameTag = (
        <PlayerUsernameTag
            {...{ username, status, currentTeam, showConfirmedTag, currentTurn }}
            textAlign="text-left"
            isBottom={false} />
    );
    let faceDownContainer = (
        <FaceDownCardContainer numFaceDown={numFaceDown} />
    );
    return (
        <> {left ? <>
            {usernameTag}
            {faceDownContainer}
        </> : <>
            {faceDownContainer}
            {usernameTag}
        </>} </>
    );
}

const BottomPlayerTag = ({ numFaceDown, username, status, currentTeam, showConfirmedTag, currentTurn, isLegalMoveWrapper, playCard, myFaceDownCards }) => {
    return (
        <>
            <PlayerUsernameTag
                {...{ username, status, currentTeam, showConfirmedTag, currentTurn }}
                textAlign="text-left"
                isBottom={true} />
            <FaceDownCardContainer {...{ numFaceDown, isLegalMoveWrapper, playCard, currentTurn, myFaceDownCards }} />
        </>
    );
}

export {
    TopPlayer,
    LeftOrRightPlayerTag,
    BottomPlayerTag
}