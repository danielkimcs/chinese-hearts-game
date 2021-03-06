import React from "react";
import Player from '../player';

import { useSelector } from "react-redux";
import { getRoomCountdown, getRoomState } from "../../../../../../services/room/selectors";

const Constants = require('../../../../../../../../shared/constants');

export const PendingScreen = ({ renderedPlayerList }) => {
    const roomState = useSelector(getRoomState);
    const startingCountdown = useSelector(getRoomCountdown);

    return (
        <div className="w-2/3 mx-auto grid justify-items-center p-3 my-2 mt-12">
            <div className="mb-4">
                <span className="font-medium">
                    {startingCountdown ?
                        `Starting in ${startingCountdown}...`
                        : roomState === Constants.ROOM_STATES.ROOM_PENDING ?
                            `Waiting for players... (${renderedPlayerList.length} / 4)`
                            : ``}
                </span>
            </div>
            <div className="w-2/3 grid grid-flow-row grid-cols-2 grid-rows-2">
                {renderedPlayerList.map(player =>
                    <Player
                        key={player.username}
                        {...player} />
                )}
            </div>
        </div>
    );
}