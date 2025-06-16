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

// Convert UTC timestamp to IST timestamp for chart display
const convertUTCToISTTimestamp = (utcTimestamp) => {
  // Add 5.5 hours (19800 seconds) to convert UTC to IST
  return utcTimestamp + 5.5 * 60 * 60;
};

// Format time for IST display
const formatTimeForIST = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

function TradingChart() {
  const dispatch = useDispatch();

  // Refs for chart elements
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const evtSourceRef = useRef(null);
  const supportResistanceLinesRef = useRef([]);

  // State for OHLC display and custom timeframe
  const [ohlcData, setOhlcData] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    time: "",
  });
  const [showCustomTimeframe, setShowCustomTimeframe] = useState(false);
  const [customInterval, setCustomInterval] = useState("");

  // Get state from Redux
  const { symbols, currentSymbol, timeframe, connectionStatus } = useSelector(
    (state) => state.chart
  );

  // Extended timeframe options
  const timeframes = [
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
  ];

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
      lineWidth: 2,
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

  // Initialize chart ONLY ONCE
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
      rightPriceScale: {
        borderColor: "#485c7b",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#485c7b",
        timeVisible: true,
        secondsVisible: false,
        rightBarStaysOnScroll: true,
        barSpacing: 12,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightOffset: 12,
        visible: true,
        // --- FIXED: Custom time formatter for IST display ---
        tickMarkFormatter: (time, tickMarkType, locale) => {
          // The time parameter is already in IST (converted before passing to chart)
          const date = new Date(time * 1000);

          // Format based on timeframe for IST
          if (timeframe === "D" || timeframe === "W" || timeframe === "M") {
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          } else {
            // For intraday timeframes, show IST time
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          }
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: window.innerHeight - 180,
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

    // Add crosshair move handler to update OHLC data with IST time
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(candleSeries);
        if (data) {
          setOhlcData({
            open: data.open?.toFixed(2) || 0,
            high: data.high?.toFixed(2) || 0,
            low: data.low?.toFixed(2) || 0,
            close: data.close?.toFixed(2) || 0,
            time: formatTimeForIST(param.time),
          });
        }
      }
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: window.innerHeight - 180,
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

  // Load symbols only once on component mount
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const response = await fetch("http://localhost:3000/symbol");
        const symbolsData = await response.json();
        dispatch(setSymbols(symbolsData));
        // Only set default symbol if no symbol is currently selected
        if (symbolsData.length > 0 && !currentSymbol) {
          dispatch(setCurrentSymbol(symbolsData[0]));
        }
      } catch (error) {
        console.error("Failed to load symbols:", error);
      }
    };

    // Only load symbols if they haven't been loaded yet
    if (symbols.length === 0) {
      loadSymbols();
    }
  }, [dispatch, symbols.length, currentSymbol]);

  // Update time scale formatter when timeframe changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        timeScale: {
          tickMarkFormatter: (time, tickMarkType, locale) => {
            const date = new Date(time * 1000);

            if (timeframe === "D" || timeframe === "W" || timeframe === "M") {
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            } else {
              return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
            }
          },
        },
      });
    }
  }, [timeframe]);

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
        interval:
          timeframe === "D"
            ? "1"
            : timeframe === "W"
            ? "W"
            : timeframe === "M"
            ? "M"
            : timeframe,
        type:
          timeframe === "D"
            ? "day"
            : timeframe === "W"
            ? "week"
            : timeframe === "M"
            ? "month"
            : "minute",
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
            const obj = JSON.parse(event.data);

            if (obj.status === "success" && obj.data?.candles) {
              console.log(
                "Processing candles, count:",
                obj.data.candles.length
              );

              // --- FIXED: Convert timestamps to IST before passing to chart ---
              const formattedData = obj.data.candles.map((candle) => {
                const [timestamp, open, high, low, close] = candle;

                // Convert UTC timestamp to IST timestamp
                const utcTimestamp = Math.floor(
                  new Date(timestamp).getTime() / 1000
                );
                const istTimestamp = convertUTCToISTTimestamp(utcTimestamp);

                return {
                  time: istTimestamp, // Now using IST timestamp
                  open: parseFloat(open),
                  high: parseFloat(high),
                  low: parseFloat(low),
                  close: parseFloat(close),
                };
              });

              console.log("Formatted data sample:", formattedData.slice(0, 3));

              // Update chart and Redux state
              if (candleSeriesRef.current && formattedData.length > 0) {
                candleSeriesRef.current.setData(formattedData);

                // Set initial OHLC data to the last candle
                const lastCandle = formattedData[formattedData.length - 1];
                setOhlcData({
                  open: lastCandle.open.toFixed(2),
                  high: lastCandle.high.toFixed(2),
                  low: lastCandle.low.toFixed(2),
                  close: lastCandle.close.toFixed(2),
                  time: formatTimeForIST(lastCandle.time),
                });

                // Draw support/resistance lines
                const levels = await fetchSupportResistance(
                  currentSymbol.symbol
                );
                drawSupportResistanceLines(levels);

                // Update Redux state
                dispatch(setChartData(formattedData));
              }
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

    setTimeout(fetchHistoricalAndDraw, 200);
  }, [currentSymbol, timeframe, dispatch]);

  // Handle custom timeframe submission
  const handleCustomTimeframe = () => {
    if (customInterval && parseInt(customInterval) > 0) {
      dispatch(setTimeframe(customInterval));
      setShowCustomTimeframe(false);
      setCustomInterval("");
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white font-sans flex flex-col relative">
      {/* OHLC Display - Top Left Corner */}
      <div className="absolute top-20 left-4 z-10 bg-gray-800 bg-opacity-90 rounded-lg p-3 shadow-lg border border-gray-700">
        <div className="text-sm font-semibold text-gray-300 mb-2">
          {currentSymbol?.symbol || "Loading..."} -{" "}
          {timeframes.find((tf) => tf.value === timeframe)?.label || timeframe}
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
            IST: {ohlcData.time}
          </div>
        )}
      </div>

      {/* Custom Timeframe Modal */}
      {showCustomTimeframe && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Custom Timeframe</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                placeholder="Enter minutes"
                value={customInterval}
                onChange={(e) => setCustomInterval(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400 self-center">minutes</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCustomTimeframe}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowCustomTimeframe(false);
                  setCustomInterval("");
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div className="flex flex-wrap gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeframe === tf.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
              onClick={() => dispatch(setTimeframe(tf.value))}
            >
              {tf.label}
            </button>
          ))}

          <button
            onClick={() => setShowCustomTimeframe(true)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
          >
            Custom
          </button>
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

      {/* Chart Container with adjusted height */}
      <div
        ref={chartContainerRef}
        className="w-full flex-grow bg-gray-900"
        style={{ height: `${window.innerHeight - 180}px` }}
      />
    </div>
  );
}

export default TradingChart;
