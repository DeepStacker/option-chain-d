import { FaTimes, FaCopy } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ReversalPopup = ({ onClose }) => {
    const strike = useSelector((state) => state.optionChain.strike);
    const theme = useSelector((state) => state.theme.theme);
    const data = useSelector((state) => state.data.data);
    const reversal = data?.options?.data?.oc || {};
    const strike_diff = Object.keys(reversal);
    const stk_diff = strike_diff[1] - strike_diff[0];

    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            onClose();
        }
    };

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
                className={`relative w-11/12 max-w-md p-6 rounded-lg shadow-lg transition-all ${theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Close Popup"
                >
                    <FaTimes size={20} />
                </button>

                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Strike Price: <span className="font-bold">{strike}</span>
                    </h2>
                </div>

                {/* Resistance and Support */}
                <div className="space-y-4">
                    {/* Resistance */}
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-red-600">
                                Resistance:
                            </span>
                            <span className="text-lg font-semibold">
                                {reversal?.[strike]?.reversal?.reversal || 0}
                            </span>
                        </div>
                        <button
                            onClick={() => handleCopy(reversal?.[strike]?.reversal?.reversal || 0)}
                            className="text-green-500 hover:text-blue-500 transition"
                            aria-label="Copy Resistance"
                        >
                            <FaCopy size={16} />
                        </button>
                    </div>

                    {/* Support */}
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600">
                                Support:
                            </span>
                            <span className="text-lg font-semibold">
                                {reversal?.[strike - stk_diff]?.reversal?.reversal || 0}
                            </span>
                        </div>
                        <button
                            onClick={() => handleCopy(reversal?.[strike - stk_diff]?.reversal?.reversal || 0)}
                            className="text-green-500 hover:text-blue-500 transition"
                            aria-label="Copy Support"
                        >
                            <FaCopy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReversalPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ReversalPopup;
