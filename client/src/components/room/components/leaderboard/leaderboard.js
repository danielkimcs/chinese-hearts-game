import React from "react";
import { useSelector } from "react-redux";
import { getUsername } from "../../../../services/user/selectors";
import { getRoomPlayers, getRoomWinner } from "../../../../services/room/selectors";
const Constants = require('../../../../../../shared/constants');

const teamLeaderboardSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-200", lightColor: "bg-red-100", name: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-200", lightColor: "bg-blue-100", name: "Team B" },
    winningColors: { darkColor: "bg-yellow-200", lightColor: "bg-yellow-100" },
    disconnectedColor: "bg-gray-100"
}

export const Leaderboard = () => {
    const myUsername = useSelector(getUsername);
    const players = useSelector(getRoomPlayers);
    const winner = useSelector(getRoomWinner);

    if (!players || !(players.length === 4)) return null;
    return (
        <div className="w-80 h-24 p-2 flex">
            <table className="table-fixed w-full bg-gray-200 text-gray-800">
                <thead>
                    <tr className="text-left border-b-2 border-gray-300">
                        <th className="px-3 w-3/4">Team</th>
                        <th className="w-1/4">Points</th>
                    </tr></thead>
                <tbody>
                    {[Constants.TEAM_TYPE.TEAM_A, Constants.TEAM_TYPE.TEAM_B].map((team) => {
                        const teamPlayers = players.filter(player => player.currentTeam === team);
                        const isThereInstantWinner = teamPlayers.filter(player => player.points === Constants.COLLECTED_ALL_CARDS).length > 0;
                        if (!teamPlayers.length) return null;
                        const darkColor = team === winner ? teamLeaderboardSettings.winningColors.darkColor : teamLeaderboardSettings[team].darkColor;
                        const lightColor = team === winner ? teamLeaderboardSettings.winningColors.lightColor : teamLeaderboardSettings[team].lightColor;
                        return (
                            <React.Fragment key={team}>
                                <tr className={`${darkColor} border-b border-gray-200`}>
                                    <td className="truncate px-3">{teamLeaderboardSettings[team].name}</td>
                                    <td className="">{!isThereInstantWinner ?
                                        teamPlayers.reduce((totalPoints, currentTeamPlayer) => totalPoints + currentTeamPlayer.points, 0)
                                        : "INSTANT WIN!"}</td>
                                </tr>
                                {teamPlayers.map(currentTeamPlayer =>
                                    <tr key={currentTeamPlayer.username} className={`${currentTeamPlayer.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED ?
                                        teamLeaderboardSettings.disconnectedColor : lightColor} border-b border-gray-200`}>
                                        <td className={`truncate px-12 ${myUsername === currentTeamPlayer.username ? 'font-bold' : ''}`}>{currentTeamPlayer.username}</td>
                                        <td className="">{isThereInstantWinner ? '' : currentTeamPlayer.points}</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}