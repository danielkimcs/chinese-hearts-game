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
    let myUsername = location.state.username;

    const renderGameMessage = () => {
        if (roomState === Constants.ROOM_STATES.ROUND_CONFIRM) {
            return "Waiting for players to place any special cards face down and confirm their hand...";
        } else if (currentTrick && players) {
            let currentTurnPlayer = players.filter(player => player.playerId === currentTrick.currentTurnPlayerId)[0];
            let currentTurnPlayerName = currentTurnPlayer ? currentTurnPlayer.username : null;
            if (currentTurnPlayerName) {
                if (roomState === Constants.ROOM_STATES.TRICK_PLAY) {
                    return `${currentTurnPlayerName} is starting the trick!`;
                } else if (roomState === Constants.ROOM_STATES.TRICK_PENDING) {
                    return `Waiting for ${currentTurnPlayerName} to play a card...`;
                }
            } else if (roomState === Constants.ROOM_STATES.TRICK_END) {
                return `Everyone has played their card! Starting next trick...`;
            }
        }
    }

    const confirmHand = () => {
        if (pause) return;
        setHasConfirmedHand(true);
        sendHandConfirmation();
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
                <div className="h-screen absolute top-0 bg-gray-600 bg-opacity-50 w-full z-10 flex">
                    <div className="w-96 h-48 bg-white mx-auto my-auto p-5 text-center flex">
                        <div className="mx-auto my-auto">
                            A player has disconnected! The game is paused until someone takes their place!
                        </div>
                    </div>
                </div> : null}
            {displayStatus.status === displayStatusValues.JOIN_SUCCESS ? <>
                <div className="absolute top-0 left-0">
                    <div class="w-80 h-24 p-2 flex">
                        <div class="m-auto font-semibold text-lg break-normal text-center">
                            {renderGameMessage()}
                        </div>
                    </div>
                </div>
                <div>
                    <PlayerList
                        myUsername={myUsername}
                        players={players}
                        roomState={roomState}
                        currentCards={currentCards}
                        currentTrick={currentTrick}
                        hasConfirmedHand={hasConfirmedHand}
                        pause={pause}
                        startingCountdown={startingCountdown} />
                </div>

                {hasConfirmedHand === false ? <div className="w-full flex mt-16">
                    <div className="mx-auto">
                        <button className="w-auto mx-auto py-2 px-4 bg-green-400 text-white font-semibold shadow-md hover:bg-white hover:text-green-400 focus:outline-none" onClick={confirmHand}>CONFIRM HAND</button>
                    </div>
                </div> : null}

            </> : (displayStatus.status === displayStatusValues.JOIN_FAILURE ? <>
                <div class="container mx-auto p-24">
                    <h1 class="text-lg font-bold text-center mb-5">
                        {displayMessageValues[displayStatus.message]}
                    </h1>
                    <div class="w-full text-center">
                        <button onClick={() => history.push("/")} class="w-28 mx-auto py-2 px-4 bg-red-400 text-white font-semibold shadow-md hover:bg-white hover:text-red-400 focus:outline-none">GO BACK</button>
                    </div>
                </div>
            </> : <div className="w-full flex h-screen m-auto">
                <Spinner />
            </div>)}
        </>
    );
}