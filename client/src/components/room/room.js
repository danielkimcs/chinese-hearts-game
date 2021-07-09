import React, { useState, useEffect } from 'react';
import { initiateSocket, disconnectSocket, subscribeUpdatePlayers, subscribeStartingCountdown } from '../../utility/networking';
import { useParams, Redirect } from "react-router-dom";

const Constants = require('../../../../shared/constants');

export const Room = ({ location }) => {
    const [players, setPlayers] = useState([]);
    const [startingCountdown, setStartingCountdown] = useState(null);
    let { roomName } = useParams();

    useEffect(() => {
        if (location.state) {
            initiateSocket({ username: location.state.username, roomName: roomName });

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
        </div>
    );
}