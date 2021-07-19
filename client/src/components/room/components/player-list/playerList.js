import React from 'react';
import { isLegalMove, renderPlayerList } from '../../../../utility/helpers';
import Player from './components/player';
import PendingScreen from './components/pending-screen';
import PlayerHand from './components/player-hand';

import { useDispatch, useSelector } from 'react-redux';
import { getUsername, getCurrentCards } from '../../../../services/user/selectors';
import { sendPlayedCard } from '../../../../services/user/actions';
import { getRoomPlayers, getRoomCurrentTrick } from '../../../../services/room/selectors';

const Constants = require('../../../../../../shared/constants');


export const PlayerList = ({ roomState }) => {
    const dispatch = useDispatch();

    const myUsername = useSelector(getUsername);
    const players = useSelector(getRoomPlayers);
    const currentCards = useSelector(getCurrentCards);
    const currentTrick = useSelector(getRoomCurrentTrick);

    const isLegalMoveWrapper = (playedCard) => {
        if (playedCard == null) return false;
        return isLegalMove(currentTrick, currentCards, playedCard);
    }

    const playCard = (card) => {
        dispatch(sendPlayedCard(card));
    }

    let renderedPlayerList = renderPlayerList({ myUsername, players });
    let playerListOrdered = [renderedPlayerList[2], renderedPlayerList[1], renderedPlayerList[3], renderedPlayerList[0]];

    return (
        <div className="px-8">
            {roomState === Constants.ROOM_STATES.ROOM_PENDING
                || roomState === Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                <PendingScreen renderedPlayerList={renderedPlayerList} />
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
                <PlayerHand {...{ currentCards, playCard, currentTrick }} /> : null}
        </div>
    );
}