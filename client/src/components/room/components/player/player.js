import React, { useState } from 'react';
import { getCardImage } from '../../../../shared/assets';
const Constants = require('../../../../../../shared/constants');

const teamColors = {
    [Constants.TEAM_TYPE.TEAM_A]: "text-red-400",
    [Constants.TEAM_TYPE.TEAM_B]: "text-blue-400",
}
const disconnectedColor = "text-gray-400";
const faceDownCardMarginOffset = ["", "ml-4", "ml-8", "ml-12"];
const playerPosition = {
    0: 'TOP',
    1: 'LEFT',
    2: 'RIGHT',
    3: 'BOTTOM'
}

const PlayerStatusTag = ({ showConfirmedTag, currentTurn }) => {
    return (
        <>
            {showConfirmedTag ?
                <svg className="h-full w-6 text-green-500 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                : (currentTurn ?
                    <svg className="h-full w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg> : null)}
        </>
    );
}

const PlayerUsernameTag = ({ username, status, currentTeam, textAlign, showConfirmedTag, currentTurn, isBottom }) => {
    return (
        <div className={`col-span-1 xl:col-span-2 flex flex-col justify-center px-2 ${textAlign}`}>
            <div className={`flex flex-row ${!isBottom ? 'bg-gray-200 rounded-xl ' + (textAlign === 'text-left' ? 'pr-2' : 'pl-2') : ''}`}>
                {textAlign === 'text-left' ?
                    <div className={`inline-block flex-none align-middle mr-2 truncate`}>
                        <PlayerStatusTag showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} />
                    </div> : null}
                <div className="inline-block flex-grow align-middle truncate">
                    <span className={`font-bold text-lg truncate ` + (status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? teamColors[currentTeam] : disconnectedColor)}>
                        {`${isBottom ? 'You: ' : ''}${username}`}
                    </span>
                </div>
                {textAlign === 'text-right' ?
                    <div className={`inline-block flex-none align-middle ml-2 truncate`}>
                        <PlayerStatusTag showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} />
                    </div> : null}
            </div>
        </div>
    );
}

const FaceDownCard = ({ card, index, isLegalMoveWrapper, playCard, currentTurn }) => {
    let isLegal = currentTurn ? isLegalMoveWrapper(card) : false;
    let playableCardStyling = currentTurn && isLegal ? 'hover:cursor-pointer transform hover:-translate-y-4 transition-transform duration-300' : '';

    return (
        <>
            {index === 0 ?
                <div
                    className={`h-20 w-16 ` + playableCardStyling}
                    onClick={currentTurn && isLegal ? () => playCard(card) : undefined}
                >
                    {card ? getCardImage(card.rank, card.suit) : getCardImage()}
                </div> : <div
                    className={`h-20 w-16 absolute top-0 ${faceDownCardMarginOffset[index]} ` + playableCardStyling}
                    onClick={currentTurn && isLegal ? () => playCard(card) : undefined}
                >
                    {card ? getCardImage(card.rank, card.suit) : getCardImage()}
                </div>
            }
        </>
    );
}

const FaceDownCardContainer = ({ numFaceDown, myFaceDownCards, isLegalMoveWrapper, playCard, currentTurn }) => {
    return (
        <div className="col-span-1 relative">
            {numFaceDown > 0 ? myFaceDownCards ? myFaceDownCards.map((card, index) =>
                <FaceDownCard key={index} card={card} index={index} isLegalMoveWrapper={isLegalMoveWrapper} playCard={playCard} currentTurn={currentTurn} />
            ) : [...Array(numFaceDown)].map((_, index) =>
                <FaceDownCard key={index} card={null} index={index} />
            ) : <div className="h-20 w-16" />}
        </div>
    );
}

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
                <div className={`h-20 w-12 absolute top-0 ${card.faceDown ? '-mt-2' : ''}`} style={{ marginLeft: `${index}rem` }}>
                    {card.faceDown ? <div className="absolute -top-5 -rotate-45"><span className="text-red-600 font-bold text-xs">x2</span></div> : null}
                    {getCardImage(card.rank, card.suit)}
                </div>
            )}
        </div>
    );
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
                                        <PlayerUsernameTag username={username} status={status} currentTeam={currentTeam} textAlign="text-left" showConfirmedTag={showConfirmedTag} currentTurn={currentTurn} isBottom={playerPosition[index] === 'BOTTOM'}/>
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