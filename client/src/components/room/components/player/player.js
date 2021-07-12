import React, { useState } from 'react';
const Constants = require('../../../../../../shared/constants');

const teamColors = {
    [Constants.TEAM_TYPE.TEAM_A]: "red",
    [Constants.TEAM_TYPE.TEAM_B]: "blue",
}

export const Player = ({ username, status, currentTeam, numFaceDown, showConfirmedTag, currentTurn, playedCard }) => {
    return (
        <div className="player-container">
            <p style={{
                textDecoration: (status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? "none" : "line-through"),
                color: (currentTeam.length ? teamColors[currentTeam] : "black")
            }}>
                {username ? username + " " : null}
                {numFaceDown ? numFaceDown + " cards face down" : null}
                {showConfirmedTag ? "CONFIRMED" : null}
                {currentTurn ? "<- CURRENT TURN" : null}
                {playedCard ? playedCard.suit + " " + playedCard.rank : null}
            </p>
        </div>
    );
}