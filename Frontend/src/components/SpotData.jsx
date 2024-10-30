// src/components/SpotData.js
import React, { useContext } from "react";
import { toFixed, formatNumber } from "../utils/utils";
import { AppContext } from "../context/AppProvider";
import MarketSight from "./MarketSight";


function SpotData() {
  const { data } = useContext(AppContext);

  const marketData = (data.spot.data)
  // const optionChain = (data.options.data)

  const title = `${marketData.d_sym}  | ${toFixed(marketData.Ltp)} | ${formatNumber(marketData.ch)}`;

  document.title = title;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1 bg-white shadow-md ">
      <div className="flex items-center md:mb-0">
        <p className="text-xl font-semibold text-gray-800">{marketData.d_sym || "N/A"}</p>
        <p className="mx-2 text-2xl font-bold text-gray-800">{toFixed(marketData.Ltp)}</p>
        <p className={`text-lg ${marketData.ch > 0 ? "text-green-500" : "text-red-500"}`}>
          {formatNumber(marketData.ch)}
        </p>
        <p className={`text-lg ${marketData.ch > 0 ? "text-green-500" : "text-red-500"}`}>
          ({formatNumber(marketData.p_ch)}%)
        </p>
      </div>
      <div>
        <MarketSight />
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center text-gray-600">
        <p className="text-sm">Open: <span className="font-medium text-gray-800">{toFixed(marketData.op)}</span></p>
        <p className="text-sm">High: <span className="font-medium text-gray-800">{toFixed(marketData.hg)}</span></p>
        <p className="text-sm">Low: <span className="font-medium text-gray-800">{toFixed(marketData.lo)}</span></p>
        <p className="text-sm">Close: <span className="font-medium text-gray-800">{toFixed(marketData.cl)}</span></p>
      </div>
    </div>
  );
}

export default SpotData;
