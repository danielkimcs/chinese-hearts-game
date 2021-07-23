import React from "react";

export const ActionButtons = ({ children }) => {
    const existingChildren = React.Children.toArray(children).filter(Boolean);
    return (
        <>
            {existingChildren.length ? <div className="my-8">
                {existingChildren}
            </div> : null}
        </>
    );
}