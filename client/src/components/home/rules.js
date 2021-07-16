import React from 'react';

const Rules = ({ toggleRules }) => {
    const stopPropagation = (e) => {
        e.stopPropagation();
    }
    return (
        <div onClick={toggleRules} class="h-screen bg-gray-100">
            <div onClick={stopPropagation} class="absolute w-full left-0 lg:w-1/2 lg:left-1/4 h-full p-12 overflow-y-auto bg-white shadow-lg">
                <div class="absolute right-4">
                    <button type="button" onClick={toggleRules} class="mx-auto py-2 px-4 bg-yellow-500 text-white font-semibold shadow-md hover:bg-white hover:text-yellow-500 focus:outline-none">Close</button>
                </div>
                <article class="prose-xl lg:prose">
                    <h2>Game Rules</h2>

                    <p>Chinese Hearts (<a href="https://en.wikipedia.org/wiki/Gong_Zhu">Gong Zhu</a>) is a variation of the classic
                        trick-taking card game <a href="https://en.wikipedia.org/wiki/Hearts_(card_game)">Hearts</a>. </p>

                    <h3>Setup</h3>
                    <p>
                        A round is set up with the deck evenly split between four players who are divided into two teams.
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

                    If a player collects <strong>every <span class="text-red-500">&hearts;</span> card</strong> (including 2<span class="text-red-500">&hearts;</span> - 4<span class="text-red-500">&hearts;</span>),
                    then all point values for the <span class="text-red-500">&hearts;</span> cards become positive (therefore adding 200 points if A<span class="text-red-500">&hearts;</span> was not face down
                    or 400 points if A<span class="text-red-500">&hearts;</span> was placed face down).

                    <h3>Gameplay</h3>
                    <p>Gameplay happens in rounds, where each round consists of a series of tricks. In each trick, each player submits one card (therefore, one round consists of 13 tricks).
                        After all players have placed any special cards face down, a player is selected to begin the first trick, either randomly or due to collecting Q&spades; last round.</p>
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

                    <p>Each team's points are calculated by adding the players' points together. Except the first round, the player who collected Q&spades;
                        must begin the first trick of the next round. </p>
                </article>
            </div>
        </div>
    );
}

export default Rules;