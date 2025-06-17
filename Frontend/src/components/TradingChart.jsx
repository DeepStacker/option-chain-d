// components/TradingChart.jsx
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSymbols,
  setCurrentSymbol,
  setTimeframe,
  setChartData, // Import setChartData
} from "../context/chartSlice";

import ChartContainer from "./ChartContainer";
import SupportResistanceLines from "./SupportResistanceLines";
import DataFetcher from "./DataFetcher";
import Toolbar from "./Toolbar";
import OHLCDisplay from "./OHLCDisplay";
import CustomTimeframeModal from "./CustomTimeframeModal";

const TradingChart = React.memo(() => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const { symbols, currentSymbol, daily, weekly } = useSelector((state) => state.chart);

  // Refs for chart components
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  // Local state
  const [ohlcData, setOhlcData] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    time: "",
  });
  const [livePrice, setLivePrice] = useState(null);
  const [showCustomTimeframe, setShowCustomTimeframe] = useState(false);
  const [customInterval, setCustomInterval] = useState("");

  // Load symbols
  const loadSymbols = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/symbol");
      const symbolsData = await response.json();

      const symbols = Array.isArray(symbolsData)
        ? symbolsData
        : symbolsData.data || [];
      dispatch(setSymbols(symbols));

      if (symbols.length > 0 && !currentSymbol) {
        dispatch(setCurrentSymbol(symbols[0]));
      }
    } catch (error) {
      console.error("❌ Failed to load symbols:", error);
    }
  }, [dispatch, currentSymbol]);

  useEffect(() => {
    if (symbols.length === 0) {
      loadSymbols();
    }
  }, [symbols.length, loadSymbols]);

  // Handlers
  const handleOHLCUpdate = useCallback((data) => {
    setOhlcData(data);
    dispatch(setChartData(data)); // Dispatch setChartData
  }, [dispatch]);

  const handleLivePriceUpdate = useCallback((price) => {
    setLivePrice(price);
  }, []);

  const handleCustomTimeframeClick = useCallback(() => {
    setShowCustomTimeframe(true);
  }, []);

  const handleCustomTimeframeApply = useCallback(() => {
    if (customInterval && parseInt(customInterval) > 0) {
      dispatch(setTimeframe(customInterval));
      setShowCustomTimeframe(false);
      setCustomInterval("");
    }
  }, [customInterval, dispatch]);

  const handleCustomTimeframeCancel = useCallback(() => {
    setShowCustomTimeframe(false);
    setCustomInterval("");
  }, []);

  // Get support/resistance levels from SupportResistanceLines component
  const supportResistanceComponent = SupportResistanceLines({
    candleSeriesRef,
    daily,
    weekly,
  });
  const { supportResistanceLevels } = supportResistanceComponent;

  const themeClasses = useMemo(
    () => ({
      container:
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
    }),
    [theme]
  );

  return (
    <div
      className={`h-screen font-sans flex flex-col relative ${themeClasses.container}`}
    >
      {/* OHLC Display */}
      <OHLCDisplay
        ohlcData={ohlcData}
        livePrice={livePrice}
        supportResistanceLevels={supportResistanceLevels}
      />

      {/* Custom Timeframe Modal */}
      <CustomTimeframeModal
        showCustomTimeframe={showCustomTimeframe}
        customInterval={customInterval}
        setCustomInterval={setCustomInterval}
        onApply={handleCustomTimeframeApply}
        onCancel={handleCustomTimeframeCancel}
      />

      {/* Toolbar */}
      <Toolbar onCustomTimeframeClick={handleCustomTimeframeClick} />

      {/* Chart Container */}
      <ChartContainer
        onOHLCUpdate={handleOHLCUpdate}
        chartRef={chartRef}
        candleSeriesRef={candleSeriesRef}
      />

      {/* Data Fetcher */}
      <DataFetcher
        candleSeriesRef={candleSeriesRef}
        onOHLCUpdate={handleOHLCUpdate}
        onLivePriceUpdate={handleLivePriceUpdate}
      />

      {/* Support/Resistance Lines */}
      <div>{supportResistanceLevels}</div>
    </div>
  );
});

TradingChart.displayName = "TradingChart";

export default TradingChart;
