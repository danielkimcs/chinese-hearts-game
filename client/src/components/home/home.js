import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RESET_STORE } from '../../services/constants';
import { useHistory } from 'react-router-dom';
import HomeScreen from './homeScreen';

const USERNAME_REGEX = /^[a-z0-9]+$/i;

const verifyInput = (input) => {
    if (input.length === 0) return false;
    let isInputValid = input.match(USERNAME_REGEX) != null;
    return isInputValid;
}

export const Home = () => {
    const dispatch = useDispatch();

    const [showRules, setShowRules] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [roomInvalid, setRoomInvalid] = useState(false);
    const [room, setRoom] = useState("");
    const history = useHistory();

    const toggleRules = () => {
        setShowRules(!showRules);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let enteredInvalidUsername = !verifyInput(username);
        let enteredInvalidRoom = !verifyInput(room);
        if (enteredInvalidUsername || enteredInvalidRoom) {
            setUsernameInvalid(enteredInvalidUsername);
            setRoomInvalid(enteredInvalidRoom);
            return;
        }
        history.push("/games/" + room, { username });
    }

    useEffect(() => {
        dispatch({ type: RESET_STORE });
    }, []);

    return (
        <HomeScreen {...{ showRules, toggleRules, handleSubmit, username, setUsername, usernameInvalid, room, setRoom, roomInvalid }} />
    );
}