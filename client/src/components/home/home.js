import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const USERNAME_REGEX = /^[a-z0-9]+$/i;

export const Home = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const history = useHistory();

    const verifyName = (username) => {
        if (username.length === 0) {
            return false;
        }
        let isNameValid = username.match(USERNAME_REGEX) != null;
        return isNameValid;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (verifyName(username)) {
            history.push("/games/"+room, { username });
        } else {
            alert("Invalid username!");
        }
    }
    return (
        <div className="home-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Game ID:
                    <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
                </label>
                <input type="submit" value="Join!" />
            </form>
        </div>
    );
}