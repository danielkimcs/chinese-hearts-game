import React, { useEffect } from 'react';
import { joinRoom, setDisplayStatus, leaveRoom } from '../../services/room/actions';
import { useDispatch } from 'react-redux'
import { setPlayerUsername } from '../../services/user/actions';
import { useParams, Redirect } from "react-router-dom";
import RoomScreen from './roomScreen';

export const Room = ({ location }) => {
    let dispatch = useDispatch();

    let { roomName } = useParams();
    let myUsername = location.state ? location.state.username : null;

    useEffect(() => {
        if (location.state) {
            dispatch(joinRoom({ username: myUsername, roomName: roomName }, (response) => dispatch(setDisplayStatus(response))));
            dispatch(setPlayerUsername(myUsername));

            return () => {
                dispatch(leaveRoom());
            }
        }
    }, []);

    if (!location.state) {
        return (<Redirect to="/" />);
    }

    return (
        <RoomScreen />
    );
}