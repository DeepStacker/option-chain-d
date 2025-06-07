import React from "react";
import { useSelector } from "react-redux";
import { toFixed } from "../utils/utils";

function LabelSight() {
  const data = useSelector((state) => state.data.data);
  const theme = useSelector((state) => state.theme.theme);

  const marketData = data?.spot?.data;
  const futData = data?.fut?.data?.flst;
  const flstKey = Object.keys(futData || {})[0];
  const futureLtp = futData?.[flstKey]?.ltp ?? null;
  const spotLtp = marketData?.Ltp ?? null;

  const spread = futureLtp && spotLtp ? futureLtp - spotLtp : null;
  const isSpreadUp = spread > 0;
  const isSpotUp = marketData?.ch > 0;

  if (marketData && spotLtp !== null) {
    document.title = `${marketData?.d_sym || "N/A"} | ${toFixed(
      spotLtp
    )} | ${toFixed(spread)}`;
  }

  // 🖌️ Dynamic Styling
  const bgColor =
    theme === "dark"
      ? isSpotUp
        ? "bg-green-900"
        : "bg-red-900"
      : isSpotUp
      ? "bg-green-100"
      : "bg-red-100";

  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  const spreadColor = isSpreadUp
    ? theme === "dark"
      ? "text-green-400"
      : "text-green-600"
    : theme === "dark"
    ? "text-red-400"
    : "text-red-600";

  const labelTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const valueTextColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div
      className={`flex items-center justify-center space-x-3 px-4 py-0 rounded-lg border ${bgColor} ${borderColor} shadow-md transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex items-center space-x-1">
        <div className={`text-xs ${labelTextColor}`}>Fut:</div>
        <div className={`text-base font-medium ${valueTextColor}`}>
          {futureLtp !== null ? toFixed(futureLtp) : "--"}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <div className={`text-xs ${labelTextColor}`}>Spot:</div>
        <div className={`text-base font-medium ${valueTextColor}`}>
          {spotLtp !== null ? toFixed(spotLtp) : "--"}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <div className={`text-xs ${labelTextColor}`}>F-S:</div>
        <div className={`text-base font-semibold ${spreadColor}`}>
          {spread !== null ? toFixed(spread) : "--"}
        </div>
      </div>
    </div>
  );
}

export default LabelSight;
