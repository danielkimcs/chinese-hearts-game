import React, { useState, useEffect } from 'react';
import { initiateSocket, disconnectSocket, subscribeUpdatePlayers } from '../../utility/networking';
import { useParams, Redirect } from "react-router-dom";

export const Room = ({ location }) => {
    const [players, setPlayers] = useState([]);
    let { roomName } = useParams();

    useEffect(() => {
        if (location.state) {
            initiateSocket({ username: location.state.username, roomName: roomName });

            subscribeUpdatePlayers((err, data) => {
                if (err) return;
                setPlayers(data);
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
                    {players.map(player => <li key={player}>{player}</li>)}
                </ul>
            </div>
        </div>
    );
}