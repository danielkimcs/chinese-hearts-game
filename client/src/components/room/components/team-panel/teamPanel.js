import React, { useState } from "react";
import Spinner from "../../../../shared/components/spinner";
import Button from "../../../../shared/components/button";
import { useDispatch, useSelector } from "react-redux";
import { getRoomPlayers, getRoomSetupCountdown, getRoomState } from "../../../../services/room/selectors";
import { getUsername, getPlayer } from "../../../../services/user/selectors";
import { sendSelectedTeam, sendVoteRandomTeams } from "../../../../services/user/actions";

const Constants = require('../../../../../../shared/constants');

const teamPanelSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-300", lightColor: "bg-red-200", text: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-300", lightColor: "bg-blue-200", text: "Team B" },
    noTeam: { darkColor: "bg-gray-200", lightColor: "bg-gray-100", text: "Not in a team" }
}

const noTeamHeight = ["h-12", "h-24", "h-36", "h-48", "h-56"];

const teamSwitchDelay = 2000;

export const TeamPanel = () => {
    const dispatch = useDispatch();
    const players = useSelector(getRoomPlayers);
    const username = useSelector(getUsername);
    const ownPlayer = useSelector(getPlayer);
    const roomState = useSelector(getRoomState);
    const setupCountdown = useSelector(getRoomSetupCountdown);

    const [clickable, setClickable] = useState(true);

    const noTeamPlayers = players.filter(player =>
        player.status !== Constants.PLAYER_STATUS.PLAYER_DISCONNECTED
        && player.currentTeam.length === 0);

    const numPlayersVotingRandom = players.reduce((count, player) =>
        count += (player.votes.randomizedTeams
            && player.status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? 1 : 0), 0);

    const handleTeamClick = (team) => {
        if (clickable && ownPlayer.currentTeam !== team) {
            dispatch(sendSelectedTeam(team));
            setClickable(false);
            setTimeout(() => {
                setClickable(true);
            }, teamSwitchDelay);
        }
    }

    return (
        <div className="container">
            <div className="text-center w-full pt-3 flex flex-col">
                <span className="text-lg font-bold">
                    {setupCountdown === null ?
                        (roomState === Constants.ROOM_STATES.ROOM_SETUP_COUNTDOWN ? 'Starting the game with these teams...' : 'Choose a team!')
                        : 'Starting in ' + setupCountdown + '...'}
                </span>
                <span className="text-md text-gray-500">Teams have to be balanced to start the game!</span>
                {numPlayersVotingRandom ?
                    <span className="text-md text-gray-500">
                        {numPlayersVotingRandom} out of 4 players {numPlayersVotingRandom > 1 ? 'have' : 'has'} voted for random teams!
                    </span> : null}
            </div>
            <div className="grid grid-cols-2 mx-auto">
                {[Constants.TEAM_TYPE.TEAM_A, Constants.TEAM_TYPE.TEAM_B].map((team) => {
                    let teamPlayers = players.filter(player =>
                        player.status !== Constants.PLAYER_STATUS.PLAYER_DISCONNECTED
                        && player.currentTeam === team);
                    let disabled = !clickable || ownPlayer.currentTeam === team;
                    return (
                        <div key={team} className={`h-56 ${teamPanelSettings[team].lightColor} m-3 relative rounded-lg shadow-md flex flex-col 
                        ${disabled ? 'opacity-60 hover:cursor-not-allowed' : 'hover:cursor-pointer hover:opacity-80'}`}
                            onClick={() => {
                                handleTeamClick(team);
                            }}>
                            {!clickable && ownPlayer.currentTeam !== team ? <div className="absolute w-full h-full grid">
                                <div className="m-auto">
                                    <Spinner />
                                </div>
                            </div> : null}
                            <div className={`w-full font-bold text-lg ${teamPanelSettings[team].darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                                {teamPanelSettings[team].text} ({teamPlayers.length} / 2{teamPlayers.length > 2 ? ' - Too many!' : ''})
                            </div>
                            <div className="flex flex-col my-auto px-4">
                                {teamPlayers.map(player =>
                                    <div key={player.username} className={`text-center m-2 truncate ${username === player.username ? 'font-bold' : ''}`}>
                                        {player.username} {player.votes.randomizedTeams ? '(R)' : ''}
                                    </div>)
                                }
                            </div>
                        </div>
                    );
                })}

                <div className={`col-span-2 ${noTeamHeight[noTeamPlayers.length]} ${teamPanelSettings.noTeam.lightColor} m-3 rounded-lg shadow-md flex flex-col`}>
                    <div className={`w-full font-bold ${teamPanelSettings.noTeam.darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                        {teamPanelSettings.noTeam.text}
                    </div>
                    <div className="flex flex-col my-auto px-4">
                        {noTeamPlayers.map(player =>
                            <div key={player.username} className={`text-center m-2 truncate ${username === player.username ? 'font-bold' : ''}`}>
                                {player.username} {player.votes.randomizedTeams ? '(R)' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {!ownPlayer.votes.randomizedTeams ?
                    <div className="col-span-2">
                        <Button value="VOTE RANDOM TEAMS" onClick={() => dispatch(sendVoteRandomTeams())} />
                    </div> : null}
            </div>
        </div>
    );
}