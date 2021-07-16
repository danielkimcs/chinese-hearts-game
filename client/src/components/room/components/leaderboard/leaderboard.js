import React from "react";
const Constants = require('../../../../../../shared/constants');

const teamLeaderboardSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-200", lightColor: "bg-red-100", name: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-200", lightColor: "bg-blue-100", name: "Team B" },
    disconnectedColor: "bg-gray-100"
}

export const Leaderboard = ({ myUsername, players }) => {
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
                        let teamPlayers = players.filter(player => player.currentTeam === team);
                        if (!teamPlayers.length) return null;
                        return (
                            <React.Fragment key={team}>
                                <tr className={`${teamLeaderboardSettings[team].darkColor} border-b border-gray-200`}>
                                    <td className="truncate px-3">{teamLeaderboardSettings[team].name}</td>
                                    <td className="">{teamPlayers.reduce((totalPoints, currentTeamPlayer) => totalPoints + currentTeamPlayer.points, 0)}</td>
                                </tr>
                                {teamPlayers.map(currentTeamPlayer =>
                                    <tr key={currentTeamPlayer.username} className={`${currentTeamPlayer.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED ?
                                        teamLeaderboardSettings.disconnectedColor : teamLeaderboardSettings[team].lightColor} border-b border-gray-200`}>
                                        <td className={`truncate px-12 ${myUsername === currentTeamPlayer.username ? 'font-bold' : ''}`}>{currentTeamPlayer.username}</td>
                                        <td className="">{currentTeamPlayer.points}</td>
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