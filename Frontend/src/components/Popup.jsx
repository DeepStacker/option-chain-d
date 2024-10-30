import React from 'react';

const Popup = ({ data, onClose }) => {
    if (!data) return null; // Don't render if there's no data

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-400 bg-opacity-75 rounded-lg p-8 shadow-lg w-96 z-50">
            <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800 mb-4">{data.strike}</p>
                <div className="bg-gray-100 bg-opacity-80 p-4 rounded-lg shadow-md mb-4 w-full">
                    <p className="text-xl text-center font-semibold"><span className={`${data.isCe ? 'text-red-500' : 'text-green-500'}`}>{data.isCe ? 'CE' : 'PE'}</span></p>
                    <p className="text-lg font-semibold"><strong>OI Change Percentage:</strong> <span className="text-blue-500">{data.oichng_percentage}</span></p>
                    <p className="text-lg font-semibold"><strong>OI Percentage:</strong> <span className="text-blue-500">{data.OI_percentage}</span></p>
                    <p className="text-lg font-semibold"><strong>Volume Percentage:</strong> <span className="text-blue-500">{data.vol_percentage}</span></p>
                </div>
                <button 
                    className="mt-4 bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;
