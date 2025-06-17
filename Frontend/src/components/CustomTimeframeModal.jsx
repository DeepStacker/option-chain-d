// components/CustomTimeframeModal.jsx
import React from "react";
import { useSelector } from "react-redux";

const CustomTimeframeModal = ({ 
  showCustomTimeframe, 
  customInterval, 
  setCustomInterval, 
  onApply, 
  onCancel 
}) => {
  const theme = useSelector((state) => state.theme.theme);

  const themeClasses = {
    modal: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300",
    input: theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300",
  };

  if (!showCustomTimeframe) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className={`p-6 rounded-lg border ${themeClasses.modal}`}>
        <h3 className="text-lg font-semibold mb-4">Custom Timeframe</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter minutes"
            value={customInterval}
            onChange={(e) => setCustomInterval(e.target.value)}
            className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
          />
          <span className={`self-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            minutes
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded transition-colors ${
              theme === "dark"
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTimeframeModal;
