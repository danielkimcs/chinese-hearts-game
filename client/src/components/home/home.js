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
                            <div className="mx-auto text-center">
                                <span className="font-bold text-2xl">
                                    Chinese Hearts
                                </span>
                            </div>
                            <div className="my-3 mx-auto max-w-md">
                                <span className="block text-sm text-gray-500">Enter username</span>
                                <input className="w-full" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                {usernameInvalid ? <span className="block text-sm text-gray-500 w-full break-normal text-red-400">
                                    Username must contain only letters and/or numbers!
                                </span> : null}
                            </div>
                            <div className="my-3 mx-auto max-w-md">
                                <span className="block text-sm text-gray-500">Enter game ID</span>
                                <input className="w-full" type="text" value={room} onChange={e => setRoom(e.target.value)} />
                                {roomInvalid ? <span className="block text-sm text-gray-500 w-full break-normal text-red-400">
                                    Game ID must contain only letters and/or numbers!
                                </span> : null}
                            </div>
                            <div className="my-2 mx-auto max-w-md">
                                <p className="block text-sm text-gray-500">Players who enter the same game ID play together!</p>
                                <p className="lg:hidden block text-sm text-gray-500 text-red-400">* Not yet optimized for small mobile screens! Playing on a wider screen is strongly advised.</p>
                            </div>
                            <div className="mt-3 w-full">
                                <div className="max-w-xs mx-auto flex flex-col items-center">
                                    <button onClick={toggleRules} type="button" className="btn w-1/2 my-2 bg-yellow-500 hover:text-yellow-500">Rules</button>
                                    <button className="btn w-1/2 my-2 bg-green-400 hover:text-green-400" type="submit">Join!</button>
                                </div>
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