import React from "react";
import GameMessageScreen from "./gameMessageScreen";
import { useSelector } from "react-redux";
import { getRoomPlayers, getRoomState, getRoomCurrentTrick, getRoomWinner } from "../../../../services/room/selectors";
const Constants = require('../../../../../../shared/constants');

export const GameMessage = ({ roundHasFinished }) => {
    const players = useSelector(getRoomPlayers);
    const roomState = useSelector(getRoomState);
    const currentTrick = useSelector(getRoomCurrentTrick);
    const winner = useSelector(getRoomWinner);

    const renderGameMessage = () => {
        if (roomState === Constants.ROOM_STATES.ROUND_CONFIRM) {
            return "Waiting for players to place any special cards face down and confirm their hand...";
        } else if (roomState === Constants.ROOM_STATES.ROUND_END) {
            if (winner) {
                let msg;
                if (winner === "tie") {
                    msg = "The teams have tied!";
                } else {
                    msg = (winner === Constants.TEAM_TYPE.TEAM_A ? "Team A" : "Team B") + " has won the game!";
                }
                return msg;
            }
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
        <GameMessageScreen gameMessage={renderGameMessage()} />
    );
}