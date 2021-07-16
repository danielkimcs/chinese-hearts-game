import React from "react";
import PlayerStatusTag from './playerStatusTag';
const Constants = require('../../../../../../../../../shared/constants');

const teamColors = {
    [Constants.TEAM_TYPE.TEAM_A]: "text-red-400",
    [Constants.TEAM_TYPE.TEAM_B]: "text-blue-400",
}
const disconnectedColor = "text-gray-400";


const PlayerUsernameTag = ({ username, status, currentTeam, textAlign, showConfirmedTag, currentTurn, isBottom }) => {
    return (
        <div className={`col-span-1 xl:col-span-2 flex flex-col justify-center px-2 ${textAlign}`}>
            <div className={`flex flex-row ${!isBottom ? 'bg-gray-200 rounded-xl ' + (textAlign === 'text-left' ? 'pr-2' : 'pl-2') : ''}`}>
                {textAlign === 'text-left' ?
                    <div className={`inline-block flex-none align-middle mr-2 truncate`}>
                        <PlayerStatusTag {...{showConfirmedTag, currentTurn}} />
                    </div> : null}
                <div className="inline-block flex-grow align-middle truncate">
                    <span className={`font-bold text-lg truncate ` + (status === Constants.PLAYER_STATUS.PLAYER_CONNECTED ? teamColors[currentTeam] : disconnectedColor)}>
                        {`${isBottom ? 'You: ' : ''}${username}`}
                    </span>
                </div>
                {textAlign === 'text-right' ?
                    <div className={`inline-block flex-none align-middle ml-2 truncate`}>
                        <PlayerStatusTag {...{showConfirmedTag, currentTurn}} />
                    </div> : null}
            </div>
        </div>
    );
}

export default PlayerUsernameTag;