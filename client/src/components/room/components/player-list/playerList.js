import React from 'react';
import Player from '../player';
import {
    sendFaceDownCard,
    sendPlayedCard
} from '../../../../utility/networking';
import { getCardImage } from '../../../../shared/assets';
const Constants = require('../../../../../../shared/constants');

const isLegalMove = (currentTrick, currentHand, playedCard) => {
    if (!currentTrick) return false;
    if (!currentTrick.leadingSuit.length || playedCard.suit === currentTrick.leadingSuit) return true;
    return !currentHand.filter(card => card.suit === currentTrick.leadingSuit).length;
}

const compareCards = (card1, card2) => {
    if (card1.suit !== card2.suit) {
        return Constants.CARD_TYPE.SUITS[card2.suit] - Constants.CARD_TYPE.SUITS[card1.suit];
    } else {
        return Constants.CARD_TYPE.RANKS[card2.rank] - Constants.CARD_TYPE.RANKS[card1.rank];
    }
}

export const PlayerList = ({ myUsername, players, roomState, currentCards, currentTrick, hasConfirmedHand, pause, startingCountdown }) => {
    const isLegalMoveWrapper = (playedCard) => {
        if (playedCard == null) return false;
        return isLegalMove(currentTrick, currentCards, playedCard);
    }

    const renderPlayerList = () => {
        let teamPlayers = players.filter(player =>
            player.currentTeam.length > 0
            && player.nextPlayerUsername.length > 0);
        if (teamPlayers.length !== Constants.REQUIRED_NUM_PLAYERS) {
            return players.filter(player => player.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED);
        }
        else { // Players are now divided in teams so display in proper playing order
            // TO DO: styling clockwise order in perspective of current player
            let usernameToPlayerObj = {};
            teamPlayers.forEach(playerObj => usernameToPlayerObj[playerObj.username] = playerObj);

            let myPlayerObj = teamPlayers.filter(player => player.username === myUsername)[0];
            let sortedTeamPlayers = [myPlayerObj];
            let currentPlayerUsername = sortedTeamPlayers[0].nextPlayerUsername;
            while (currentPlayerUsername.localeCompare(sortedTeamPlayers[0].username) !== 0) {
                let currentPlayerObj = usernameToPlayerObj[currentPlayerUsername];
                sortedTeamPlayers.push(currentPlayerObj);
                currentPlayerUsername = currentPlayerObj.nextPlayerUsername;
            }

            return sortedTeamPlayers;
        }
    }

    const isSpecialCard = (card) => {
        return Constants.CARD_TYPE.SPECIAL.includes(card.rank + card.suit);
    }

    const setFaceDown = (card) => {
        if (card.faceDown) return;
        if (!isSpecialCard(card)) return;
        if (pause) return;

        sendFaceDownCard(card);
    }

    const playCard = (card) => {
        sendPlayedCard(card);
    }

    let renderedPlayerList = renderPlayerList();
    let playerListOrdered = [renderedPlayerList[2], renderedPlayerList[1], renderedPlayerList[3], renderedPlayerList[0]];
    let sortedCurrentCards = currentCards.sort(compareCards);

    return (
        <div className="px-8">
            {roomState === Constants.ROOM_STATES.ROOM_PENDING
                || roomState === Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                <div className="w-2/3 mx-auto grid justify-items-center p-3 my-2 mt-12">
                    <div className="mb-4">
                        <span className="font-medium">
                            {startingCountdown ?
                                `Starting in ${startingCountdown}...`
                                : `Waiting for players... (${renderedPlayerList.length} / 4)`}
                        </span>
                    </div>
                    <div className="w-2/3 grid grid-flow-row grid-cols-2 grid-rows-2">
                        {renderedPlayerList.map(player =>
                            <Player
                                key={player.username}
                                {...player} />
                        )}
                    </div>
                </div>
                : <div className="grid grid-cols-4">
                    {playerListOrdered.map((player, index) =>
                        <Player
                            key={player.username}
                            {...player}
                            index={index}
                            showConfirmedTag={player.hasConfirmedHand && roomState === Constants.ROOM_STATES.ROUND_CONFIRM}
                            currentTurn={currentTrick && currentTrick.currentTurnPlayerId === player.playerId}
                            playedCard={currentTrick && player.playerId in currentTrick.playedCards ? currentTrick.playedCards[player.playerId] : null}
                            pushUpBottom={playerListOrdered[1].collectedCards.length || playerListOrdered[2].collectedCards.length}
                            myFaceDownCards={sortedCurrentCards.filter(card => card.faceDown)}
                            isLegalMoveWrapper={isLegalMoveWrapper}
                            playCard={playCard} />
                    )}
                </div>}
            {currentCards.length ?
                <div className="grid justify-items-center">
                    <div className="flex flex-row">
                        {sortedCurrentCards.map((card) => {
                            if (!card.faceDown && roomState === Constants.ROOM_STATES.ROUND_CONFIRM && !hasConfirmedHand) {
                                let isSpecial = isSpecialCard(card);
                                return (
                                    <div key={`${card.suit}${card.rank}`}
                                        className={`h-32 w-24 ` + (isSpecial ? 'hover:cursor-pointer' : 'opacity-40')}
                                        onClick={isSpecial ? () => setFaceDown(card) : undefined}>
                                        {getCardImage(card.rank, card.suit)}
                                    </div>
                                );
                            } else if (!card.faceDown
                                && currentTrick
                                && currentTrick.currentTurnPlayerId === players.filter(player => player.username === myUsername)[0].playerId) {
                                let isLegal = isLegalMove(currentTrick, currentCards, card);
                                return (
                                    <div key={`${card.suit}${card.rank}`}
                                        className={`h-32 w-24 ` + (isLegal ? 'hover:cursor-pointer' : 'opacity-40')}
                                        onClick={isLegal ? () => playCard(card) : undefined}>
                                        {getCardImage(card.rank, card.suit)}
                                    </div>
                                );
                            } else {
                                if (card.faceDown) return null;
                                return (
                                    <div key={`${card.suit}${card.rank}`}
                                        className={`h-32 w-24 opacity-40`}>
                                        {getCardImage(card.rank, card.suit)}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div> : null}
        </div>
    );
}