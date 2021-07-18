import React from 'react';
import Spinner from '../../shared/components/spinner';
import GameMessage from './components/game-message';
import PlayerList from './components/player-list';
import Leaderboard from './components/leaderboard';
import PauseScreen from './components/pause-screen';
import FailureScreen from './components/failure-screen';
import Button from '../../shared/components/button';

const Constants = require('../../../../shared/constants');

const displayMessageValues = {
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.USERNAME_TAKEN]: 'Someone has already taken that username in this game!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_FULL]: 'This game is full!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_IN_PROGRESS]: 'This game is currently in progress!'
}

const RoomScreen = (
    {
        myUsername,
        displayStatus,
        displayStatusValues,
        players,
        roomState,
        startingCountdown,
        pause,
        currentCards,
        hasConfirmedHand,
        confirmedStartRound,
        currentTrick,
        handleConfirmHand,
        handleConfirmStartRound
    }) => (
    <>
        {pause ? <PauseScreen /> : null}
        {displayStatus.status === displayStatusValues.JOIN_SUCCESS ?
            <>
                <GameMessage {...{ players, roomState, currentTrick, roundHasFinished: currentCards.length === 0 }} />
                {roomState !== Constants.ROOM_STATES.ROOM_PENDING && roomState !== Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                    <div className="absolute top-0 right-0">
                        <Leaderboard {...{ myUsername, players }} />
                    </div> : null}
                <PlayerList {...{ myUsername, players, roomState, currentCards, currentTrick, hasConfirmedHand, pause, startingCountdown }} />

                {hasConfirmedHand === false ?
                    <Button onClick={handleConfirmHand} value="CONFIRM HAND" />
                    : null}

                {confirmedStartRound === false ?
                    <Button onClick={handleConfirmStartRound} value="START NEW ROUND?" />
                    : null}

            </>
            : (displayStatus.status === displayStatusValues.JOIN_FAILURE ?
                <FailureScreen message={displayMessageValues[displayStatus.message]} />
                : <div className="w-full flex h-screen m-auto">
                    <Spinner />
                </div>)}
    </>
);

export default RoomScreen;