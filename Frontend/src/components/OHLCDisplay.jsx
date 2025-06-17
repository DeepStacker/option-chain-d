// components/OHLCDisplay.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const OHLCDisplay = ({ ohlcData, livePrice, supportResistanceLevels }) => {
  const theme = useSelector((state) => state.theme.theme);
  const { currentSymbol, timeframe, daily, weekly } = useSelector((state) => state.chart);

  const timeframes = useMemo(
    () => [
      { value: "1", label: "1min" },
      { value: "2", label: "2min" },
      { value: "3", label: "3min" },
      { value: "5", label: "5min" },
      { value: "10", label: "10min" },
      { value: "15", label: "15min" },
      { value: "30", label: "30min" },
      { value: "60", label: "1H" },
      { value: "120", label: "2H" },
      { value: "240", label: "4H" },
      { value: "D", label: "Daily" },
      { value: "W", label: "Weekly" },
      { value: "M", label: "Monthly" },
    ],
    []
  );

  const themeClasses = useMemo(
    () => ({
      ohlcBox: theme === "dark" ? "bg-gray-800 bg-opacity-90 border-gray-700" : "bg-white bg-opacity-90 border-gray-300 shadow-lg",
    }),
    [theme]
  );

  return (
    <div className={`absolute top-20 left-4 z-10 rounded-lg p-3 shadow-lg border ${themeClasses.ohlcBox}`}>
      <div className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        {currentSymbol?.symbol || "Loading..."} - {timeframes.find((tf) => tf.value === timeframe)?.label || timeframe}
        {livePrice && (
          <span className={`ml-2 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
            Live: {livePrice.toFixed(2)}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="flex justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>O:</span>
          <span className={`font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{ohlcData.open}</span>
        </div>
        <div className="flex justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>H:</span>
          <span className={`font-mono ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{ohlcData.high}</span>
        </div>
        <div className="flex justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>L:</span>
          <span className={`font-mono ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>{ohlcData.low}</span>
        </div>
        <div className="flex justify-between">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>C:</span>
          <span className={`font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{ohlcData.close}</span>
        </div>
      </div>
      
      {ohlcData.time && (
        <div className={`text-xs mt-2 border-t pt-1 ${theme === "dark" ? "text-gray-500 border-gray-600" : "text-gray-500 border-gray-300"}`}>
          IST: {ohlcData.time}
        </div>
      )}

      {/* Support/Resistance Info */}
      {supportResistanceLevels && (daily || weekly) && (
        <div className={`text-xs mt-2 border-t pt-1 ${theme === "dark" ? "text-gray-500 border-gray-600" : "text-gray-500 border-gray-300"}`}>
          <div className="text-xs font-medium mb-1">S/R Levels:</div>
          <div className="grid grid-cols-2 gap-x-2 text-xs">
            {daily && (
              <>
                {supportResistanceLevels.support_1 && (
                  <div className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>
                    S1: {parseFloat(supportResistanceLevels.support_1).toFixed(2)}
                  </div>
                )}
                {supportResistanceLevels.resistance_1 && (
                  <div className={theme === "dark" ? "text-yellow-400" : "text-orange-600"}>
                    R1: {parseFloat(supportResistanceLevels.resistance_1).toFixed(2)}
                  </div>
                )}
              </>
            )}
            {weekly && (
              <>
                {supportResistanceLevels.support_2 && (
                  <div className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>
                    S2: {parseFloat(supportResistanceLevels.support_2).toFixed(2)}
                  </div>
                )}
                {supportResistanceLevels.resistance_2 && (
                  <div className={theme === "dark" ? "text-yellow-400" : "text-orange-600"}>
                    R2: {parseFloat(supportResistanceLevels.resistance_2).toFixed(2)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OHLCDisplay;
