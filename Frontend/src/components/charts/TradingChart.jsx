import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSymbols,
  setCurrentSymbol,
  setTimeframe,
  setChartData,
  setConnectionStatus,
  appendLiveCandle,
} from "../../context/chartSlice";
import { createChart, CandlestickSeries, LineStyle } from "lightweight-charts";

// Helper function to format dates as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function TradingChart() {
  const dispatch = useDispatch();

  // Refs for chart elements
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const evtSourceRef = useRef(null);
  const supportResistanceLinesRef = useRef([]);

  // State for OHLC display
  const [ohlcData, setOhlcData] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    time: "",
  });

  // Get state from Redux
  const { symbols, currentSymbol, timeframe, connectionStatus } = useSelector(
    (state) => state.chart
  );

  // Function to draw support/resistance lines
  const drawSupportResistanceLines = (levels) => {
    if (!candleSeriesRef.current) return;

    // Remove existing lines
    supportResistanceLinesRef.current.forEach((line) => {
      candleSeriesRef.current.removePriceLine(line);
    });
    supportResistanceLinesRef.current = [];

    if (!levels) return;

    const colors = {
      support: "#1976d2",
      resistance: "#fbc02d",
    };

    const lineOptions = (price, color, title) => ({
      price,
      color,
      lineWidth: 3,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title,
    });

    // Create new lines
    const newLines = [
      candleSeriesRef.current.createPriceLine(
        lineOptions(levels.support1, colors.support, "S1")
      ),
      candleSeriesRef.current.createPriceLine(
        lineOptions(levels.support2, colors.support, "S2")
      ),
      candleSeriesRef.current.createPriceLine(
        lineOptions(levels.resistance1, colors.resistance, "R1")
      ),
      candleSeriesRef.current.createPriceLine(
        lineOptions(levels.resistance2, colors.resistance, "R2")
      ),
    ];

    supportResistanceLinesRef.current = newLines;
  };

  // Fetch S/R levels (dummy for now)
  const fetchSupportResistance = async (symbol) => {
    return {
      support1: 24700,
      support2: 24650,
      resistance1: 24800,
      resistance2: 24850,
    };
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#131722" },
        textColor: "#D1D4DC",
      },
      grid: {
        vertLines: { color: "#363c4e" },
        horzLines: { color: "#363c4e" },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#485c7b" },
      timeScale: {
        borderColor: "#485c7b",
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
    });

    // Use v5 syntax for adding candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Add crosshair move handler to update OHLC data
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(candleSeries);
        if (data) {
          setOhlcData({
            open: data.open?.toFixed(2) || 0,
            high: data.high?.toFixed(2) || 0,
            low: data.low?.toFixed(2) || 0,
            close: data.close?.toFixed(2) || 0,
            time: new Date(param.time * 1000).toLocaleString(),
          });
        }
      }
    });

    // Load symbols
    const loadSymbols = async () => {
      try {
        const response = await fetch("http://localhost:3000/symbol");
        const symbolsData = await response.json();
        dispatch(setSymbols(symbolsData));
        if (symbolsData.length > 0) {
          dispatch(setCurrentSymbol(symbolsData[0]));
        }
      } catch (error) {
        console.error("Failed to load symbols:", error);
      }
    };
    loadSymbols();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      evtSourceRef.current?.close();
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [dispatch]);

  // Fetch data and connect to SSE
  useEffect(() => {
    if (!currentSymbol?.sym_id || !candleSeriesRef.current) return;

    evtSourceRef.current?.close();

    const fetchHistoricalAndDraw = async () => {
      dispatch(setConnectionStatus("loading"));

      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 30);

      const params = new URLSearchParams({
        from: formatDate(fromDate),
        to: formatDate(toDate),
        interval: timeframe === "D" ? "1" : timeframe,
        type: timeframe === "D" ? "day" : "minute",
        instrument_token: currentSymbol.sym_id,
      });

      try {
        const url = `http://localhost:3000/data?${params.toString()}`;
        evtSourceRef.current = new EventSource(url);

        evtSourceRef.current.onopen = () => {
          console.log("SSE connection opened");
          dispatch(setConnectionStatus("connected"));
        };

        evtSourceRef.current.onerror = () => {
          console.log("SSE connection error");
          dispatch(setConnectionStatus("disconnected"));
        };

        evtSourceRef.current.onmessage = async (event) => {
          try {
            console.log("Raw SSE data received:", event.data);
            const obj = JSON.parse(event.data);
            console.log("Parsed SSE data:", obj);

            if (obj.status === "success" && obj.data?.candles) {
              console.log(
                "Processing candles, count:",
                obj.data.candles.length
              );

              // Format data according to your structure: [timestamp, open, high, low, close, volume1, volume2]
              const formattedData = obj.data.candles.map((candle, index) => {
                const [timestamp, open, high, low, close] = candle;

                const formatted = {
                  time: Math.floor(new Date(timestamp).getTime() / 1000),
                  open: parseFloat(open),
                  high: parseFloat(high),
                  low: parseFloat(low),
                  close: parseFloat(close),
                };

                // Log first few candles for debugging
                if (index < 3) {
                  console.log(`Candle ${index}:`, formatted);
                }

                return formatted;
              });

              console.log("Formatted data sample:", formattedData.slice(0, 3));
              console.log("Total formatted candles:", formattedData.length);

              // Update chart and Redux state
              if (candleSeriesRef.current && formattedData.length > 0) {
                console.log("Setting data on chart...");
                candleSeriesRef.current.setData(formattedData);
                console.log("Chart data set successfully");

                // Set initial OHLC data to the last candle
                const lastCandle = formattedData[formattedData.length - 1];
                setOhlcData({
                  open: lastCandle.open.toFixed(2),
                  high: lastCandle.high.toFixed(2),
                  low: lastCandle.low.toFixed(2),
                  close: lastCandle.close.toFixed(2),
                  time: new Date(lastCandle.time * 1000).toLocaleString(),
                });

                // Draw support/resistance lines
                const levels = await fetchSupportResistance(
                  currentSymbol.symbol
                );
                drawSupportResistanceLines(levels);
                console.log("Support/resistance lines drawn");

                // Update Redux state
                dispatch(setChartData(formattedData));
              } else {
                console.error("Candle series not available or no data");
              }
            } else {
              console.error("Invalid data structure:", obj);
            }
          } catch (error) {
            console.error("Error processing SSE data:", error);
          }
        };
      } catch (error) {
        console.error("Data loading failed:", error);
        dispatch(setConnectionStatus("error"));
      }
    };

    // Add a small delay to ensure chart is fully initialized
    setTimeout(fetchHistoricalAndDraw, 200);
  }, [currentSymbol, timeframe, dispatch]);

  return (
    <div className="h-screen bg-gray-900 text-white font-sans flex flex-col relative">
      {/* OHLC Display - Top Left Corner */}
      <div className="absolute top-16 left-4 z-10 bg-gray-800 bg-opacity-90 rounded-lg p-3 shadow-lg border border-gray-700">
        <div className="text-sm font-semibold text-gray-300 mb-2">
          {currentSymbol?.symbol || "Loading..."} -{" "}
          {timeframe === "D" ? "Daily" : `${timeframe}min`}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">O:</span>
            <span className="text-white font-mono">{ohlcData.open}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">H:</span>
            <span className="text-green-400 font-mono">{ohlcData.high}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">L:</span>
            <span className="text-red-400 font-mono">{ohlcData.low}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">C:</span>
            <span className="text-white font-mono">{ohlcData.close}</span>
          </div>
        </div>
        {ohlcData.time && (
          <div className="text-xs text-gray-500 mt-2 border-t border-gray-600 pt-1">
            {ohlcData.time}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-800 border-b border-gray-700 shadow-lg">
        <select
          className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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

        <div className="flex gap-1">
          {["", "2", "3", "5", "10", "15", "30", "60", "D"].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeframe === tf
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
              onClick={() => dispatch(setTimeframe(tf))}
            >
              {tf === "D"
                ? "Daily"
                : tf === "w"
                ? "Weekly"
                : tf === "H"
                ? "Hours"
                : tf === "m"
                ? "Monthly"
                : `${tf}min`}
            </button>
          ))}
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

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="w-full flex-grow bg-gray-900"
        style={{ minHeight: "600px" }}
      />
    </div>
  );
}

export default TradingChart;
