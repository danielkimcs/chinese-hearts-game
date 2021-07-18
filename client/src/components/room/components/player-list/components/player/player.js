import React from 'react';
import {
    TopPlayer,
    LeftOrRightPlayerTag,
    BottomPlayerTag
} from './components/playerContainers';
import PlayedCardComponent from './components/playedCardComponent';
import CollectedCardsComponent from './components/collectedCardsComponent';

const indexToPosition = {
    0: 'TOP',
    1: 'LEFT',
    2: 'RIGHT',
    3: 'BOTTOM'
}
const checkPlayerPosition = (position, acceptablePositions) => {
    return acceptablePositions.reduce((overallBoolean, currentPosition) => overallBoolean || (position === currentPosition), false);
}

export const Player = ({
    username,
    status,
    currentTeam,
    numFaceDown,
    index,
    showConfirmedTag,
    currentTurn,
    playedCard,
    collectedCards,
    pushUpBottom,
    myFaceDownCards,
    isLegalMoveWrapper,
    playCard
}) => {
    let currentPlayerPosition = indexToPosition[index];

    return (
        <>
            {!currentTeam.length ?
                <div className="font-sans truncate font-light text-center text-gray-800 bg-gray-200 px-3 py-2 m-2">
                    {username}
                </div>
                : <>
                    {checkPlayerPosition(currentPlayerPosition, ['RIGHT', 'BOTTOM']) ?
                        <div className={`${checkPlayerPosition(currentPlayerPosition, ['RIGHT']) ? 'col-span-1' : 'col-span-4 h-32 ' + (pushUpBottom ? '-mt-16' : '')}`}>
                            <PlayedCardComponent playedCard={playedCard} />
                        </div> : null}
                    <div className={`${checkPlayerPosition(currentPlayerPosition, ['TOP', 'BOTTOM']) ? 'col-span-4 mb-4'
                        : ((collectedCards.length ? 'h-48' : 'h-24') + ' col-span-1 pt-1')}`}>
                        {checkPlayerPosition(currentPlayerPosition, ['TOP']) ?
                            <TopPlayer {...{ username, status, currentTeam, numFaceDown, showConfirmedTag, currentTurn, collectedCards }} />
                            : <>
                                <div className="w-full flex flex-col px-1">
                                    <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                                        {currentPlayerPosition !== 'RIGHT' ?
                                            currentPlayerPosition === 'LEFT' ?
                                                <LeftOrRightPlayerTag
                                                    {...{ numFaceDown, username, status, currentTeam, showConfirmedTag, currentTurn }}
                                                    left={true} />
                                                : <BottomPlayerTag {...{ numFaceDown, username, status, currentTeam, showConfirmedTag, currentTurn, isLegalMoveWrapper, playCard, myFaceDownCards }} />
                                            : <LeftOrRightPlayerTag
                                                {...{ numFaceDown, username, status, currentTeam, showConfirmedTag, currentTurn }}
                                                left={false} />
                                        }
                                    </div>
                                </div>
                                {collectedCards.length ? <CollectedCardsComponent collectedCards={collectedCards} /> : null}
                            </>
                        }
                    </div>
                    {checkPlayerPosition(currentPlayerPosition, ['LEFT', 'TOP']) ?
                        <div className={`${checkPlayerPosition(currentPlayerPosition, ['LEFT']) ? 'col-span-1' : 'col-span-4 h-24'}`}>
                            <PlayedCardComponent playedCard={playedCard} />
                        </div> : null}
                </>}
        </>
    );
}
