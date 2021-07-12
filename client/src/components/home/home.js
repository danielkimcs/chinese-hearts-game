import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const USERNAME_REGEX = /^[a-z0-9]+$/i;

const verifyInput = (input) => {
    if (input.length === 0) return false;
    let isInputValid = input.match(USERNAME_REGEX) != null;
    return isInputValid;
}

export const Home = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!verifyInput(username)) {
            alert("Invalid username!");
            return;
        }
        if (!verifyInput(room)) {
            alert("Invalid game ID!");
            return;
        }
        history.push("/games/" + room, { username });
    }

    return (
        <div className="container mx-auto">
            <div className="width-1/3 mx-auto">
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input className="border" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Game ID:
                        <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
                    </label>
                    <input type="submit" value="Join!" />
                </form>
            </div>
        </div>
    );
}