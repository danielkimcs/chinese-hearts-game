import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    initiateSocket,
    disconnectSocket,
    sendHandConfirmation,
    subscribeUpdatePlayers,
    subscribeRoomState,
    subscribeStartingCountdown,
    subscribePause,
    subscribeUpdatePlayerCards,
    subscribeAskConfirmHand,
    subscribeAnnounceStartingPlayer,
    subscribeAskCard
} from '../../utility/networking';
import Spinner from '../../shared/spinner';
import { useParams, Redirect } from "react-router-dom";
import PlayerList from './components/player-list';

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
    const [currentTrick, setCurrentTrick] = useState(null);

    let { roomName } = useParams();

    const confirmHand = () => {
        if (pause) return;
        setHasConfirmedHand(true);
        sendHandConfirmation();
    }

    useEffect(() => {
        if (location.state) {
            initiateSocket({ username: location.state.username, roomName: roomName }, (response) => {
                setDisplayStatus({
                    status: response.status ?
                        displayStatusValues.JOIN_SUCCESS :
                        displayStatusValues.JOIN_FAILURE,
                    message: response.message
                });
            });

            subscribeUpdatePlayers((err, playerObjects) => {
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
            {pause ?
                <div class="h-screen absolute top-0 bg-gray-600 bg-opacity-50 w-full z-10 flex">
                    <div class="w-96 h-48 bg-white mx-auto my-auto p-5 text-center flex">
                        <div class="mx-auto my-auto">
                            A player has disconnected! The game is paused until someone takes their place!
                        </div>
                    </div>
                </div> : null}
            {displayStatus.status === displayStatusValues.JOIN_SUCCESS ? <>
                <div>
                    <PlayerList
                        myUsername={location.state.username}
                        players={players}
                        roomState={roomState}
                        currentCards={currentCards}
                        currentTrick={currentTrick}
                        hasConfirmedHand={hasConfirmedHand}
                        pause={pause}
                        startingCountdown={startingCountdown} />
                </div>

                <div>
                    {hasConfirmedHand === false ? <button onClick={confirmHand}>CONFIRM HAND</button> : null}
                </div>


            </> : (displayStatus.status === displayStatusValues.JOIN_FAILURE ? <>
                <p>{displayStatus.message} {displayMessageValues[displayStatus.message]} <button onClick={() => history.push("/")}>Go back home</button></p>
            </> : <div className="w-full flex h-screen m-auto">
                <Spinner />
            </div>)}
        </>
    );
}