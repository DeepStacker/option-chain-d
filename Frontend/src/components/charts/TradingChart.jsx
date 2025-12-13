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
  setDaily,
  setWeekly,
  setAvg,
} from "../../context/chartSlice";
import {
  createChart,
  CandlestickSeries,
  LineStyle,
} from "lightweight-charts";
import {
  formatDate,
  convertUTCToISTTimestamp,
  formatTimeForIST,
  computeLevels,
  debounce,
  throttle,
} from "../../utils/chartUtils";

const TradingChart = React.memo(({ embedded = false }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  // Memoized theme colors - Premium Emerald/Rose Palette
  const themeColors = useMemo(
    () => ({
      background: theme === "dark" ? "bg-slate-900" : "bg-white",
      text: theme === "dark" ? "#e2e8f0" : "#334155",
      gridColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
      supportColor: theme === "dark" ? "#38bdf8" : "#0ea5e9", // Sky-400 v 500
      resistanceColor: theme === "dark" ? "#fbbf24" : "#f59e0b", // Amber-400 v 500
      nearersupportColor: theme === "dark" ? "#4ade80" : "#22c55e", // Green-400 v 500
      nearerresistanceColor: theme === "dark" ? "#f87171" : "#ef4444", // Red-400 v 500
    }),
    [theme]
  );

  // Chart theme configuration
  const chartTheme = useMemo(
    () => ({
      layout: {
        background: { color: theme === "dark" ? "#0f172a" : "#ffffff" },
        textColor: theme === "dark" ? "#94a3b8" : "#475569",
      },
      grid: {
        vertLines: { color: themeColors.gridColor },
        horzLines: { color: themeColors.gridColor },
      },
      crosshair: { mode: 1 },
      rightPriceScale: {
        borderColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
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

  // Candlestick theme - Emerald/Rose
  const candlestickTheme = useMemo(
    () => ({
      upColor: "#10b981", // Emerald-500
      downColor: "#f43f5e", // Rose-500
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    }),
    [theme]
  );

  // Refs
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const supportResistanceLinesRef = useRef(new Map());
  const canvasRef = useRef(null);

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null); // 'hline'
  const [userLines, setUserLines] = useState([]);
  const [activeProfile, setActiveProfile] = useState("none");

  // Redux state
  const { symbols, currentSymbol, timeframe, connectionStatus, daily, weekly, avg } =
    useSelector((state) => state.chart);
  const { sid } = useSelector((state) => state.data);

  // Get options data
  const optionsData = useSelector((state) => state.data?.data?.options?.data);
  const oc = optionsData?.oc;
  const price = ohlcData?.close;
  const isCommodity = sid === "CRUDEOIL";

  // Timeframe options - includes 15S (15 seconds) and all minute intervals
  const timeframes = useMemo(
    () => [
      { value: "15S", label: "15s" },
      { value: "1", label: "1min" },
      { value: "2", label: "2min" },
      { value: "3", label: "3min" },
      { value: "5", label: "5min" },
      { value: "10", label: "10min" },
      { value: "15", label: "15min" },
      { value: "30", label: "30min" },
      { value: "60", label: "1H" },
      { value: "D", label: "Daily" },
    ],
    []
  );

  // Compute support/resistance levels
  const supportResistanceLevels = useMemo(() => {
    if (!oc || !price) return null;
    return computeLevels(oc, price, isCommodity);
  }, [oc, price, isCommodity]);

  // Enhanced support/resistance line drawing
  const drawSupportResistanceLines = useCallback(
    (levels) => {
      if (!candleSeriesRef.current || !levels) return;

      supportResistanceLinesRef.current.forEach((line) => {
        try {
          candleSeriesRef.current.removePriceLine(line);
        } catch (error) {
          console.warn("Error removing price line:", error);
        }
      });
      supportResistanceLinesRef.current.clear();

      const getLineConfigs = (daily, weekly, avg, themeColors) => {
        const dailyLines = [
          { key: "support_1", title: "S1", color: themeColors.nearersupportColor },
          { key: "support_1_1", title: "S1.1", color: themeColors.supportColor },
          { key: "support_1_2", title: "S1.2", color: themeColors.supportColor },
          { key: "resistance_1", title: "R1", color: themeColors.nearerresistanceColor },
          { key: "resistance_1_1", title: "R1.1", color: themeColors.resistanceColor },
          { key: "resistance_1_2", title: "R1.2", color: themeColors.resistanceColor },
        ];
        const weeklyLines = [
          { key: "support_2", title: "S2", color: themeColors.nearersupportColor },
          { key: "support_2_1", title: "S2.1", color: themeColors.supportColor },
          { key: "support_2_2", title: "S2.2", color: themeColors.supportColor },
          { key: "resistance_2", title: "R2", color: themeColors.nearerresistanceColor },
          { key: "resistance_2_1", title: "R2.1", color: themeColors.resistanceColor },
          { key: "resistance_2_2", title: "R2.2", color: themeColors.resistanceColor },
        ];
        // Reuse structure for Avg if needed, or define separately
        const avgLines = weeklyLines.map(l => ({ ...l, title: l.title + " (Avg)" })); // Simplified for now
        
        return [...(daily ? dailyLines : []), ...(weekly ? weeklyLines : []), ...(avg ? avgLines : [])];
      };

      const lineConfigs = getLineConfigs(daily, weekly, avg, themeColors);

      lineConfigs.forEach((config) => {
        const priceValue = levels[config.key];
        if (priceValue !== null && priceValue !== undefined && !isNaN(parseFloat(priceValue))) {
          try {
            const isSupport = config.key.includes("support");
            const isMajor = ["support_1", "support_2", "resistance_1", "resistance_2"].includes(config.key);
            
            const line = candleSeriesRef.current.createPriceLine({
              price: parseFloat(priceValue),
              color: config.color,
              lineWidth: 2,
              lineStyle: isMajor ? LineStyle.Solid : LineStyle.Dashed,
              axisLabelVisible: true,
              axisLabelBackgroundColor: isSupport ? "#002B36" : "#360000",
              axisLabelTextColor: "#FFFFFF",
              axisLabelBorderColor: config.color,
              title: config.title,
            });

            supportResistanceLinesRef.current.set(config.key, line);
          } catch (error) {
            console.error("Error creating price line:", error);
          }
        }
      });
    },
    [daily, weekly, avg, themeColors]
  );

  // Chart theme updates
  useEffect(() => {
    if (chartRef.current) chartRef.current.applyOptions(chartTheme);
    if (candleSeriesRef.current) candleSeriesRef.current.applyOptions(candlestickTheme);
  }, [chartTheme, candlestickTheme]);

  // Redraw lines on toggle or level change
  useEffect(() => {
    if (supportResistanceLevels && candleSeriesRef.current && connectionStatus === "connected") {
      drawSupportResistanceLines(supportResistanceLevels);
    }
  }, [daily, weekly, avg, supportResistanceLevels, connectionStatus, drawSupportResistanceLines]);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    try {
      const chart = createChart(chartContainerRef.current, {
        ...chartTheme,
        width: chartContainerRef.current.clientWidth,
        height: window.innerHeight - 180,
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
        handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
        timeScale: { ...chartTheme.timeScale },
        localization: {
          timeFormatter: (time) => {
            const date = new Date(time * 1000);
            return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
          },
          dateFormatter: (time) => {
            const date = new Date(time * 1000);
            return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' });
          },
        },
      });

      const candleSeries = chart.addSeries(CandlestickSeries, candlestickTheme);
      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;

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
      }, 16);

      chart.subscribeCrosshairMove(throttledCrosshairMove);

      // ResizeObserver for Chart Instance (Responsive to container)
      const chartResizeObserver = new ResizeObserver((entries) => {
        if (entries.length === 0 || !entries[0].target) return;
        const newRect = entries[0].contentRect;
        chart.applyOptions({
          width: newRect.width,
          height: newRect.height,
        });
      });
      
      chartResizeObserver.observe(chartContainerRef.current);

      return () => {
        chartResizeObserver.disconnect();
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          candleSeriesRef.current = null;
        }
        supportResistanceLinesRef.current.clear();
      };
    } catch (error) {
      console.error("Error initializing chart:", error);
      dispatch(setConnectionStatus("error"));
    }
  }, []);

  // Load symbols
  const loadSymbols = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/charts/symbols");
      const result = await response.json();
      const symbolsList = result.data || [];
      dispatch(setSymbols(symbolsList));
      if (symbolsList.length > 0 && !currentSymbol) dispatch(setCurrentSymbol(symbolsList[0]));
    } catch (error) {
       // fallback
       const defaultSymbols = [{ symbol: "NIFTY", name: "NIFTY 50" }];
       dispatch(setSymbols(defaultSymbols));
       if (!currentSymbol) dispatch(setCurrentSymbol(defaultSymbols[0]));
    }
  }, [dispatch, currentSymbol]);

  useEffect(() => {
    if (symbols.length === 0) loadSymbols();
  }, [symbols.length, loadSymbols]);

  // Fetch chart data
  const chartSymbol = sid || currentSymbol?.symbol || "NIFTY";
  useEffect(() => {
    if (!chartSymbol || !candleSeriesRef.current) return;
    const fetchChartData = async () => {
      dispatch(setConnectionStatus("loading"));
      try {
        const params = new URLSearchParams({ symbol: chartSymbol, interval: timeframe, days: "30" });
        const response = await fetch(`http://localhost:8000/api/v1/charts/data?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.candles?.length > 0) {
          const formattedData = data.candles.map((candle) => ({
            time: candle.time, open: candle.open, high: candle.high, low: candle.low, close: candle.close,
          })).sort((a, b) => a.time - b.time);

          if (candleSeriesRef.current && formattedData.length > 0) {
            candleSeriesRef.current.setData(formattedData);
            const lastCandle = formattedData[formattedData.length - 1];
            setOhlcData({
              open: lastCandle.open.toFixed(2), high: lastCandle.high.toFixed(2),
              low: lastCandle.low.toFixed(2), close: lastCandle.close.toFixed(2),
              time: formatTimeForIST(lastCandle.time),
            });
            setLivePrice(lastCandle.close);
            dispatch(setChartData(formattedData));
            dispatch(setConnectionStatus("connected"));
          }
        } else {
          dispatch(setConnectionStatus("error"));
        }
      } catch (error) {
        dispatch(setConnectionStatus("error"));
      }
    };
    fetchChartData();
    const intervalId = setInterval(fetchChartData, 30000);
    return () => clearInterval(intervalId);
  }, [chartSymbol, timeframe, dispatch]);

  // Toggle handlers
  const handleDailyToggle = useCallback((checked) => dispatch(setDaily(checked)), [dispatch]);
  const handleWeeklyToggle = useCallback((checked) => dispatch(setWeekly(checked)), [dispatch]);
  const handleAvgToggle = useCallback((checked) => dispatch(setAvg(checked)), [dispatch]);

  const handleCustomTimeframe = useCallback(() => {
    if (customInterval && parseInt(customInterval) > 0) {
      dispatch(setTimeframe(customInterval));
      setShowCustomTimeframe(false);
      setCustomInterval("");
    }
  }, [customInterval, dispatch]);

  // Theme classes
  const themeClasses = useMemo(() => ({
      container: theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
      toolbar: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300",
      select: theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300",
      button: theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900",
      activeButton: theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
      modal: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300",
      input: theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300",
      chart: theme === "dark" ? "bg-gray-900" : "bg-white",
  }), [theme]);

  // --- DRAWING & PROFILE HOOKS ---

  // Canvas Overlay Logic (Profiles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartRef.current || !candleSeriesRef.current || activeProfile === 'none' || !oc) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    const chart = chartRef.current;
    const series = candleSeriesRef.current;

    const draw = () => {
      if (!canvas || !series) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
         canvas.width = rect.width * dpr;
         canvas.height = rect.height * dpr;
         ctx.scale(dpr, dpr);
         canvas.style.width = `${rect.width}px`;
         canvas.style.height = `${rect.height}px`;
      }
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Right Padding to prevent covering Price Scale (approx 65px)
      // Ideally we'd get this from chart.priceScale('right').width(), but hardcoding is safer for now
      const rightPadding = 65;
      const startX = rect.width - rightPadding;

      // 1. Data Aggregation for Advanced Metrics (POC, VA)
      const strikes = Object.keys(oc);
      let dataPoints = [];
      let totalSum = 0;
      let maxVal = 0;
      let pocStrike = null;
      let maxTotalVal = 0;

      strikes.forEach((strikeStr) => {
        const s = oc[strikeStr];
        let ceVal = 0, peVal = 0;
        let total = 0;

        if (activeProfile === 'oi') {
            ceVal = s.ce?.OI || s.ce?.oi || 0;
            peVal = s.pe?.OI || s.pe?.oi || 0;
            total = ceVal + peVal;
        } else if (activeProfile === 'volume') {
            ceVal = s.ce?.volume || s.ce?.vol || 0;
            peVal = s.pe?.volume || s.pe?.vol || 0;
            total = ceVal + peVal;
        } else if (activeProfile === 'oi_change') {
            ceVal = s.ce?.oichng || 0;
            peVal = s.pe?.oichng || 0;
            total = Math.abs(ceVal) + Math.abs(peVal);
        } else if (activeProfile === 'delta') {
            ceVal = Math.abs(s.ce?.optgeeks?.delta || 0);
            peVal = Math.abs(s.pe?.optgeeks?.delta || 0);
            total = ceVal + peVal;
        } else if (activeProfile === 'gamma') {
            ceVal = s.ce?.optgeeks?.gamma || 0;
            peVal = s.pe?.optgeeks?.gamma || 0;
            total = ceVal + peVal;
        }

        const maxSideVal = Math.max(Math.abs(ceVal), Math.abs(peVal));
        maxVal = Math.max(maxVal, maxSideVal);
        
        // Accumulate for VA/POC
        totalSum += total;
        if (total > maxTotalVal) {
            maxTotalVal = total;
            pocStrike = strikeStr;
        }

        dataPoints.push({
            strike: strikeStr,
            total,
            ceVal,
            peVal
        });
      });

      if (maxVal === 0) return;

      // 2. Value Area Calculation (70% of volume)
      // Sort by total value descending
      const sortedByVal = [...dataPoints].sort((a, b) => b.total - a.total);
      const vaThreshold = totalSum * 0.70;
      let currentSum = 0;
      const vaStrikes = new Set();
      
      for (const p of sortedByVal) {
          currentSum += p.total;
          vaStrikes.add(p.strike);
          if (currentSum >= vaThreshold) break;
      }

      const maxBarWidth = (rect.width - rightPadding) * 0.35; // Allow wider bars now that we have padding

      // 3. Draw
      dataPoints.forEach((p) => {
        const strike = parseFloat(p.strike);
        const y = series.priceToCoordinate(strike);
        
        if (y === null) return;

        const isVA = vaStrikes.has(p.strike);
        const isPOC = p.strike === pocStrike;
        
        // Base Opacity
        // VA = 0.5, Outside VA = 0.15 (Ghost)
        const opacity = isVA ? 0.5 : 0.15;
        const lineOpacity = isVA ? 0.8 : 0.3;

        const emeraldBase = '16, 185, 129';
        const roseBase = '244, 63, 94';
        const pocColor = '#FACC15'; // Yellow-400

        const barHeight = 6; // slightly thicker

        // CE Bar (Calls/Resistance) - Grows Left from StartX
        const ceWidth = (Math.abs(p.ceVal) / maxVal) * maxBarWidth;
        
        // Fill
        if (activeProfile === 'oi_change' && p.ceVal < 0) {
             // Unwinding - Hollow
             ctx.fillStyle = `rgba(${emeraldBase}, ${opacity * 0.3})`; 
             ctx.strokeStyle = `rgba(${emeraldBase}, ${lineOpacity})`;
             ctx.lineWidth = 1;
             ctx.strokeRect(startX - ceWidth, y - barHeight, ceWidth, barHeight);
        } else {
             ctx.fillStyle = `rgba(${emeraldBase}, ${opacity})`;
             ctx.fillRect(startX - ceWidth, y - barHeight, ceWidth, barHeight);
        }
        
        // PE Bar (Puts/Support) - Grows Left from StartX (stacked below CE? or same line?)
        // Standard: Stacked vertically around the strike line. CE above, PE below.
        const peWidth = (Math.abs(p.peVal) / maxVal) * maxBarWidth;
        
        if (activeProfile === 'oi_change' && p.peVal < 0) {
             ctx.fillStyle = `rgba(${roseBase}, ${opacity * 0.3})`;
             ctx.strokeStyle = `rgba(${roseBase}, ${lineOpacity})`;
             ctx.lineWidth = 1;
             ctx.strokeRect(startX - peWidth, y, peWidth, barHeight);
        } else {
             ctx.fillStyle = `rgba(${roseBase}, ${opacity})`;
             ctx.fillRect(startX - peWidth, y, peWidth, barHeight);
        }

        // POC Highlight
        if (isPOC) {
            ctx.strokeStyle = pocColor;
            ctx.lineWidth = 2;
            const pocWidth = Math.max(ceWidth, peWidth) + 5;
            // Draw a bracket or box around the POC node
            // Let's draw a border around BOTH bars
            ctx.strokeRect(startX - ceWidth, y - barHeight, ceWidth, barHeight); // CE
            ctx.strokeRect(startX - peWidth, y, peWidth, barHeight); // PE
            
            // Optional: POC Line extending to price?
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + 10, y);
            ctx.stroke();
        }
      });
    };

    const timeScale = chart.timeScale();
    const handleResize = () => requestAnimationFrame(draw);
    timeScale.subscribeVisibleLogicalRangeChange(handleResize);
    
    // ResizeObserver for Canvas Overlay
    const resizeObserver = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        requestAnimationFrame(draw);
    });
    if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }

    requestAnimationFrame(draw);
    
    return () => {
        timeScale.unsubscribeVisibleLogicalRangeChange(handleResize);
        resizeObserver.disconnect();
    };
  }, [activeProfile, oc, chartRef.current, candleSeriesRef.current]);

  // Drawing Tool Logic
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;
    const chart = chartRef.current;
    
    const handleClick = (param) => {
        if (drawingMode !== 'hline' || !param.point) return;
        const series = candleSeriesRef.current; // access ref again or closure? Closure is fine but series ref is safer
        const price = series.coordinateToPrice(param.point.y);
        
        if (price !== null) {
            const line = series.createPriceLine({
                price: price,
                color: theme === 'dark' ? '#60a5fa' : '#2563eb',
                lineWidth: 2,
                lineStyle: LineStyle.Solid,
                axisLabelVisible: true,
                title: 'Level',
                draggable: true,
            });
            setUserLines(prev => [...prev, line]);
        }
    };
    chart.subscribeClick(handleClick);
    return () => { chart.unsubscribeClick(handleClick); };
  }, [drawingMode, theme, chartRef.current, candleSeriesRef.current]);

  return (
    <div className={`${embedded ? 'h-full' : 'h-screen'} font-sans flex flex-col relative ${themeClasses.container} ${isFullscreen ? 'fixed inset-0 z-50 bg-inherit' : ''}`}> 
      {/* OHLC Display */}
      <div className={`absolute ${embedded ? 'top-12' : 'top-20'} left-4 z-10 px-3 py-1 rounded-md shadow-sm border text-xs flex flex-wrap items-center gap-x-3 gap-y-1 ${
          theme === "dark" ? "bg-gray-800/90 border-gray-700 text-gray-300" : "bg-white/90 border-gray-200 text-gray-700"
        }`}>
        <span className="font-semibold">{currentSymbol?.symbol || "Loading..."} ({timeframes.find((tf) => tf.value === timeframe)?.label || timeframe})</span>
        {livePrice && <span className={`font-semibold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{livePrice.toFixed(2)}</span>}
        <span>O: <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{ohlcData.open}</span></span>
        <span>H: <span className={theme === "dark" ? "text-green-400" : "text-green-600"}>{ohlcData.high}</span></span>
        <span>L: <span className={theme === "dark" ? "text-red-400" : "text-red-600"}>{ohlcData.low}</span></span>
        <span>C: <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{ohlcData.close}</span></span>
        {ohlcData.time && <span className="text-[10px] opacity-70 ml-1">({ohlcData.time} IST)</span>}
      </div>

      {/* Custom Timeframe Modal: Code skipped for brevity, keeping existing structure */}
      {showCustomTimeframe && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className={`p-6 rounded-lg border ${themeClasses.modal}`}>
            <h3 className="text-lg font-semibold mb-4">Custom Timeframe</h3>
            <div className="flex gap-2 mb-4">
              <input type="number" placeholder="Enter minutes" value={customInterval} onChange={(e) => setCustomInterval(e.target.value)}
                className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`} />
              <span className={`self-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>minutes</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCustomTimeframe} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Apply</button>
              <button onClick={() => { setShowCustomTimeframe(false); setCustomInterval(""); }} className={`px-4 py-2 rounded transition-colors ${theme === "dark" ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className={`flex flex-wrap gap-1 ${embedded ? 'p-1.5' : 'p-3'} border-b shadow-lg ${themeClasses.toolbar}`}>
        {/* ... Toolbar content same as before ... */}
        {!embedded && (
          <select className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${themeClasses.select}`}
            value={currentSymbol?.symbol || ""} onChange={(e) => { const newSymbol = symbols.find((s) => s.symbol === e.target.value); if (newSymbol) dispatch(setCurrentSymbol(newSymbol)); }}>
            <option value="">Select Symbol</option>
            {symbols.map((s) => <option key={s.symbol} value={s.symbol}>{s.name || s.symbol}</option>)}
          </select>
        )}

        <div className="flex flex-wrap gap-1">
          {timeframes.map((tf) => (
            <button key={tf.value} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${timeframe === tf.value ? themeClasses.activeButton : themeClasses.button}`} onClick={() => dispatch(setTimeframe(tf.value))}>{tf.label}</button>
          ))}
          <button onClick={() => setShowCustomTimeframe(true)} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${themeClasses.button}`}>Custom</button>
        </div>

        {/* Daily Toggle - Standardized */}
        <div className="flex items-center gap-2">
            <button onClick={() => handleDailyToggle(!daily)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all ${daily ? theme === 'dark' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' : 'bg-blue-50 text-blue-600 border-blue-200' : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}>
                Daily
            </button>
        </div>

        {/* Toolbar Tools */}
        <div className="flex items-center gap-2">
            <button onClick={() => setDrawingMode(drawingMode === 'hline' ? null : 'hline')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all ${drawingMode === 'hline' ? theme === 'dark' ? 'bg-blue-900/40 text-blue-400 border-blue-700/50 ring-1 ring-blue-500/50' : 'bg-blue-50 text-blue-600 border-blue-200 ring-1 ring-blue-300' : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                title="Draw Horizontal Line">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>Line</span>
            </button>
            <div className={`w-px h-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />
            <button onClick={() => handleWeeklyToggle(!weekly)} className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all ${weekly ? theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200' : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}>Weekly</button>
            <button onClick={() => handleAvgToggle(!avg)} className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all ${avg ? theme === 'dark' ? 'bg-purple-900/30 text-purple-400 border-purple-700/50' : 'bg-purple-50 text-purple-600 border-purple-200' : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}>TrueAvg</button>
        </div>

        {/* Profile Selector */}
        <div className="flex items-center gap-2">
            <div className="relative group">
                <select className={`appearance-none pl-3 pr-8 py-1 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer shadow-sm outline-none ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 focus:ring-2 focus:ring-emerald-500/50" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-emerald-500/50"}`}
                    value={activeProfile} onChange={(e) => setActiveProfile(e.target.value)}>
                    <option value="none">No Profile</option>
                    <option value="oi">Open Interest</option>
                    <option value="oi_change">OI Change</option>
                    <option value="volume">Volume</option>
                    <option value="delta">Delta</option>
                    <option value="gamma">Gamma</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
            </div>
        </div>

        <div className={`w-px h-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button onClick={() => { if (chartRef.current) { const ts = chartRef.current.timeScale(); const r = ts.getVisibleLogicalRange(); if (r) ts.setVisibleLogicalRange({ from: r.from + (r.to - r.from) * 0.1, to: r.to - (r.to - r.from) * 0.1 }); } }}
            className={`p-1.5 rounded-full transition-all duration-200 border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`} title="Zoom In">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
          </button>
          <button onClick={() => { if (chartRef.current) { const ts = chartRef.current.timeScale(); const r = ts.getVisibleLogicalRange(); if (r) ts.setVisibleLogicalRange({ from: r.from - (r.to - r.from) * 0.1, to: r.to + (r.to - r.from) * 0.1 }); } }}
            className={`p-2 rounded-md transition-all duration-200 ${themeClasses.button}`} title="Zoom Out">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" /></svg>
          </button>
          <button onClick={() => { if (chartRef.current) chartRef.current.timeScale().fitContent(); }} className={`p-2 rounded-md transition-all duration-200 ${themeClasses.button}`} title="Fit to Screen">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button onClick={() => { const elem = chartContainerRef.current?.parentElement?.parentElement; if (!document.fullscreenElement) { elem?.requestFullscreen?.(); setIsFullscreen(true); } else { document.exitFullscreen?.(); setIsFullscreen(false); } }}
          className={`p-2 rounded-md transition-all duration-200 ${themeClasses.button}`} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          {isFullscreen ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>}
        </button>

        {/* Connection status */}
        <div className={`w-3 h-3 rounded-full ml-auto ${connectionStatus === "connected" ? "bg-green-500" : connectionStatus === "loading" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} title={connectionStatus} />
      </div>

      {/* Chart Wrapper - Use 100% height in fullscreen, reduced margin normally */}
      <div className="relative w-full flex-grow" style={{ height: isFullscreen ? '100vh' : embedded ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)' }}>
          <div ref={chartContainerRef} className={`w-full h-full ${themeClasses.chart}`} />
          <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none z-20" />
      </div>
    </div>
  );
});

TradingChart.displayName = "TradingChart";
export default TradingChart;
