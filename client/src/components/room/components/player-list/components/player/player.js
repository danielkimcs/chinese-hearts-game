import React from 'react';
import PlayerUsernameTag from './components/playerUsernameTag';
import FaceDownCardContainer from './components/faceDownCardContainer';
import PlayedCardComponent from './components/playedCardComponent';
import CollectedCardsComponent from './components/collectedCardsComponent';

const Constants = require('../../../../../../../../shared/constants');

const playerPosition = {
    0: 'TOP',
    1: 'LEFT',
    2: 'RIGHT',
    3: 'BOTTOM'
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

    return (
        <>
            {!currentTeam.length ?
                <div className="font-sans truncate font-light text-center text-gray-800 bg-gray-200 px-3 py-2 m-2">
                    {username}
                </div>
                : <>
                    {playerPosition[index] === 'RIGHT' || playerPosition[index] === 'BOTTOM' ?
                        <div className={`${playerPosition[index] === 'RIGHT' ? 'col-span-1' : 'col-span-4 h-32 ' + (pushUpBottom ? '-mt-16' : '')}`}>
                            <PlayedCardComponent playedCard={playedCard} />
                        </div> : null}
                    <div
                        className={`${playerPosition[index] === 'TOP' || playerPosition[index] === 'BOTTOM' ? 'col-span-4 mb-4'
                            : ((collectedCards.length ? 'h-48' : 'h-24') + ' col-span-1 pt-1')}`}>
                        {playerPosition[index] === 'TOP' ?
                            <div className={`pt-1 mx-auto w-96 ${collectedCards.length ? 'h-48' : 'h-24'}`}>
                                <div className="flex flex-col px-1">
                                    <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                                        <PlayerUsernameTag username={username} status={status} currentTeam={currentTeam} textAlign="text-left" showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} isBottom={playerPosition[index] === 'BOTTOM'} />
                                        <FaceDownCardContainer numFaceDown={numFaceDown} />
                                    </div>
                                </div>
                                {collectedCards.length ? <CollectedCardsComponent collectedCards={collectedCards} /> : null}
                            </div>
                            : <>
                                <div className="w-full flex flex-col px-1">
                                    <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                                        {playerPosition[index] !== 'RIGHT' ? <>
                                            <PlayerUsernameTag username={username} status={status} currentTeam={currentTeam} textAlign="text-left" showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} isBottom={playerPosition[index] === 'BOTTOM'} />
                                            <FaceDownCardContainer numFaceDown={numFaceDown} myFaceDownCards={playerPosition[index] === 'BOTTOM' ? myFaceDownCards : null} isLegalMoveWrapper={isLegalMoveWrapper} playCard={playCard} currentTurn={currentTurn} />
                                        </> : <>
                                            <FaceDownCardContainer numFaceDown={numFaceDown} />
                                            <PlayerUsernameTag username={username} status={status} currentTeam={currentTeam} textAlign="text-right" showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} isBottom={playerPosition[index] === 'BOTTOM'} />
                                        </>}
                                    </div>
                                </div>
                                {collectedCards.length ? <CollectedCardsComponent collectedCards={collectedCards} /> : null}
                            </>
                        }
                    </div>
                    {playerPosition[index] === 'LEFT' || playerPosition[index] === 'TOP' ?
                        <div className={`${playerPosition[index] === 'LEFT' ? 'col-span-1' : 'col-span-4 h-24'}`}>
                            <PlayedCardComponent playedCard={playedCard} />
                        </div> : null}
                </>}
        </>
    );
}