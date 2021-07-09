import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { initiateSocket, disconnectSocket, subscribeUpdatePlayers, subscribeStartingCountdown } from '../../utility/networking';
import { useParams, Redirect } from "react-router-dom";

const Constants = require('../../../../shared/constants');

const displayStatusValues = {
    LOADING: 'LOADING',
    JOIN_SUCCESS: 'JOIN_SUCCESS',
    JOIN_FAILURE: 'JOIN_FAILURE'
}

export const Room = ({ location }) => {
    const history = useHistory();

    const [displayStatus, setDisplayStatus] = useState(displayStatusValues.LOADING);
    const [players, setPlayers] = useState([]);
    const [startingCountdown, setStartingCountdown] = useState(null);
    let { roomName } = useParams();

    useEffect(() => {
        if (location.state) {
            initiateSocket({ username: location.state.username, roomName: roomName }, (success) => {
                setDisplayStatus(success ?
                    displayStatusValues.JOIN_SUCCESS :
                    displayStatusValues.JOIN_FAILURE);
            });

            subscribeUpdatePlayers((err, playerObjects) => {
                if (err) return;
                setPlayers(playerObjects);
            });

            subscribeStartingCountdown((err, counter) => {
                if (err) return;
                setStartingCountdown(counter);
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
            {displayStatus === displayStatusValues.JOIN_SUCCESS ? <>
                <div>Room Name: {roomName}</div>
                <div>Username: {location.state.username}</div>

                <div>
                    Player list:
                    <ul>
                        {players.map(player =>
                            <li key={player.username}
                                style={{
                                    color: (player.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? "black" : "red")
                                }}
                            >
                                {player.username}
                            </li>)
                        }
                    </ul>
                </div>

                <div>
                    {startingCountdown ? startingCountdown : null}
                </div>
            </> : (displayStatus === displayStatusValues.JOIN_FAILURE ? <>
                <p>Someone has already taken that username in this room! <button onClick={() => history.push("/")}>Go back home</button></p>
            </> : <p>Loading...</p>)}
        </div>
    );
}