import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { toFixed, formatNumber } from "../utils/utils";
import { useSelector } from "react-redux";

function LabelSight() {
  const data = useSelector((state) => state.data.data);
  const theme = useSelector((state) => state.theme.theme);

  const marketData = data?.spot?.data;

  const symbol = marketData?.d_sym || "N/A";
  const ltp = toFixed(marketData?.Ltp) || "N/A";
  const change = formatNumber(marketData?.ch);
  const isPriceUp = marketData?.ch > 0;

  // Set the document title dynamically
  if (marketData) {
    document.title = `${symbol} | ${ltp} | ${change}`;
  }

  // Styling logic
  const priceChangeColor = isPriceUp ? "bg-green-100" : "bg-red-100";
  const textColor = isPriceUp ? "text-green-800" : "text-red-800";
  const arrowColor = isPriceUp ? "text-green-700" : "text-red-700";
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-200";

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`flex items-center px-4 py-0 space-x-2 rounded-lg border shadow-sm ${priceChangeColor} ${borderColor} ${
          theme === "dark" ? "bg-opacity-50" : ""
        }`}
        aria-label={`Market status: ${symbol} at ${ltp}`}
      >

        {marketData?.ch !== undefined && (
          <span
            className={`text-sm font-semibold flex items-center ${textColor}`}
          >
            {change}
            {isPriceUp ? (
              <FaArrowUp className={`ml-1 w-3 h-3 ${arrowColor}`} />
            ) : (
              <FaArrowDown className={`ml-1 w-3 h-3 ${arrowColor}`} />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default LabelSight;
