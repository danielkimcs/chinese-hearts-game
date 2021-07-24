import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoomPlayers, getRoomState } from "../../../../services/room/selectors";
import { sendReplacingPlayerUsername } from "../../../../services/user/actions";

const Constants = require('../../../../../../shared/constants');

const rejoinPanelSettings = {
    [Constants.TEAM_TYPE.TEAM_A]: { darkColor: "bg-red-300", lightColor: "bg-red-200", text: "Team A" },
    [Constants.TEAM_TYPE.TEAM_B]: { darkColor: "bg-blue-300", lightColor: "bg-blue-200", text: "Team B" },
}

const panelHeights = ['h-12', 'h-28', 'h-44', 'h-60', 'h-80'];

export const RejoinPanel = () => {
    const dispatch = useDispatch();
    const players = useSelector(getRoomPlayers);
    const disconnectedPlayers = players.filter(player =>
        player.status === Constants.PLAYER_STATUS.PLAYER_DISCONNECTED);
    const roomState = useSelector(getRoomState);
    return (
        <div className="w-2/3 mx-auto mt-8">
            <div className="container">
                <div className="text-center w-full pt-3 flex flex-col">
                    <span className="text-lg font-bold">Choose a player to replace!</span>
                </div>
                {roomState === Constants.ROOM_STATES.ROOM_SETUP ?
                    <div className="max-w-lg mx-auto">
                        <div className={`${panelHeights[disconnectedPlayers.length]} bg-gray-200 m-3 rounded-lg z-10 shadow-md flex flex-col`}>
                            <div className={`w-full font-bold bg-gray-300 py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                                Disconnected players
                            </div>
                            <div className="flex flex-col my-auto px-4">
                                {disconnectedPlayers.map(player =>
                                    <div key={player.username} className={`text-center m-2 truncate bg-gray-300 rounded-md p-2 shadow-md hover:cursor-pointer hover:opacity-70 text-gray-500 italic`}
                                        onClick={() => dispatch(sendReplacingPlayerUsername(player.username))}>
                                        {player.username}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    : <div className="grid grid-cols-2 mx-auto">
                        {[Constants.TEAM_TYPE.TEAM_A, Constants.TEAM_TYPE.TEAM_B].map((team) => {
                            const disconnectedTeamPlayers = disconnectedPlayers.filter(player =>
                                player.currentTeam === team);
                            return (
                                <div key={team} className={`${panelHeights[disconnectedTeamPlayers.length]} ${rejoinPanelSettings[team].lightColor} m-3 rounded-lg z-10 shadow-md flex flex-col`}>
                                    <div className={`w-full font-bold ${rejoinPanelSettings[team].darkColor} py-3 text-center flex flex-col justify-items-center rounded-t-lg`}>
                                        {rejoinPanelSettings[team].text}
                                    </div>
                                    <div className="flex flex-col my-auto px-4">
                                        {disconnectedTeamPlayers.map(player =>
                                            <div key={player.username} className={`text-center m-2 truncate ${rejoinPanelSettings[team].darkColor} rounded-md p-2 shadow-md hover:cursor-pointer hover:opacity-70 text-gray-500 italic`}
                                                onClick={() => dispatch(sendReplacingPlayerUsername(player.username))}>
                                                {player.username}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        </div>
    );
}