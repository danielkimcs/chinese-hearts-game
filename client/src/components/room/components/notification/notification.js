import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../services/user/actions';

const notificationDelay = 5000;

export const Notification = ({ message }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (message.length) {
            setTimeout(() => {
                dispatch(setNotification(""));
            }, notificationDelay);
        }
    }, [message]);

    return (
        <>{message.length ?
            <div className="fixed bottom-5 bg-blue-100 border-t border-b border-blue-500 text-blue-700 max-w-sm break-words" role="alert">
                <div className="relative w-full h-full px-4 py-3 pr-7">
                    <div onClick={() => dispatch(setNotification(""))} className="hover:opacity-60 hover:cursor-pointer bg-blue-600 w-5 h-5 absolute top-0 right-0 flex flex-col justify-center text-white">
                        <span className="my-auto mx-auto">X</span>
                    </div>
                    <p>{message}</p>
                </div>
            </div> : null}
        </>
    );
}
