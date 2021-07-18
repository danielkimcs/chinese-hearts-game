import React from "react";
import Rules from './rules';
import TextInput from '../../shared/components/text-input';

const HomeScreen = ({ showRules, toggleRules, handleSubmit, username, setUsername, usernameInvalid, room, setRoom, roomInvalid }) => (
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
                        <TextInput
                            label="Enter username"
                            value={username}
                            onChange={setUsername}
                            invalid={usernameInvalid}
                            errorMessage="Username must contain only letters and/or numbers!" />
                        <TextInput
                            label="Enter game ID"
                            value={room}
                            onChange={setRoom}
                            invalid={roomInvalid}
                            errorMessage="Game ID must contain only letters and/or numbers!" />
                        <div className="my-2 mx-auto" style={{ maxWidth: "193px" }}>
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

export default HomeScreen;