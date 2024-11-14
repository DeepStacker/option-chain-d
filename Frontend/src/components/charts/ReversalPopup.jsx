import { useState } from 'react';
import { FaTimes, FaCopy } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ReversalPopup = ({ strike, onClose }) => {
    const theme = useSelector((state) => state.theme.theme);
    const data = useSelector((state) => state.data.data);
    const reversal = data?.options?.data?.oc || {};
    const strike_diff = Object.keys(reversal);
    const stk_diff = strike_diff[1] - strike_diff[0];

    // Close the popup when clicking outside
    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            onClose();
        }
    };

    // Function to handle copy
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div
            id="popup-overlay"
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`relative p-6 max-w-md w-full h-auto rounded-lg shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close Popup"
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={24} />
                </button>

                {/* Title */}
                <div className="text-center mb-4">
                    <p className="text-2xl font-bold">{strike}</p>
                </div>

                {/* Resistance and Support */}
                <div className="flex flex-col items-center gap-4">
                    {/* Resistance */}
                    <div className="flex items-center gap-2">
                        <p className="text-lg text-rose-600 font-medium">Resistance:</p>
                        <p className="text-lg">
                            {reversal?.[strike]?.reversal?.reversal || 0}
                        </p>
                        <button
                            onClick={() => handleCopy(reversal?.[strike]?.reversal?.reversal || 0)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label="Copy Resistance"
                        >
                            <FaCopy size={18} />
                        </button>
                    </div>

                    {/* Support */}
                    <div className="flex items-center gap-2">
                        <p className="text-lg text-green-600 font-medium">Support:</p>
                        <p className="text-lg">
                            {reversal?.[strike - stk_diff]?.reversal?.reversal || 0}
                        </p>
                        <button
                            onClick={() => handleCopy(reversal?.[strike - stk_diff]?.reversal?.reversal || 0)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label="Copy Support"
                        >
                            <FaCopy size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReversalPopup.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default ReversalPopup;
