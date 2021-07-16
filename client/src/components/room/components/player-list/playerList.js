import React from 'react';
import { sendPlayedCard } from '../../../../utility/networking';
import Player from './components/player';
import PendingScreen from './components/pending-screen';
import PlayerHand from './components/player-hand';

const Constants = require('../../../../../../shared/constants');

const isLegalMove = (currentTrick, currentHand, playedCard) => {
    if (!currentTrick) return false;
    if (!currentTrick.leadingSuit.length || playedCard.suit === currentTrick.leadingSuit) return true;
    return !currentHand.filter(card => card.suit === currentTrick.leadingSuit).length;
}

const renderPlayerList = ({ myUsername, players }) => {
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

export const PlayerList = ({ myUsername, players, roomState, currentCards, currentTrick, hasConfirmedHand, pause, startingCountdown }) => {
    const isLegalMoveWrapper = (playedCard) => {
        if (playedCard == null) return false;
        return isLegalMove(currentTrick, currentCards, playedCard);
    }

    const playCard = (card) => {
        sendPlayedCard(card);
    }

    let renderedPlayerList = renderPlayerList({ myUsername, players });
    let playerListOrdered = [renderedPlayerList[2], renderedPlayerList[1], renderedPlayerList[3], renderedPlayerList[0]];
    let myPlayerId = players.filter(player => player.username === myUsername)[0].playerId;

    return (
        <div className="px-8">
            {roomState === Constants.ROOM_STATES.ROOM_PENDING
                || roomState === Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                <PendingScreen {...{ startingCountdown, renderedPlayerList }} />
                : <div className="grid grid-cols-4">
                    {playerListOrdered.map((player, index) =>
                        <Player
                            key={player.username}
                            {...player}
                            {...{ index, isLegalMoveWrapper, playCard }}
                            showConfirmedTag={
                                (player.hasConfirmedHand && roomState === Constants.ROOM_STATES.ROUND_CONFIRM)
                                || (player.hasConfirmedStartRound && roomState === Constants.ROOM_STATES.ROUND_END)}
                            currentTurn={currentTrick && currentTrick.currentTurnPlayerId === player.playerId}
                            playedCard={currentTrick && player.playerId in currentTrick.playedCards ? currentTrick.playedCards[player.playerId] : null}
                            pushUpBottom={playerListOrdered[1].collectedCards.length || playerListOrdered[2].collectedCards.length}
                            myFaceDownCards={currentCards.filter(card => card.faceDown)} />
                    )}
                </div>}
            {currentCards.length ?
                <PlayerHand {...{ currentCards, playCard, pause, myPlayerId, isLegalMove, currentTrick }}
                    hasNotConfirmedHand={roomState === Constants.ROOM_STATES.ROUND_CONFIRM && !hasConfirmedHand} /> : null}
        </div>
    );
}