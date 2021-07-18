import React, { useState, useEffect } from 'react';
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
import { useParams, Redirect } from "react-router-dom";
import { RoomScreen } from './roomScreen';

const Constants = require('../../../../shared/constants');

const displayStatusValues = {
    LOADING: 'LOADING',
    JOIN_SUCCESS: 'JOIN_SUCCESS',
    JOIN_FAILURE: 'JOIN_FAILURE'
}


export const Room = ({ location }) => {
    const [displayStatus, setDisplayStatus] = useState({
        status: displayStatusValues.LOADING,
        message: ""
    });
    const [players, setPlayers] = useState([]);
    const [roomState, setRoomState] = useState(Constants.ROOM_STATES.ROOM_PENDING);
    const [startingCountdown, setStartingCountdown] = useState(null);
    const [pause, setPause] = useState(false);
    const [currentCards, setCurrentCards] = useState([]);
    const [hasConfirmedHand, setHasConfirmedHand] = useState(null); //
    const [confirmedStartRound, setConfirmedStartRound] = useState(null); //
    const [currentTrick, setCurrentTrick] = useState(null);

    let { roomName } = useParams();
    let myUsername = location.state ? location.state.username : null;

    const handleConfirmHand = () => {
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
        <RoomScreen {...{ myUsername, displayStatus, displayStatusValues, players, roomState, startingCountdown, pause, currentCards, hasConfirmedHand, confirmedStartRound, currentTrick, handleConfirmHand, handleConfirmStartRound }} />
    )
}