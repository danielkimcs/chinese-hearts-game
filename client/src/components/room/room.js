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
    const [roomState, setRoomState] = useState("");
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
        <div className="room-container">
            {displayStatus.status === displayStatusValues.JOIN_SUCCESS ? <>
                <div>Game ID: {roomName}</div>
                <div>Username: {location.state.username}</div>

                <div>
                    Player list:
                    <PlayerList
                        myUsername={location.state.username}
                        players={players}
                        roomState={roomState}
                        currentCards={currentCards}
                        currentTrick={currentTrick}
                        hasConfirmedHand={hasConfirmedHand}
                        pause={pause} />
                </div>

                <div>
                    {startingCountdown ? startingCountdown : null}
                </div>

                <div>
                    {hasConfirmedHand === false ? <button onClick={confirmHand}>CONFIRM HAND</button> : null}
                </div>

                <div>
                    {pause ? "PAUSED" : null}
                </div>
            </> : (displayStatus.status === displayStatusValues.JOIN_FAILURE ? <>
                <p>{displayStatus.message} {displayMessageValues[displayStatus.message]} <button onClick={() => history.push("/")}>Go back home</button></p>
            </> : <p>Loading...</p>)}
        </div>
    );
}