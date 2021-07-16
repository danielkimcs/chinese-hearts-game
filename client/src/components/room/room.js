import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    initiateSocket,
    disconnectSocket,
    sendHandConfirmation,
    sendNewRoundConfirmation,
    subscribeUpdatePlayerList,
    subscribeRoomState,
    subscribeStartingCountdown,
    subscribePause,
    subscribeUpdatePlayerCards,
    subscribeAskConfirmHand,
    subscribeAskStartRound,
    subscribeAskCard
} from '../../utility/networking';
import Spinner from '../../shared/spinner';
import { useParams, Redirect } from "react-router-dom";
import GameMessage from './components/game-message';
import PlayerList from './components/player-list';
import Leaderboard from './components/leaderboard';
import PauseScreen from './components/pause-screen';

const Constants = require('../../../../shared/constants');

const displayStatusValues = {
    LOADING: 'LOADING',
    JOIN_SUCCESS: 'JOIN_SUCCESS',
    JOIN_FAILURE: 'JOIN_FAILURE'
}

const displayMessageValues = {
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.USERNAME_TAKEN]: 'Someone has already taken that username in this game!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_FULL]: 'This game is full!',
    [Constants.ROOM_JOIN_FAILURE_MSG_TYPE.ROOM_IN_PROGRESS]: 'This game is currently in progress!'
}

export const Room = ({ location }) => {
    const history = useHistory();

    const [displayStatus, setDisplayStatus] = useState({
        status: displayStatusValues.LOADING,
        message: ""
    });
    const [players, setPlayers] = useState([]);
    const [roomState, setRoomState] = useState(Constants.ROOM_STATES.ROOM_PENDING);
    const [startingCountdown, setStartingCountdown] = useState(null);
    const [pause, setPause] = useState(false);
    const [currentCards, setCurrentCards] = useState([]);
    const [hasConfirmedHand, setHasConfirmedHand] = useState(null);
    const [confirmedStartRound, setConfirmedStartRound] = useState(null);
    const [currentTrick, setCurrentTrick] = useState(null);

    let { roomName } = useParams();
    let myUsername = location.state ? location.state.username : null;

    const confirmHand = () => {
        if (pause) return;
        setHasConfirmedHand(true);
        sendHandConfirmation();
    }

    const handleConfirmStartRound = () => {
        if (pause) return;
        setConfirmedStartRound(true);
        sendNewRoundConfirmation();
    }

    useEffect(() => {
        if (location.state) {
            initiateSocket({ username: myUsername, roomName: roomName }, (response) => {
                setDisplayStatus({
                    status: response.status ?
                        displayStatusValues.JOIN_SUCCESS :
                        displayStatusValues.JOIN_FAILURE,
                    message: response.message
                });
            });

            subscribeUpdatePlayerList((err, playerObjects) => {
                if (err) return;
                setPlayers(playerObjects);
            });

            subscribeStartingCountdown((err, counter) => {
                if (err) return;
                setStartingCountdown(counter);
            });

            subscribePause((err, paused) => {
                if (err) return;
                setPause(paused);
            });

            subscribeRoomState((err, roomState_) => {
                if (err) return;
                setRoomState(roomState_);
            });

            subscribeUpdatePlayerCards((err, cards) => {
                if (err) return;
                setCurrentCards(cards);
            });

            subscribeAskConfirmHand(err => {
                if (err) return;
                setHasConfirmedHand(false);
            });

            subscribeAskStartRound(err => {
                if (err) return;
                setConfirmedStartRound(false);
            });

            subscribeAskCard((err, trick) => {
                if (err) return;
                setCurrentTrick(trick);
            });

            return () => {
                disconnectSocket();
            }
        }
    }, []);

    if (!location.state) {
        return (<Redirect to="/" />);
    }

    return (
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
                        <div className="w-full flex mt-16">
                            <div className="mx-auto">
                                <button
                                    className="btn w-auto mx-auto bg-green-400 hover:text-green-400"
                                    onClick={confirmHand}>
                                    CONFIRM HAND
                                </button>
                            </div>
                        </div> : null}

                    {confirmedStartRound === false ?
                        <div className="w-full flex mt-16">
                            <div className="mx-auto">
                                <button
                                    className="btn w-auto mx-auto bg-green-400 hover:text-green-400"
                                    onClick={handleConfirmStartRound}>
                                    START NEW ROUND?
                                </button>
                            </div>
                        </div> : null}

                </>
                : (displayStatus.status === displayStatusValues.JOIN_FAILURE ?
                    <>
                        <div className="container mx-auto p-24">
                            <h1 className="text-lg font-bold text-center mb-5">
                                {displayMessageValues[displayStatus.message]}
                            </h1>
                            <div className="w-full text-center">
                                <button onClick={() => history.push("/")} className="w-28 mx-auto bg-red-400 hover:bg-white py-2 px-4 text-white font-semibold shadow-md hover:text-red-400 focus:outline-none">GO BACK</button>
                            </div>
                        </div>
                    </>
                    : <div className="w-full flex h-screen m-auto">
                        <Spinner />
                    </div>)}
        </>
    );
}