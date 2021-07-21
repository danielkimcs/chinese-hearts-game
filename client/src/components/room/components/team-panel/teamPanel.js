import React from "react";
import { useSelector } from "react-redux";
import { getRoomPlayers } from "../../../../services/room/selectors";

const Constants = require('../../../../../../shared/constants');

const teamPanelSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-300", lightColor: "bg-red-200", text: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-300", lightColor: "bg-blue-200", text: "Team B" },
    noTeam: { darkColor: "bg-gray-200", lightColor: "bg-gray-100", text: "Not in a team" }
}

export const TeamPanel = () => {
    const players = useSelector(getRoomPlayers);
    return (
        <div className="container">
            <div className="text-center w-full pt-3">
                <span className="text-lg font-bold">Choose a team!</span>
            </div>
            <div className="grid grid-cols-2 mx-auto">
                {[Constants.TEAM_TYPE.TEAM_A, Constants.TEAM_TYPE.TEAM_B].map((team) => {
                    let teamPlayers = players.filter(player =>
                        player.status !== Constants.PLAYER_STATUS.PLAYER_DISCONNECTED
                        && player.currentTeam === team);
                    return (
                        <div className={`h-36 ${teamPanelSettings[team].lightColor} m-3 rounded-lg shadow-md flex flex-col hover:cursor-pointer hover:opacity-80`}>
                            <div className={`w-full font-bold ${teamPanelSettings[team].darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                                {teamPanelSettings[team].text}
                            </div>
                            <div className="flex flex-col my-auto px-4">
                                {teamPlayers.map(player =>
                                    <div className="text-center m-2 truncate">
                                        {player.username}
                                    </div>)
                                }
                            </div>
                        </div>
                    );
                })}

                <div className={`col-span-2 h-56 ${teamPanelSettings.noTeam.lightColor} m-3 rounded-lg shadow-md flex flex-col`}>
                    <div className={`w-full font-bold ${teamPanelSettings.noTeam.darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                        {teamPanelSettings.noTeam.text}
                    </div>
                    <div className="flex flex-col my-auto px-4">
                        {players.filter(player =>
                            player.status !== Constants.PLAYER_STATUS.PLAYER_DISCONNECTED
                            && player.currentTeam.length === 0).map(player =>
                                <div className="text-center m-2 truncate">
                                    {player.username}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}