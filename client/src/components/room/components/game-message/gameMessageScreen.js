import React from "react";

const GameMessageScreen = ({ gameMessage }) => {
    return (
        <div className="absolute top-0 left-0">
            <div className="w-80 h-24 p-2 flex">
                <div className="m-auto font-semibold text-lg break-normal text-center">
                    {gameMessage}
                </div>
            </div>
        </div>
    );
}

export default GameMessageScreen;