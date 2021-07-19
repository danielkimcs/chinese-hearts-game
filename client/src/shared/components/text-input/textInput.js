import React from 'react';

export const TextInput = ({ label, value, onChange, invalid, errorMessage }) => {
    return (
        <div className="my-3 mx-auto" style={{ maxWidth: "193px" }}>
            <span className="block text-sm text-gray-500">{label}</span>
            <input className="w-full" type="text" value={value} onChange={e => onChange(e.target.value)} />
            {invalid ? <span className="block text-sm text-gray-500 w-full break-normal text-red-400">
                {errorMessage}
            </span> : null}
        </div>
    );
}