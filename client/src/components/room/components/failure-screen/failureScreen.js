import React from "react";
import { useHistory } from 'react-router-dom';

export const FailureScreen = ({ message }) => {
    const history = useHistory();

    return (
        <div className="container mx-auto p-24">
            <h1 className="text-lg font-bold text-center mb-5">
                {message}
            </h1>
            <div className="w-full text-center">
                <button onClick={() => history.push("/")} className="w-28 mx-auto bg-red-400 hover:bg-white py-2 px-4 text-white font-semibold shadow-md hover:text-red-400 focus:outline-none">GO BACK</button>
            </div>
        </div>
    );
}