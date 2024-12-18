import { FaTimes, FaCopy } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";

const ReversalPopup = ({ onClose }) => {
    const strike = useSelector((state) => state.optionChain.strike);
    const theme = useSelector((state) => state.theme.theme);
    const data = useSelector((state) => state.data.data);

    const reversal = data?.options?.data?.oc || {};

    const strike_diff = Object.keys(reversal).map(Number);
    if (strike_diff.length < 2) {
        return <div>Data unavailable</div>;
    }

    const stk_diff = strike_diff[1] - strike_diff[0];
    const strikes = Number(strike) + Number(stk_diff);
    const nstrikes = Number(strike) - Number(stk_diff);


    const [activeSection, setActiveSection] = useState("current");

    const sections = {
        current: {
            title: "Spot",
            data: [
                { label: "Resistance", value: reversal?.[strikes]?.reversal?.reversal || 0 },
                { label: "Support", value: reversal?.[strike]?.reversal?.reversal || 0 },
            ],
        },
        weekly: {
            title: "Weekly",
            data: [
                { label: "Resistance", value: reversal?.[strike]?.reversal?.wkly_reversal || 0 },
                { label: "Support", value: reversal?.[nstrikes]?.reversal?.wkly_reversal || 0 },
            ],
        },
        future: {
            title: "Future",
            data: [
                { label: "Resistance", value: reversal?.[strikes]?.reversal?.fut_reversal || 0 },
                { label: "Support", value: reversal?.[strike]?.reversal?.fut_reversal || 0 },
            ],
        },
    };

    const handleCopy = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            // alert("Copied to clipboard!");
        } else {
            alert("Clipboard not supported");
        }
    };

    return (
        <div
            id="popup-overlay"
            onClick={(e) => e.target.id === "popup-overlay" && onClose()}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
        >
            <div className={`relative w-1/5 max-w-sm p-3 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                {/* <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors" aria-label="Close Popup">
                    <FaTimes size={20} />
                </button> */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl text-sky-500 font-bold">{strike}</h2>
                </div>
                <div className="flex justify-around border-b mb-6">
                    {Object.keys(sections).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveSection(key)}
                            className={`pb-2 px-4 ${activeSection === key ? "border-b-2 border-blue-500 font-bold text-orange-500 " : "text-gray-500"}`}
                        >
                            {sections[key].title}
                        </button>
                    ))}
                </div>
                <div className="space-y-4">
                    {sections[activeSection].data.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${item.label === "Resistance" ? "text-red-600" : "text-green-600"}`}>
                                    {item.label}:
                                </span>
                                <span className="text-lg font-semibold">{item.value}</span>
                            </div>
                            <button onClick={() => handleCopy(item.value)} className="text-green-500 hover:text-blue-500 transition" aria-label={`Copy ${item.label}`}>
                                <FaCopy size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

ReversalPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ReversalPopup;
