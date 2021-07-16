import React from "react";
const Constants = require('../../../../../../shared/constants');

export const GameMessage = ({ players, roomState, roundHasFinished, currentTrick }) => {
    const renderGameMessage = () => {
        if (roomState === Constants.ROOM_STATES.ROUND_CONFIRM) {
            return "Waiting for players to place any special cards face down and confirm their hand...";
        } else if (roomState === Constants.ROOM_STATES.ROUND_END) {
            return "The round has ended!";
        } else if (currentTrick && players) {
            let currentTurnPlayer = players.filter(player => player.playerId === currentTrick.currentTurnPlayerId)[0];
            let currentTurnPlayerName = currentTurnPlayer ? currentTurnPlayer.username : null;
            if (currentTurnPlayerName) {
                if (roomState === Constants.ROOM_STATES.TRICK_PLAY) {
                    return `${currentTurnPlayerName} is starting the trick!`;
                } else if (roomState === Constants.ROOM_STATES.TRICK_PENDING) {
                    return `Waiting for ${currentTurnPlayerName} to play a card...`;
                }
            } else if (roomState === Constants.ROOM_STATES.TRICK_END && currentTrick.winnerPlayerName) {
                return `${currentTrick.winnerPlayerName} has won this trick! ${!roundHasFinished ? 'Starting next trick...' : 'Calculating points...'}`;
            }
        }
    }

    return (
        <div className="absolute top-0 left-0">
            <div className="w-80 h-24 p-2 flex">
                <div className="m-auto font-semibold text-lg break-normal text-center">
                    {renderGameMessage()}
                </div>
            </div>
        </div>
    );
}