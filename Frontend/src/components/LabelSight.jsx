import React from "react";
import { useSelector } from "react-redux";
import { toFixed } from "../utils/utils";

function LabelSight() {
  const data = useSelector((state) => state.data.data);
  const theme = useSelector((state) => state.theme.theme);

  const marketData = data?.spot?.data;
  const futData = data?.fut?.data?.flst;
  const flstKey = Object.keys(futData || {})[0];
  const futureLtp = futData?.[flstKey]?.ltp;
  const spotLtp = marketData?.Ltp;

  const spread = futureLtp - spotLtp;
  const isSpreadUp = spread > 0;
  const isSpotUp = marketData?.ch > 0;

  if (marketData) {
    document.title = `${marketData?.d_sym || "N/A"} | ${toFixed(spotLtp)} | ${toFixed(spread)}`;
  }

  // 🎨 Dynamic theme-based styles
  const bgColor = theme === "dark"
    ? isSpotUp ? "bg-green-900" : "bg-red-900"
    : isSpotUp ? "bg-green-50" : "bg-red-50";

  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const spreadColor = isSpreadUp
    ? (theme === "dark" ? "text-green-400" : "text-green-600")
    : (theme === "dark" ? "text-red-400" : "text-red-600");

  const labelTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const valueTextColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div
      className={`flex items-center justify-center space-x-3 px-3 py-1.5 rounded-full border ${bgColor} ${borderColor} shadow-sm transition-all duration-200`}
    >
      <div className={`text-xs ${labelTextColor}`}>Fut:</div>
      <div className={`text-sm font-medium ${valueTextColor}`}>{toFixed(futureLtp)}</div>

      <div className={`text-xs ${labelTextColor}`}>Spot:</div>
      <div className={`text-sm font-medium ${valueTextColor}`}>{toFixed(spotLtp)}</div>

      <div className={`text-xs ${labelTextColor}`}>F-S:</div>
      <div className={`text-sm font-semibold ${spreadColor}`}>{toFixed(spread)}</div>
    </div>
  );
}

export default LabelSight;
