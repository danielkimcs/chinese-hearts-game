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
            <form onSubmit={handleSubmit}>
                <div className="w-1/2 mx-auto mt-12 flex flex-col">
                    <div className="mx-auto">
                        <span className="font-bold text-2xl">
                            Chinese Hearts
                        </span>
                    </div>
                    <div className="my-3 mx-auto">
                        <span className="block text-sm text-gray-500">Enter username</span>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="my-3 mx-auto">
                        <span className="block text-sm text-gray-500">Enter game ID</span>
                        <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
                    </div>
                    <button className="w-24 mx-auto py-2 px-4 bg-green-400 text-white font-semibold shadow-md hover:bg-white hover:text-green-400 focus:outline-none" type="submit">Join!</button>
                </div>
            </form>
        </div>
    );
}