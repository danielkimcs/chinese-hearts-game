import React from 'react';
import { sendPlayedCard } from '../../../../utility/networking';
import { isLegalMove, renderPlayerList } from '../../../../utility/helpers';
import Player from './components/player';
import PendingScreen from './components/pending-screen';
import PlayerHand from './components/player-hand';

const Constants = require('../../../../../../shared/constants');


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