import React from 'react';
import Player from '../player';
import {
    sendFaceDownCard,
    sendPlayedCard
} from '../../../../utility/networking';
const Constants = require('../../../../../../shared/constants');

const isLegalMove = (currentTrick, currentHand, playedCard) => {
    if (!currentTrick.leadingSuit.length || playedCard.suit === currentTrick.leadingSuit) return true;
    return !currentHand.filter(card => card.suit === currentTrick.leadingSuit).length;
}

export const PlayerList = ({ myUsername, players, roomState, currentCards, currentTrick, hasConfirmedHand, pause }) => {
    const renderPlayerList = () => {
        let teamPlayers = players.filter(player =>
            player.currentTeam.length > 0
            && player.nextPlayerUsername.length > 0);
        if (teamPlayers.length !== Constants.REQUIRED_NUM_PLAYERS) {
            return players;
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

    const compareCards = (card1, card2) => {
        if (card1.suit !== card2.suit) {
            return Constants.CARD_TYPE.SUITS[card2.suit] - Constants.CARD_TYPE.SUITS[card1.suit];
        } else {
            return Constants.CARD_TYPE.RANKS[card2.rank] - Constants.CARD_TYPE.RANKS[card1.rank];
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
        if (isLegalMove(currentTrick, currentCards, card)) {
            sendPlayedCard(card);
        } else {
            alert("NOT legal!");
        }
    }

    return (
        <div className="player-list-container">
            {renderPlayerList().map(player =>
                <Player
                    key={player.username}
                    {...player}
                    showConfirmedTag={player.hasConfirmedHand && roomState === Constants.ROOM_STATES.ROUND_CONFIRM}
                    currentTurn={currentTrick && currentTrick.currentTurnPlayerId === player.playerId}
                    playedCard={currentTrick && player.playerId in currentTrick.playedCards ? currentTrick.playedCards[player.playerId] : null} />
            )}
            {currentCards.length ?
                <ul>
                    {currentCards.sort(compareCards).map(card =>
                        <li key={`${card.suit}${card.rank}`}>
                            {roomState === Constants.ROOM_STATES.ROUND_CONFIRM && !hasConfirmedHand ?
                                <button onClick={() => setFaceDown(card)} >
                                    {card.suit} {card.rank} {isSpecialCard(card) ? "!" : null}
                                </button>
                                : (currentTrick && currentTrick.currentTurnPlayerId === players.filter(player => player.username === myUsername)[0].playerId ?
                                    <button onClick={() => playCard(card)} >
                                        {card.suit} {card.rank}
                                    </button>
                                    : <p>{card.suit} {card.rank}</p>)}
                            {card.faceDown ? "FACE DOWN" : null}
                        </li>)}
                </ul> : null}
        </div>
    );
}