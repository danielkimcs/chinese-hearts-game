import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const USERNAME_REGEX = /^[a-z0-9]+$/i;

const verifyInput = (input) => {
    if (input.length === 0) return false;
    let isInputValid = input.match(USERNAME_REGEX) != null;
    return isInputValid;
}

const Rules = ({ toggleRules }) => {
    const stopPropagation = (e) => {
        e.stopPropagation();
    }
    return (
        <div onClick={toggleRules} class="h-screen bg-gray-100">
            <div onClick={stopPropagation} class="absolute w-1/2 left-1/4 mt-12 p-8 h-3/4 overflow-y-auto bg-white shadow-lg">
                <div class="absolute right-4">
                    <button type="button" onClick={toggleRules} class="mx-auto py-2 px-4 bg-yellow-500 text-white font-semibold shadow-md hover:bg-white hover:text-yellow-500 focus:outline-none">Close</button>
                </div>
                <article class="prose lg:prose-xl">
                    <h2>Game Rules</h2>

                    <p>Chinese Hearts (<a href="https://en.wikipedia.org/wiki/Gong_Zhu">Gong Zhu</a>) is a variation of the classic
                        trick-taking card game <a href="https://en.wikipedia.org/wiki/Hearts_(card_game)">Hearts</a>. </p>

                    <h3>Setup</h3>
                    <p>
                        The deck is evenly split between four players, randomly divided into two teams.
                        There are four particular cards with special purposes:
                        A<span class="text-red-500">&hearts;</span>, J&diams; (The Lamb),
                        Q&spades; (The Pig), and
                        10&clubs; (The Multiplier).
                    </p>
                    <p>
                        If any of these cards appears in your hand, you have the opportunity to place any of them face down
                        (you can place multiple cards face down if possible), with the following consequences:</p>
                    <ul>
                        <li>A<span class="text-red-500">&hearts;</span>: doubles all point values for <span class="text-red-500">&hearts;</span> cards</li>
                        <li>J<span class="text-red-500">&diams;</span> (The Lamb): doubles in point value from +100 to +200</li>
                        <li>Q&spades; (The Pig): doubles in point value from -100 to -200</li>
                        <li>10&clubs; (The Multiplier): doubles in multiplying value from x2 to x4</li>
                    </ul>

                    <h3>Point Values</h3>
                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/4 ...">Card</th>
                                <th class="w-1/4 ...">Point Value</th>
                                <th class="w-1/2 ...">Point Value Face Down</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>J<span class="text-red-500">&diams;</span></td>
                                <td>+100</td>
                                <td>+200</td>
                            </tr>
                            <tr>
                                <td>Q&spades;</td>
                                <td>-100</td>
                                <td>-200</td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/4 ...">Card</th>
                                <th class="w-1/4 ...">Point / Multiplier Value</th>
                                <th class="w-1/2 ...">Point / Multiplier Value Face Down</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>10&clubs;</td>
                                <td>+50 / x2</td>
                                <td>+100 / x4</td>
                            </tr>
                        </tbody>
                    </table>

                    A player receives a point value for 10&clubs; <strong>only when the 10&clubs; is the only card collected by the end of the round.</strong>

                    <h4>Hearts</h4>

                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/4 ...">Card(s)</th>
                                <th class="w-1/4 ...">Point Value</th>
                                <th class="w-1/2 ...">Point Value when A<span class="text-red-500">&hearts;</span> Face Down</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>A<span class="text-red-500">&hearts;</span></td>
                                <td>-50</td>
                                <td>-100</td>
                            </tr>
                            <tr>
                                <td>K<span class="text-red-500">&hearts;</span></td>
                                <td>-40</td>
                                <td>-80</td>
                            </tr>
                            <tr>
                                <td>Q<span class="text-red-500">&hearts;</span></td>
                                <td>-30</td>
                                <td>-60</td>
                            </tr>
                            <tr>
                                <td>J<span class="text-red-500">&hearts;</span></td>
                                <td>-20</td>
                                <td>-40</td>
                            </tr>
                            <tr>
                                <td>5<span class="text-red-500">&hearts;</span> - 10<span class="text-red-500">&hearts;</span></td>
                                <td>-10</td>
                                <td>-20</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Gameplay</h3>
                    <p>Gameplay consists of a series of tricks, each of which every player submits one card (therefore, one round consists of 13 tricks). A player is randomly selected to begin the first trick. </p>
                    <ul>
                        <li>A player starts a trick by playing a card, which determines the leading suit for the trick. </li>
                        <li>For each of the remaining players, if the player has any cards of the leading suit in their hand, one of those must be played.
                            Otherwise, any card can be played.
                        </li>
                        <li>The winner of the trick is the player who plays the card of highest rank in the leading suit (2 is the lowest, Ace is the highest).
                            The winner then collects relevant cards (listed in the Point Values section) and begins the next trick.
                        </li>
                    </ul>
                    <p>
                        After all tricks, each player receives points based on their collected cards. The multiplier value for 10&clubs; is applied
                        after all other points are tallied up. For example, if a player collected Q&spades;, J<span class="text-red-500">&diams;</span>
                        face down, 10<span class="text-red-500">&hearts;</span>, and 10&clubs;, then that player would receive -100 + 200 - 10 = +90 points multiplied by 2,
                        which is +180 points.
                    </p>

                    <p>Each team's points are calculated by adding the players' points together. </p>
                </article>
            </div>
        </div>
    );
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
                            <div className="mx-auto w-64 flex flex-row">
                                <button onClick={toggleRules} type="button" className="w-24 mx-auto py-2 px-4 bg-yellow-500 text-white font-semibold shadow-md hover:bg-white hover:text-yellow-500 focus:outline-none">Rules</button>
                                <button className="w-24 mx-auto py-2 px-4 bg-green-400 text-white font-semibold shadow-md hover:bg-white hover:text-green-400 focus:outline-none" type="submit">Join!</button>
                            </div>
                        </div>
                    </form>
                </div>


                <div className="text-center font-light p-8">
                    Daniel Kim &bull; <a className="hover:font-bold text-green-600" href="https://github.com/danielkimcs/chinese-hearts-game">GitHub</a>
                </div>
            </>}
        </div>
    );
}