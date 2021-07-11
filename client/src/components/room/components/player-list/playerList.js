import React from 'react';
import Player from '../player';
import { sendFaceDownCard } from '../../../../utility/networking';
const Constants = require('../../../../../../shared/constants');

export const PlayerList = ({ players, currentCards, trickStarterUsername }) => {
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

            let sortedTeamPlayers = [teamPlayers[0]];
            let currentPlayerUsername = teamPlayers[0].nextPlayerUsername;
            while (currentPlayerUsername.localeCompare(teamPlayers[0].username) !== 0) {
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

    const setFaceDown = (card) => {
        if (card.faceDown) return;
        if (!(Constants.CARD_TYPE.SPECIAL.includes(card.rank + card.suit))) return;

        sendFaceDownCard(card);
    }

    return (
        <div className="player-list-container">
            {renderPlayerList().map(player =>
                <Player
                    key={player.username}
                    {...player}
                    showConfirmedTag={player.hasConfirmedHand && trickStarterUsername.length === 0}
                    startingTrick={trickStarterUsername === player.username} />
            )}
            {currentCards.length ?
                <ul>
                    {currentCards.sort(compareCards).map(card =>
                        <li key={`${card.suit}${card.rank}`}>
                            <button onClick={() => setFaceDown(card)} >
                                {card.suit} {card.rank}
                            </button>
                            {card.faceDown ? "FACE DOWN" : null}
                        </li>)}
                </ul> : null}
        </div>
    );
}