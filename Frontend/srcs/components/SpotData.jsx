// src/components/SpotData.js
import React from "react";
import { FaArrowUp, FaArrowDown, FaChartBar, FaClock, FaDollarSign } from "react-icons/fa"; // Importing icons
import { toFixed, formatNumber } from "../utils/utils";
import MarketSight from "./MarketSight";
import { useSelector } from "react-redux";

function SpotData() {
  const data = useSelector((state) => state.data.data);
  const theme = useSelector((state) => state.theme.theme);

  const marketData = data?.spot?.data;
  const title = `${marketData?.d_sym || "N/A"} | ${toFixed(marketData?.Ltp)} | ${formatNumber(marketData?.ch)}`;

  // Set document title with market data if available
  if (marketData) {
    document.title = title;
  }

  return (
    <div className={`flex w flex-col md:flex-row md:items-center md:justify-between p-4 shadow-md transition ease-in-out ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center md:mb-0">
        <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
          {marketData?.d_sym || "N/A"}
        </p>
        <p className={`mx-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {toFixed(marketData?.Ltp)}
        </p>
        <p className={`text-lg ${marketData?.ch > 0 ? "text-green-400" : "text-red-400"}`}>
          {marketData?.ch > 0 ? <FaArrowUp className="inline mr-1 text-green-400" /> : <FaArrowDown className="inline mr-1 text-red-400" />}
          {formatNumber(marketData?.ch)}
        </p>
        <p className={`text-lg ${marketData?.ch > 0 ? "text-green-400" : "text-red-400"}`}>
          ({formatNumber(marketData?.p_ch)}%)
        </p>
      </div>
      <div>
        <MarketSight />
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaClock className="inline mr-1" /> Open: <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{toFixed(marketData?.op)}</span>
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaArrowUp className="inline mr-1 text-green-400" /> High: <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{toFixed(marketData?.hg)}</span>
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaArrowDown className="inline mr-1 text-red-400" /> Low: <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{toFixed(marketData?.lo)}</span>
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaDollarSign className="inline mr-1" /> Close: <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{toFixed(marketData?.cl)}</span>
        </p>
      </div>
    </div>
  );
}

export default SpotData;
