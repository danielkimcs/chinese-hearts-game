import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Rules from './rules';

const USERNAME_REGEX = /^[a-z0-9]+$/i;

const verifyInput = (input) => {
    if (input.length === 0) return false;
    let isInputValid = input.match(USERNAME_REGEX) != null;
    return isInputValid;
}

export const Home = () => {
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

    return (
        <div className="flex flex-col min-h-screen">

            {showRules ? <Rules toggleRules={toggleRules} /> : <>
                <div className="container mx-auto flex-grow">
                    <form onSubmit={handleSubmit}>
                        <div className="w-1/2 mx-auto mt-12 flex flex-col">
                            <div className="mx-auto">
                                <span className="font-bold text-2xl">
                                    Chinese Hearts
                                </span>
                            </div>
                            <div className="my-3 mx-auto w-64">
                                <span className="block text-sm text-gray-500">Enter username</span>
                                <input className="w-full" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                {usernameInvalid ? <span className="block text-sm text-gray-500 w-full break-normal text-red-400">
                                    Username must contain only letters and/or numbers!
                                </span> : null}
                            </div>
                            <div className="my-3 mx-auto w-64">
                                <span className="block text-sm text-gray-500">Enter game ID</span>
                                <input className="w-full" type="text" value={room} onChange={e => setRoom(e.target.value)} />
                                {roomInvalid ? <span className="block text-sm text-gray-500 w-full break-normal text-red-400">
                                    Game ID must contain only letters and/or numbers!
                                </span> : null}
                            </div>
                            <div className="my-2 mx-auto w-64">
                                <span className="block text-sm text-gray-500">Players who enter the same game ID play together!</span>
                            </div>
                            <div className="mt-3 mx-auto w-64 flex flex-row">
                                <button onClick={toggleRules} type="button" className="w-24 mx-auto py-2 px-4 bg-yellow-500 text-white font-semibold shadow-md hover:bg-white hover:text-yellow-500 focus:outline-none">Rules</button>
                                <button className="w-24 mx-auto py-2 px-4 bg-green-400 text-white font-semibold shadow-md hover:bg-white hover:text-green-400 focus:outline-none" type="submit">Join!</button>
                            </div>
                        </div>
                    </form>
                </div>


                <div className="text-center text-md font-light p-16">
                    Daniel Kim &bull; <a className="hover:font-bold text-green-600" href="https://github.com/danielkimcs/chinese-hearts-game">GitHub</a>
                </div>
            </>}
        </div>
    );
}