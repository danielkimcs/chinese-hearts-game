import React from 'react';
import Spinner from '../../shared/components/spinner';
import GameMessage from './components/game-message';
import PlayerList from './components/player-list';
import Leaderboard from './components/leaderboard';
import PauseScreen from './components/pause-screen';
import FailureScreen from './components/failure-screen';
import Button from '../../shared/components/button';

import { displayStatusValues, displayMessageValues } from '../../shared/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomPaused, getRoomDisplayStatus, getRoomState } from '../../services/room/selectors';
import { setHandConfirmation, sendHandConfirmation, setStartRoundConfirmation, sendNewRoundConfirmation } from '../../services/user/actions';
import { getCurrentCards, getConfirmedHandStatus, getStartRoundStatus } from '../../services/user/selectors';

const Constants = require('../../../../shared/constants');

const RoomScreen = () => {
    let dispatch = useDispatch();

    let pause = useSelector(getRoomPaused);
    let displayStatus = useSelector(getRoomDisplayStatus);
    let hasConfirmedHand = useSelector(getConfirmedHandStatus);
    let confirmedStartRound = useSelector(getStartRoundStatus);
    let currentCards = useSelector(getCurrentCards);
    let roomState = useSelector(getRoomState);

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
    return (
        <>
            {pause ? <PauseScreen /> : null}
            {displayStatus.status === displayStatusValues.JOIN_SUCCESS ?
                <>
                    <GameMessage roundHasFinished={currentCards.length === 0} />
                    {roomState !== Constants.ROOM_STATES.ROOM_PENDING && roomState !== Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                        <div className="absolute top-0 right-0">
                            <Leaderboard />
                        </div> : null}
                    <PlayerList {...{ roomState }} />

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
}

export default RoomScreen;