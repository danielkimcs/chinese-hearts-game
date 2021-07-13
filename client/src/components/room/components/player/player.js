import React, { useState } from 'react';
const Constants = require('../../../../../../shared/constants');

const teamColors = {
    [Constants.TEAM_TYPE.TEAM_A]: "bg-red-100",
    [Constants.TEAM_TYPE.TEAM_B]: "bg-blue-100",
}
const disconnectedColor = "bg-gray-200";
const faceDownCardMarginOffset = ["", "ml-4", "ml-8", "ml-12"];
const playerPosition = {
    0: 'TOP',
    1: 'LEFT',
    2: 'RIGHT',
    3: 'BOTTOM'
}

const PlayerUsernameTag = ({ username, textAlign }) => {
    return (
        <div className={`col-span-1 xl:col-span-2 flex flex-col justify-center px-2 ${textAlign}`}>
            <span className="font-light text-lg truncate">{username}</span>
        </div>
    );
}

const FaceDownCardContainer = ({ numFaceDown }) => {

    return (
        <div className="col-span-1 relative overflow-y-hidden">
            {numFaceDown > 0 ? [...Array(numFaceDown)].map((ignore, index) => {
                if (index === 0) {
                    return (<div key={index} className="h-20 w-16">
                        <img src="https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/blue2.svg" className="w-full h-full" alt="" />
                    </div>);
                } else {
                    return (<div key={index} className={`h-20 w-16 absolute top-0 ${faceDownCardMarginOffset[index]}`}>
                        <img src="https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/blue2.svg" className="w-full h-full" alt="" />
                    </div>);
                }
            }) : <div className="h-20 w-16"></div>}
        </div>
    );
}

export const Player = ({ username, status, currentTeam, numFaceDown, index, showConfirmedTag, currentTurn, playedCard, collectedCards, pushUpBottom }) => {
    return (
        <>
            {!currentTeam.length ?
                <div className="font-sans truncate font-light text-center text-gray-800 bg-gray-200 px-3 py-2 m-2 shadow-md">
                    {username}
                </div>
                // TO DO: style Player component when player is actually playing in teams with cards (below)
                : <>
                    {playerPosition[index] === 'RIGHT' || playerPosition[index] === 'BOTTOM' ?
                        <div class={`${playerPosition[index] === 'RIGHT' ? 'col-span-1' : 'col-span-4 h-32 ' + (pushUpBottom ? '-mt-16' : '')}`}>
                            <div class="h-20 w-16 mx-auto">
                                <img src="https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/blue2.svg" class="w-full h-full" alt="" />
                            </div>
                        </div> : null}
                    <div
                        className={`${playerPosition[index] === 'TOP' || playerPosition[index] === 'BOTTOM' ? 'col-span-4 mb-4'
                            : ((collectedCards.length ? 'h-48' : 'h-24') + ' col-span-1 shadow-md pt-1')}
                            ${playerPosition[index] !== 'TOP' && playerPosition[index] !== 'BOTTOM' ? (status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? teamColors[currentTeam] : disconnectedColor) : ''}`}>
                        {playerPosition[index] === 'TOP' ?
                            <div className={`pt-1 mx-auto w-96 ${collectedCards.length ? 'h-48' : 'h-24'} shadow-md ${status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? teamColors[currentTeam] : disconnectedColor}`}>
                                <div className="flex flex-col px-1">
                                    <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                                        <PlayerUsernameTag username={username} textAlign="text-left" />
                                        <FaceDownCardContainer numFaceDown={4} />
                                        {/* <FaceDownCardContainer numFaceDown={numFaceDown} /> */}
                                    </div>
                                </div>
                                {/* Collected cards here */}
                            </div>
                            : <>
                                <div className="w-full flex flex-col px-1">
                                    <div className="grid grid-cols-2 xl:grid-cols-3 my-1">
                                        {playerPosition[index] !== 'RIGHT' ? <>
                                            <PlayerUsernameTag username={username} textAlign="text-left" />
                                            <FaceDownCardContainer numFaceDown={4} />
                                            {/* <FaceDownCardContainer numFaceDown={numFaceDown} /> */}
                                        </> : <>
                                            <FaceDownCardContainer numFaceDown={4} />
                                            {/* <FaceDownCardContainer numFaceDown={numFaceDown} /> */}
                                            <PlayerUsernameTag username={username} textAlign="text-right" />
                                        </>}
                                    </div>
                                </div>
                                {/* Collected cards here */}
                            </>
                        }
                    </div>
                    {playerPosition[index] === 'LEFT' || playerPosition[index] === 'TOP' ?
                        <div class={`${playerPosition[index] === 'LEFT' ? 'col-span-1' : 'col-span-4 h-24'}`}>
                            <div class="h-20 w-16 mx-auto">
                                <img src="https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/blue2.svg" class="w-full h-full" alt="" />
                            </div>
                        </div> : null}
                </>}

            {/* <p style={{
                    textDecoration: (status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? "none" : "line-through"),
                    color: (currentTeam.length ? teamColors[currentTeam] : "black")
                }}>
                    {username ? username + " " : null}
                    {numFaceDown ? numFaceDown + " cards face down" : null}
                    {showConfirmedTag ? "CONFIRMED" : null}
                    {currentTurn ? "<- CURRENT TURN" : null}
                    {playedCard ? playedCard.suit + " " + playedCard.rank + " " + (playedCard.faceDown ? 'F' : '') : null}
                    {collectedCards.map(card => <span key={card.suit + card.rank}>{card.suit} {card.rank} {card.faceDown ? 'F' : null} </span>)}
                </p> */}

        </>
    );
}