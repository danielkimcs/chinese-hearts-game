import React from "react";

export const PauseScreen = () => {
    return (
        <div className="h-screen absolute top-0 bg-gray-600 bg-opacity-50 w-full z-10 flex">
            <div className="w-96 h-48 bg-white mx-auto my-auto p-5 text-center flex">
                <div className="mx-auto my-auto">
                    A player has disconnected! The game is paused until someone takes their place!
                </div>
            </div>
        </div>
    );
}