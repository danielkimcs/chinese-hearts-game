import React from 'react';
import { useParams } from "react-router-dom";

export const Room = () => {
    let { roomName } = useParams();

    return (
        <div>Room Name: {roomName}</div>
    );
}