import React, { useState, useEffect } from 'react';

const notificationDelay = 4000;

export const Notification = ({ message }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        if (message.length) {
            setNotificationOpen(true);
            setTimeout(() => {
                setNotificationOpen(false);
            }, notificationDelay);
        }
    }, [message]);

    return (
        <>{notificationOpen ?
            <div className="fixed bottom-5 bg-blue-100 border-t border-b border-blue-500 text-blue-700" role="alert">
                <div className="relative w-full h-full px-4 py-3 pr-7">
                    <div onClick={() => setNotificationOpen(false)} className="hover:opacity-60 hover:cursor-pointer bg-blue-600 w-5 h-5 absolute top-0 right-0 flex flex-col justify-center text-white">
                        <span className="my-auto mx-auto">X</span>
                    </div>
                    <p>{message}</p>
                </div>
            </div> : null}
        </>
    );
}
