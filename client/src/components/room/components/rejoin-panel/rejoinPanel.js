import React from "react";
import { useSelector } from "react-redux";
import { getRoomPlayers } from "../../../../services/room/selectors";

const Constants = require('../../../../../../shared/constants');

const rejoinPanelSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-300", lightColor: "bg-red-200", text: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-300", lightColor: "bg-blue-200", text: "Team B" },
}

export const RejoinPanel = () => {
    const players = useSelector(getRoomPlayers);
    const disconnectedPlayers = players.filter(player =>
        player.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED);
    return (
        <div className="w-2/3 mx-auto mt-8">
            <div className="container">
                <div className="text-center w-full pt-3 flex flex-col">
                    <span className="text-lg font-bold">Choose a player to replace!</span>
                </div>

                <div className="grid grid-cols-2 mx-auto">
                    {[Constants.TEAM_TYPE.TEAM_A, Constants.TEAM_TYPE.TEAM_B].map((team) => {
                        const disconnectedTeamPlayers = disconnectedPlayers.filter(player =>
                            player.currentTeam === team);
                        return (
                            <div className={`${disconnectedTeamPlayers.length === 2 ? 'h-44' : 'h-28'} ${rejoinPanelSettings[team].lightColor} m-3 rounded-lg z-10 shadow-md flex flex-col`}>
                                <div className={`w-full font-bold ${rejoinPanelSettings[team].darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                                    {rejoinPanelSettings[team].text}
                                </div>
                                <div className="flex flex-col my-auto px-4">
                                    {disconnectedTeamPlayers.map(player =>
                                        <div className={`text-center m-2 truncate ${rejoinPanelSettings[team].darkColor} rounded-md p-2 shadow-md hover:cursor-pointer hover:opacity-70 text-gray-500 italic`}>
                                            {player.username}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}