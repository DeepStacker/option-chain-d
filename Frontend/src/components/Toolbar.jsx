// components/Toolbar.jsx
import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentSymbol, setTimeframe, setDaily, setWeekly } from "../context/chartSlice";

const Toolbar = ({ onCustomTimeframeClick }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const { symbols, currentSymbol, timeframe, connectionStatus, daily, weekly } = useSelector((state) => state.chart);

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
      toolbar: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300",
      select: theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300",
      button: theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900",
      activeButton: theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
    }),
    [theme]
  );

  return (
    <div className={`flex flex-wrap gap-2 p-3 border-b shadow-lg ${themeClasses.toolbar}`}>
      <select
        className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${themeClasses.select}`}
        value={currentSymbol?.symbol || ""}
        onChange={(e) => {
          const newSymbol = symbols.find((s) => s.symbol === e.target.value);
          if (newSymbol) dispatch(setCurrentSymbol(newSymbol));
        }}
      >
        <option value="">Select Symbol</option>
        {symbols.map((s) => (
          <option key={s.sym_id} value={s.symbol}>
            {s.symbol}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-1">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeframe === tf.value ? themeClasses.activeButton : themeClasses.button
            }`}
            onClick={() => dispatch(setTimeframe(tf.value))}
          >
            {tf.label}
          </button>
        ))}

        <button
          onClick={onCustomTimeframeClick}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${themeClasses.button}`}
        >
          Custom
        </button>
      </div>

      {/* Support/Resistance Toggle Controls */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            Daily ({daily ? "ON" : "OFF"})
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={daily}
              onChange={(e) => dispatch(setDaily(e.target.checked))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 transition duration-300"></div>
            <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            Weekly ({weekly ? "ON" : "OFF"})
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={weekly}
              onChange={(e) => dispatch(setWeekly(e.target.checked))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 transition duration-300"></div>
            <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>

      <div
        className={`px-3 py-2 rounded-md ml-auto text-sm font-medium capitalize transition-all duration-200 ${
          connectionStatus === "connected"
            ? "bg-green-600 text-white"
            : connectionStatus === "loading"
            ? "bg-yellow-600 text-white animate-pulse"
            : "bg-red-600 text-white"
        }`}
      >
        {connectionStatus === "loading" ? "Loading..." : connectionStatus}
      </div>
    </div>
  );
};

export default Toolbar;
