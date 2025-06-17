import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSymbols,
  setCurrentSymbol,
  setTimeframe,
  setChartData,
  setConnectionStatus,
  appendLiveCandle,
  setDaily,
  setWeekly,
} from "../../context/chartSlice";
import {
  createChart,
  LineStyle,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
} from "lightweight-charts";

// Optimized helper functions with memoization
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertUTCToISTTimestamp = (utcTimestamp) => {
  return utcTimestamp + 5.5 * 60 * 60;
};

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

// Support/Resistance computation function
const computeLevels = (oc, price, isCommodity) => {
  if (!oc || typeof oc !== "object") {
    return {
      support_1: null,
      support_2: null,
      support_1_1: null,
      support_2_1: null,
      resistance_1: null,
      resistance_2: null,
      resistance_1_1: null,
      resistance_2_1: null,
    };
  }

  const strikes = Object.keys(oc)
    .filter((k) => /^\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b);

  if (strikes.length === 0) {
    return {
      support_1: null,
      support_2: null,
      support_1_1: null,
      support_2_1: null,
      resistance_1: null,
      resistance_2: null,
      resistance_1_1: null,
      resistance_2_1: null,
    };
  }

  const below = strikes.filter((s) => s <= price);
  const above = strikes.filter((s) => s > price);

  const pick = (levels, selector) => {
    if (!levels.length) return null;
    const idx = selector(levels);
    if (idx < 0 || idx >= levels.length) return null;
    return oc[levels[idx]] || null;
  };

  return {
    support_1: pick(below, (l) => l.length - 1)?.reversal,
    support_2: pick(below, (l) =>
      isCommodity && l.length > 1 ? l.length - 1 : l.length - 1
    )?.wkly_reversal,
    support_1_1: pick(below, (l) => l.length - 2)?.reversal,
    support_2_1: pick(below, (l) =>
      isCommodity && l.length > 2 ? l.length - 2 : l.length - 2
    )?.wkly_reversal,

    resistance_1: pick(above, (l) => 0)?.reversal,
    resistance_2: pick(above, (l) => (isCommodity && l.length > 1 ? 0 : 0))
      ?.wkly_reversal,
    resistance_1_1: pick(above, (l) => 1)?.reversal,
    resistance_2_1: pick(above, (l) => (isCommodity && l.length > 2 ? 1 : 1))
      ?.wkly_reversal,
  };
};

// Debounce utility for performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for high-frequency events
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const TradingChart = React.memo(() => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  // Memoized theme colors
  const themeColors = useMemo(
    () => ({
      background: theme === "dark" ? "bg-gray-800" : "bg-teal-400",
      text: theme === "dark" ? "#e0e0e0" : "#333",
      gridColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      supportColor: theme === "dark" ? "#00b3ff" : "#1976d2",
      resistanceColor: theme === "dark" ? "#fbc02d" : "#f57c00",
    }),
    [theme]
  );

  // Optimized chart theme configuration
  const chartTheme = useMemo(
    () => ({
      layout: {
        background: { color: theme === "dark" ? "#131722" : "#ffffff" },
        textColor: theme === "dark" ? "#D1D4DC" : "#333333",
      },
      grid: {
        vertLines: { color: themeColors.gridColor },
        horzLines: { color: themeColors.gridColor },
      },
      crosshair: { mode: 0 },
      rightPriceScale: {
        borderColor: theme === "dark" ? "#485c7b" : "#cccccc",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: theme === "dark" ? "#485c7b" : "#cccccc",
        timeVisible: true,
        secondsVisible: false,
        rightBarStaysOnScroll: true,
        barSpacing: 12,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightOffset: 12,
        visible: true,
      },
    }),
    [theme, themeColors.gridColor]
  );

  // Candlestick theme
  const candlestickTheme = useMemo(
    () => ({
      upColor: theme === "dark" ? "#26a69a" : "#00c853",
      downColor: theme === "dark" ? "#ef5350" : "#f44336",
      borderVisible: false,
      wickUpColor: theme === "dark" ? "#26a69a" : "#00c853",
      wickDownColor: theme === "dark" ? "#ef5350" : "#f44336",
    }),
    [theme]
  );

  // Refs
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const evtSourceRef = useRef(null);
  const supportResistanceLinesRef = useRef(new Map());
  const lastSupportDataRef = useRef(null);

  // State
  const [ohlcData, setOhlcData] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    time: "",
  });
  const [showCustomTimeframe, setShowCustomTimeframe] = useState(false);
  const [customInterval, setCustomInterval] = useState("");
  const [livePrice, setLivePrice] = useState(null);

  // Redux state
  const { symbols, currentSymbol, timeframe, connectionStatus, daily, weekly } =
    useSelector((state) => state.chart);
  const { sid, exp_sid } = useSelector((state) => state.data);

  // Get options data from store for support/resistance calculation
  const optionsData = useSelector((state) => state.data?.data?.options?.data);
  const oc = optionsData?.oc;
  const price = optionsData?.sltp;
  const isCommodity = sid === "CRUDEOIL";

  // Timeframe options
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

  // Compute support/resistance levels using local function
  const supportResistanceLevels = useMemo(() => {
    if (!oc || !price) {
      console.log("Missing data for support/resistance calculation:", {
        oc: !!oc,
        price,
      });
      return null;
    }

    const levels = computeLevels(oc, price, isCommodity);
    console.log("Computed support/resistance levels:", levels);
    return levels;
  }, [oc, price, isCommodity]);

  // Optimized support/resistance line drawing with proper cleanup
  const drawSupportResistanceLines = useCallback(
    (levels) => {
      if (!candleSeriesRef.current || !levels) {
        console.log("Cannot draw lines: missing candleSeries or levels");
        return;
      }

      console.log("Drawing support/resistance lines:", {
        daily,
        weekly,
        levels,
      });

      // Clear existing lines efficiently
      supportResistanceLinesRef.current.forEach((line, key) => {
        try {
          candleSeriesRef.current.removePriceLine(line);
        } catch (error) {
          console.warn(`Error removing price line ${key}:`, error);
        }
      });
      supportResistanceLinesRef.current.clear();

      const lineConfigs = [];

      // Add daily lines if enabled
      if (daily) {
        const dailyLines = [
          { key: "support_1", title: "S1", color: themeColors.supportColor },
          {
            key: "support_1_1",
            title: "S1.1",
            color: themeColors.supportColor,
          },
          {
            key: "resistance_1",
            title: "R1",
            color: themeColors.resistanceColor,
          },
          {
            key: "resistance_1_1",
            title: "R1.1",
            color: themeColors.resistanceColor,
          },
        ];
        lineConfigs.push(...dailyLines);
      }

      // Add weekly lines if enabled
      if (weekly) {
        const weeklyLines = [
          { key: "support_2", title: "S2", color: themeColors.supportColor },
          {
            key: "support_2_1",
            title: "S2.1",
            color: themeColors.supportColor,
          },
          {
            key: "resistance_2",
            title: "R2",
            color: themeColors.resistanceColor,
          },
          {
            key: "resistance_2_1",
            title: "R2.1",
            color: themeColors.resistanceColor,
          },
        ];
        lineConfigs.push(...weeklyLines);
      }

      // Create lines with validation
      let createdCount = 0;
      lineConfigs.forEach((config) => {
        const priceValue = levels[config.key];
        if (priceValue && !isNaN(parseFloat(priceValue))) {
          try {
            const line = candleSeriesRef.current.createPriceLine({
              price: parseFloat(priceValue),
              color: config.color,
              lineWidth: 2,
              lineStyle: LineStyle.Dashed,
              axisLabelVisible: true,
              title: config.title,
            });
            supportResistanceLinesRef.current.set(config.key, line);
            createdCount++;
          } catch (error) {
            console.error(
              `Error creating price line for ${config.key}:`,
              error
            );
          }
        } else {
          console.warn(`Invalid price for ${config.key}:`, priceValue);
        }
      });

      console.log(
        `Successfully created ${createdCount} support/resistance lines`
      );
    },
    [
      theme,
      daily,
      weekly,
      themeColors.supportColor,
      themeColors.resistanceColor,
    ]
  );

  // Optimized chart theme updates
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions(chartTheme);
    }
    if (candleSeriesRef.current) {
      candleSeriesRef.current.applyOptions(candlestickTheme);
    }
  }, [chartTheme, candlestickTheme]);

  // Re-draw support/resistance lines when levels or selection changes
  useEffect(() => {
    console.log("Support/resistance data changed:", {
      daily,
      weekly,
      hasLevels: !!supportResistanceLevels,
    });

    if (supportResistanceLevels) {
      const currentLevelsString = JSON.stringify(supportResistanceLevels);
      const lastLevelsString = JSON.stringify(lastSupportDataRef.current);

      if (
        currentLevelsString !== lastLevelsString ||
        lastSupportDataRef.current === null
      ) {
        console.log("Levels changed, updating lines");
        lastSupportDataRef.current = supportResistanceLevels;
        drawSupportResistanceLines(supportResistanceLevels);
      }
    }
  }, [supportResistanceLevels, daily, weekly, drawSupportResistanceLines]);

  // FIXED: Optimized chart initialization with v5 syntax
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    try {
      console.log("🎯 Initializing chart...");

      const chart = createChart(chartContainerRef.current, {
        ...chartTheme,
        width: chartContainerRef.current.clientWidth,
        height: window.innerHeight - 180,
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      // FIXED: Use new v5 syntax for adding candlestick series
      const candleSeries = chart.addSeries(CandlestickSeries, candlestickTheme);

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;

      // Throttled crosshair move handler
      const throttledCrosshairMove = throttle((param) => {
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
      }, 16); // ~60fps

      chart.subscribeCrosshairMove(throttledCrosshairMove);

      // Debounced resize handler
      const debouncedResize = debounce(() => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: window.innerHeight - 180,
          });
        }
      }, 100);

      window.addEventListener("resize", debouncedResize);

      console.log("✅ Chart initialized successfully");

      return () => {
        console.log("🧹 Cleaning up chart...");
        window.removeEventListener("resize", debouncedResize);

        // Cleanup connections
        if (evtSourceRef.current) {
          evtSourceRef.current.close();
          evtSourceRef.current = null;
        }

        // Cleanup chart
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          candleSeriesRef.current = null;
        }

        // Clear support/resistance lines
        supportResistanceLinesRef.current.clear();
      };
    } catch (error) {
      console.error("❌ Error initializing chart:", error);
      dispatch(setConnectionStatus("error"));
    }
  }, []); // Empty dependency array for initialization

  // Optimized symbols loading
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

  // Optimized data fetching
  useEffect(() => {
    if (!currentSymbol?.sym_id || !candleSeriesRef.current) return;

    console.log("🔄 Symbol or timeframe changed, fetching new data...");

    // Cleanup existing connections
    if (evtSourceRef.current) {
      evtSourceRef.current.close();
      evtSourceRef.current = null;
    }

    const fetchHistoricalData = async () => {
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
          console.log("📡 SSE connection opened");
        };

        evtSourceRef.current.onerror = (error) => {
          console.log("❌ SSE connection error:", error);
          dispatch(setConnectionStatus("error"));
        };

        evtSourceRef.current.onmessage = async (event) => {
          try {
            const obj = JSON.parse(event.data);

            if (obj.status === "success" && obj.data?.candles) {
              console.log(
                "📊 Processing candles, count:",
                obj.data.candles.length
              );

              // Optimized batch processing
              const formattedData = obj.data.candles.map((candle) => {
                const [timestamp, open, high, low, close] = candle;
                const utcTimestamp = Math.floor(
                  new Date(timestamp).getTime() / 1000
                );
                const istTimestamp = convertUTCToISTTimestamp(utcTimestamp);

                return {
                  time: istTimestamp,
                  open: parseFloat(open),
                  high: parseFloat(high),
                  low: parseFloat(low),
                  close: parseFloat(close),
                };
              });

              if (candleSeriesRef.current && formattedData.length > 0) {
                candleSeriesRef.current.setData(formattedData);

                const lastCandle = formattedData[formattedData.length - 1];
                setOhlcData({
                  open: lastCandle.open.toFixed(2),
                  high: lastCandle.high.toFixed(2),
                  low: lastCandle.low.toFixed(2),
                  close: lastCandle.close.toFixed(2),
                  time: formatTimeForIST(lastCandle.time),
                });

                // Update live price from last candle
                setLivePrice(lastCandle.close);

                dispatch(setChartData(formattedData));
                dispatch(setConnectionStatus("connected"));

                console.log("📈 Historical data loaded successfully");
              }
            }
          } catch (error) {
            console.error("❌ Error processing SSE data:", error);
          }
        };
      } catch (error) {
        console.error("❌ Data loading failed:", error);
        dispatch(setConnectionStatus("error"));
      }
    };

    // Reduced timeout for faster response
    const timeoutId = setTimeout(fetchHistoricalData, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentSymbol?.sym_id, timeframe, dispatch]);

  // Custom timeframe handler
  const handleCustomTimeframe = useCallback(() => {
    if (customInterval && parseInt(customInterval) > 0) {
      dispatch(setTimeframe(customInterval));
      setShowCustomTimeframe(false);
      setCustomInterval("");
    }
  }, [customInterval, dispatch]);

  // Memoized theme classes
  const themeClasses = useMemo(
    () => ({
      container:
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
      ohlcBox:
        theme === "dark"
          ? "bg-gray-800 bg-opacity-90 border-gray-700"
          : "bg-white bg-opacity-90 border-gray-300 shadow-lg",
      toolbar:
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-100 border-gray-300",
      select:
        theme === "dark"
          ? "bg-gray-700 text-white border-gray-600"
          : "bg-white text-gray-900 border-gray-300",
      button:
        theme === "dark"
          ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900",
      activeButton:
        theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
      modal:
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300",
      input:
        theme === "dark"
          ? "bg-gray-700 text-white border-gray-600"
          : "bg-white text-gray-900 border-gray-300",
      chart: theme === "dark" ? "bg-gray-900" : "bg-white",
    }),
    [theme]
  );

  return (
    <div
      className={`h-screen font-sans flex flex-col relative ${themeClasses.container}`}
    >
      {/* OHLC Display */}
      <div
        className={`absolute top-20 left-4 z-10 rounded-lg p-3 shadow-lg border ${themeClasses.ohlcBox}`}
      >
        <div
          className={`text-sm font-semibold mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {currentSymbol?.symbol || "Loading..."} -{" "}
          {timeframes.find((tf) => tf.value === timeframe)?.label || timeframe}
          {livePrice && (
            <span
              className={`ml-2 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Live: {livePrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              O:
            </span>
            <span
              className={`font-mono ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {ohlcData.open}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              H:
            </span>
            <span
              className={`font-mono ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              {ohlcData.high}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              L:
            </span>
            <span
              className={`font-mono ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {ohlcData.low}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
            >
              C:
            </span>
            <span
              className={`font-mono ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {ohlcData.close}
            </span>
          </div>
        </div>
        {ohlcData.time && (
          <div
            className={`text-xs mt-2 border-t pt-1 ${
              theme === "dark"
                ? "text-gray-500 border-gray-600"
                : "text-gray-500 border-gray-300"
            }`}
          >
            IST: {ohlcData.time}
          </div>
        )}

        {/* Support/Resistance Info */}
        {supportResistanceLevels && (daily || weekly) && (
          <div
            className={`text-xs mt-2 border-t pt-1 ${
              theme === "dark"
                ? "text-gray-500 border-gray-600"
                : "text-gray-500 border-gray-300"
            }`}
          >
            <div className="text-xs font-medium mb-1">S/R Levels:</div>
            <div className="grid grid-cols-2 gap-x-2 text-xs">
              {daily && (
                <>
                  {supportResistanceLevels.support_1 && (
                    <div
                      className={`text-${
                        theme === "dark" ? "blue-400" : "blue-600"
                      }`}
                    >
                      S1:{" "}
                      {parseFloat(supportResistanceLevels.support_1).toFixed(2)}
                    </div>
                  )}
                  {supportResistanceLevels.resistance_1 && (
                    <div
                      className={`text-${
                        theme === "dark" ? "yellow-400" : "orange-600"
                      }`}
                    >
                      R1:{" "}
                      {parseFloat(supportResistanceLevels.resistance_1).toFixed(
                        2
                      )}
                    </div>
                  )}
                </>
              )}
              {weekly && (
                <>
                  {supportResistanceLevels.support_2 && (
                    <div
                      className={`text-${
                        theme === "dark" ? "blue-400" : "blue-600"
                      }`}
                    >
                      S2:{" "}
                      {parseFloat(supportResistanceLevels.support_2).toFixed(2)}
                    </div>
                  )}
                  {supportResistanceLevels.resistance_2 && (
                    <div
                      className={`text-${
                        theme === "dark" ? "yellow-400" : "orange-600"
                      }`}
                    >
                      R2:{" "}
                      {parseFloat(supportResistanceLevels.resistance_2).toFixed(
                        2
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Timeframe Modal */}
      {showCustomTimeframe && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className={`p-6 rounded-lg border ${themeClasses.modal}`}>
            <h3 className="text-lg font-semibold mb-4">Custom Timeframe</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                placeholder="Enter minutes"
                value={customInterval}
                onChange={(e) => setCustomInterval(e.target.value)}
                className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
              />
              <span
                className={`self-center ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                minutes
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCustomTimeframe}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowCustomTimeframe(false);
                  setCustomInterval("");
                }}
                className={`px-4 py-2 rounded transition-colors ${
                  theme === "dark"
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        className={`flex flex-wrap gap-2 p-3 border-b shadow-lg ${themeClasses.toolbar}`}
      >
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
                timeframe === tf.value
                  ? themeClasses.activeButton
                  : themeClasses.button
              }`}
              onClick={() => dispatch(setTimeframe(tf.value))}
            >
              {tf.label}
            </button>
          ))}

          <button
            onClick={() => setShowCustomTimeframe(true)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${themeClasses.button}`}
          >
            Custom
          </button>
        </div>

        {/* Support/Resistance Toggle Controls */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Daily ({daily ? "ON" : "OFF"})
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={daily}
                onChange={(e) => {
                  console.log("Daily toggle changed:", e.target.checked);
                  dispatch(setDaily(e.target.checked));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 transition duration-300"></div>
              <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Weekly ({weekly ? "ON" : "OFF"})
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={weekly}
                onChange={(e) => {
                  console.log("Weekly toggle changed:", e.target.checked);
                  dispatch(setWeekly(e.target.checked));
                }}
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

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className={`w-full flex-grow ${themeClasses.chart}`}
        style={{ height: `${window.innerHeight - 180}px` }}
      />
    </div>
  );
});

TradingChart.displayName = "TradingChart";

export default TradingChart;
