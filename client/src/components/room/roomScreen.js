import React from 'react';
import Spinner from '../../shared/components/spinner';
import GameMessage from './components/game-message';
import PlayerList from './components/player-list';
import Leaderboard from './components/leaderboard';
import PauseScreen from './components/pause-screen';
import FailureScreen from './components/failure-screen';
import TeamPanel from './components/team-panel';
import RejoinPanel from './components/rejoin-panel';
import Notification from './components/notification';

import { displayStatusValues, displayMessageValues } from '../../shared/constants';
import { useSelector } from 'react-redux';
import { getRoomPaused, getRoomDisplayStatus, getRoomState } from '../../services/room/selectors';
import { getCurrentCards, getNotificationMsg } from '../../services/user/selectors';

const Constants = require('../../../../shared/constants');

const RoomScreen = () => {
    const pause = useSelector(getRoomPaused);
    const displayStatus = useSelector(getRoomDisplayStatus);
    const currentCards = useSelector(getCurrentCards);
    const roomState = useSelector(getRoomState);
    const latestNotificationMsg = useSelector(getNotificationMsg);

    return (
        <>
            {pause ? <PauseScreen /> : null}
            {displayStatus.status === displayStatusValues.JOIN_SUCCESS ?
                <>
                    {roomState !== Constants.ROOM_STATES.ROOM_SETUP
                        && roomState !== Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN ?
                        <>
                            <GameMessage roundHasFinished={currentCards.length === 0} />
                            {roomState !== Constants.ROOM_STATES.ROOM_PENDING && roomState !== Constants.ROOM_STATES.ROOM_COUNTDOWN ?
                                <div className="absolute top-0 right-0">
                                    <Leaderboard />
                                </div> : null}
                            <PlayerList {...{ roomState }} />
                        </>
                        : <div className="w-2/3 mx-auto mt-8">
                            <TeamPanel />
                        </div>}
                </>
                : (displayStatus.status === displayStatusValues.JOIN_FAILURE ?
                    (displayStatus.message !== Constants.ROOM_JOIN_FAILURE_MSG_TYPE.REJOIN_PENDING ?
                        <FailureScreen message={displayMessageValues[displayStatus.message]} />
                        : <RejoinPanel />)
                    : <div className="w-full flex h-screen m-auto">
                        <Spinner />
                    </div>)}
            <Notification message={latestNotificationMsg} />
        </>
    );
}

export default RoomScreen;