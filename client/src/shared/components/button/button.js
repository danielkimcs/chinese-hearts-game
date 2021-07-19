import React from "react";

export const Button = ({ value, onClick }) => {
    return (
        <div className="w-full flex mt-16">
            <div className="mx-auto">
                <button
                    className="btn w-auto mx-auto bg-green-400 hover:text-green-400"
                    onClick={onClick}>
                    {value}
                </button>
            </div>
        </div>
    );
}