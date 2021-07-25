import React from 'react';
import { isLegalMove, renderPlayerList } from '../../../../utility/helpers';
import Player from './components/player';
import PendingScreen from './components/pending-screen';
import PlayerHand from './components/player-hand';
import Button from '../../../../shared/components/button';
import ActionButtons from './components/action-buttons';

import { useDispatch, useSelector } from 'react-redux';
import { getUsername, getCurrentCards, getConfirmedHandStatus, getStartRoundStatus } from '../../../../services/user/selectors';
import { sendPlayedCard, setHandConfirmation, sendHandConfirmation, setStartRoundConfirmation, sendNewRoundConfirmation } from '../../../../services/user/actions';
import { getRoomPlayers, getRoomCurrentTrick, getRoomPaused, getRoomWinner } from '../../../../services/room/selectors';

const Constants = require('../../../../../../shared/constants');


export const PlayerList = ({ roomState }) => {
    const dispatch = useDispatch();

    const myUsername = useSelector(getUsername);
    const players = useSelector(getRoomPlayers);
    const currentCards = useSelector(getCurrentCards);
    const currentTrick = useSelector(getRoomCurrentTrick);
    const pause = useSelector(getRoomPaused);
    const hasConfirmedHand = useSelector(getConfirmedHandStatus);
    const confirmedStartRound = useSelector(getStartRoundStatus);
    const isThereWinner = useSelector(getRoomWinner) !== null;

    const isLegalMoveWrapper = (playedCard) => {
        if (playedCard == null) return false;
        return isLegalMove(currentTrick, currentCards, playedCard);
    }

    const playCard = (card) => {
        dispatch(sendPlayedCard(card));
    }

    const handleConfirmHand = () => {
        if (pause) return;
        dispatch(setHandConfirmation(true));
        dispatch(sendHandConfirmation());
    }

    const handleConfirmStartRound = () => {
        if (pause) return;
        dispatch(setStartRoundConfirmation(true));
        dispatch(sendNewRoundConfirmation());
    }


    let renderedPlayerList = renderPlayerList({ myUsername, players });
    let playerListOrdered = [renderedPlayerList[2], renderedPlayerList[1], renderedPlayerList[3], renderedPlayerList[0]];

    return (
        <div className="px-8 flex flex-col min-h-screen">
            <div className="flex-grow">
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
                <ActionButtons>
                    {hasConfirmedHand === false ?
                        <Button onClick={handleConfirmHand} value="CONFIRM HAND" />
                        : null}

                    {confirmedStartRound === false ?
                        <Button onClick={handleConfirmStartRound} value={`${isThereWinner ? 'RETURN TO TEAM SELECTION' : 'START NEW ROUND?'}`} />
                        : null}
                </ActionButtons>
            </div>
            <div className="mb-8">
                {currentCards.length ?
                    <PlayerHand {...{ currentCards, playCard, currentTrick }} /> : null}
            </div>
        </div>
    );
}