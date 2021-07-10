import React, { useEffect } from 'react';
import Player from '../player';
const Constants = require('../../../../../../shared/constants');

export const PlayerList = ({ players }) => {
    const renderPlayerList = () => {
        let teamPlayers = players.filter(player =>
            player.currentTeam.length > 0
            && player.nextPlayerUsername.length > 0);
        if (teamPlayers.length !== Constants.REQUIRED_NUM_PLAYERS) {
            return players;
        }
        else { // Sort into player order
            let usernameToPlayerObj = {};
            teamPlayers.forEach(playerObj => usernameToPlayerObj[playerObj.username] = playerObj);

            let sortedTeamPlayers = [teamPlayers[0]];
            let currentPlayerUsername = teamPlayers[0].nextPlayerUsername;
            while (currentPlayerUsername.localeCompare(teamPlayers[0].username) !== 0) {
                let currentPlayerObj = usernameToPlayerObj[currentPlayerUsername];
                sortedTeamPlayers.push(currentPlayerObj);
                currentPlayerUsername = currentPlayerObj.nextPlayerUsername;
            }

            return sortedTeamPlayers;
        }
    }

    return (
        <div className="player-list-container">
            {renderPlayerList().map(player => {
                return (<Player key={player.username} {...player} />)
            })}
        </div>
    );
}