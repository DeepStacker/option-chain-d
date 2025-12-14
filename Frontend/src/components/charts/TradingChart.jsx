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
import SymbolSelector from "./SymbolSelector";

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
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
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
        // TrueAvg lines use unique _avg keys from computeLevels
        const avgLines = [
          { key: "support_avg", title: "S-Avg", color: "#a855f7" }, // Purple for avg
          { key: "support_1_1_avg", title: "S1.1-Avg", color: "#c084fc" },
          { key: "support_1_2_avg", title: "S1.2-Avg", color: "#c084fc" },
          { key: "resistance_avg", title: "R-Avg", color: "#f97316" }, // Orange for avg
          { key: "resistance_1_1_avg", title: "R1.1-Avg", color: "#fb923c" },
          { key: "resistance_1_2_avg", title: "R1.2-Avg", color: "#fb923c" },
        ];
        
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

  // Memoize profile data processing with advanced combined metrics
  const profileData = useMemo(() => {
    if (!oc || activeProfile === 'none') return null;
    
    const strikes = Object.keys(oc);
    let dataPoints = [];
    let totalSum = 0;
    let maxVal = 0;
    let pocStrike = null;
    let maxTotalVal = 0;
    
    // First pass: collect raw data for all strikes
    const rawData = strikes.map((strikeStr) => {
      const s = oc[strikeStr];
      const strike = parseFloat(strikeStr);
      
      // Extract all available metrics
      const ce = s.ce || {};
      const pe = s.pe || {};
      
      return {
        strikeStr,
        strike,
        // OI Data
        ce_oi: ce.OI || ce.oi || 0,
        pe_oi: pe.OI || pe.oi || 0,
        ce_oi_chng: ce.oichng || ce.oi_change || 0,
        pe_oi_chng: pe.oichng || pe.oi_change || 0,
        // Volume
        ce_vol: ce.volume || ce.vol || 0,
        pe_vol: pe.volume || pe.vol || 0,
        // Greeks - check both optgeeks and direct properties
        ce_delta: ce.optgeeks?.delta || ce.delta || 0,
        pe_delta: pe.optgeeks?.delta || pe.delta || 0,
        ce_gamma: ce.optgeeks?.gamma || ce.gamma || 0,
        pe_gamma: pe.optgeeks?.gamma || pe.gamma || 0,
        ce_theta: ce.optgeeks?.theta || ce.theta || 0,
        pe_theta: pe.optgeeks?.theta || pe.theta || 0,
        ce_vega: ce.optgeeks?.vega || ce.vega || 0,
        pe_vega: pe.optgeeks?.vega || pe.vega || 0,
        // IV - check multiple field names
        ce_iv: ce.iv || ce.IV || ce.impliedVolatility || 0,
        pe_iv: pe.iv || pe.IV || pe.impliedVolatility || 0,
        // Price
        ce_ltp: ce.ltp || 0,
        pe_ltp: pe.ltp || 0,
        // Reversal - at strike level, not CE/PE level
        // Use strike-level data (s.reversal) and split between CE (resistance) and PE (support)
        reversal: s.reversal || 0,
        wkly_reversal: s.wkly_reversal || 0,
        fut_reversal: s.fut_reversal || 0,
      };
    });

    // Calculate spot price from ATM (where straddle is cheapest)
    const spotApprox = price || Math.min(...rawData.map(r => r.ce_ltp + r.pe_ltp)) > 0 
      ? rawData.reduce((best, r) => (r.ce_ltp + r.pe_ltp) < (best?.ce_ltp + best?.pe_ltp) && (r.ce_ltp + r.pe_ltp) > 0 ? r : best, rawData[0])?.strike 
      : null;

    // Process based on profile type
    rawData.forEach((r) => {
      let ceVal = 0, peVal = 0;
      let total = 0;
      let singleVal = null; // For profiles that show a single combined value

      switch (activeProfile) {
        // ═══════════════════════════════════════════════════════════════
        // BASIC PROFILES
        // ═══════════════════════════════════════════════════════════════
        case 'oi':
          ceVal = r.ce_oi;
          peVal = r.pe_oi;
          total = ceVal + peVal;
          break;
          
        case 'volume':
          ceVal = r.ce_vol;
          peVal = r.pe_vol;
          total = ceVal + peVal;
          break;
          
        case 'oi_change':
          ceVal = r.ce_oi_chng;
          peVal = r.pe_oi_chng;
          total = Math.abs(ceVal) + Math.abs(peVal);
          break;
          
        case 'delta':
          ceVal = Math.abs(r.ce_delta);
          peVal = Math.abs(r.pe_delta);
          total = ceVal + peVal;
          break;
          
        case 'gamma':
          ceVal = r.ce_gamma;
          peVal = r.pe_gamma;
          total = ceVal + peVal;
          break;

        // ═══════════════════════════════════════════════════════════════
        // ADVANCED COMBINED PROFILES
        // ═══════════════════════════════════════════════════════════════
        
        // GEX (Gamma Exposure) = OI × Gamma × Spot² × 100
        // Shows where market makers have hedging pressure
        // Positive = MMs need to sell on rise, buy on fall (mean reversion)
        // Negative = MMs need to buy on rise, sell on fall (momentum)
        case 'gex':
          const ceGex = r.ce_oi * Math.abs(r.ce_gamma) * 100;
          const peGex = -r.pe_oi * Math.abs(r.pe_gamma) * 100; // Negative for puts
          ceVal = ceGex;
          peVal = Math.abs(peGex);
          singleVal = ceGex + peGex; // Net GEX
          total = Math.abs(singleVal);
          break;
          
        // Delta-Weighted OI = OI × |Delta|
        // Shows directional exposure at each strike
        case 'delta_oi':
          ceVal = r.ce_oi * Math.abs(r.ce_delta);
          peVal = r.pe_oi * Math.abs(r.pe_delta);
          total = ceVal + peVal;
          break;
          
        // IV Skew = CE IV - PE IV at each strike
        // Positive = CE more expensive (bearish sentiment)
        // Negative = PE more expensive (bullish sentiment/fear)
        case 'iv_skew':
          const skew = r.ce_iv - r.pe_iv;
          ceVal = skew > 0 ? skew : 0;
          peVal = skew < 0 ? Math.abs(skew) : 0;
          singleVal = skew;
          total = Math.abs(skew);
          break;
          
        // PCR Profile = PE OI / CE OI at each strike
        // >1 = Bullish (more put writing = support)
        // <1 = Bearish (more call writing = resistance)
        case 'pcr':
          const pcr = r.ce_oi > 0 ? r.pe_oi / r.ce_oi : 0;
          // Normalize: PCR 0.5-2.0 range centered at 1.0
          const pcrNorm = Math.min(Math.max(pcr, 0.3), 3);
          ceVal = pcrNorm < 1 ? (1 - pcrNorm) : 0; // Bearish intensity
          peVal = pcrNorm > 1 ? (pcrNorm - 1) : 0; // Bullish intensity
          singleVal = pcr;
          total = Math.abs(pcr - 1);
          break;
          
        // OI Strength = (OI × |Delta|) + (OI_Chng × Multiplier)
        // Combines position size with recent activity
        case 'oi_strength':
          const ceStrength = (r.ce_oi * Math.abs(r.ce_delta)) + (r.ce_oi_chng * 2);
          const peStrength = (r.pe_oi * Math.abs(r.pe_delta)) + (r.pe_oi_chng * 2);
          ceVal = Math.max(0, ceStrength);
          peVal = Math.max(0, peStrength);
          total = ceVal + peVal;
          break;
          
        // Composite = Weighted combination of multiple factors
        // Weights: OI(30%) + OI_Chng(25%) + Vol(20%) + Delta(15%) + Gamma(10%)
        case 'composite':
          // Normalize each metric to 0-1 scale relative to max
          const normCeOi = r.ce_oi;
          const normPeOi = r.pe_oi;
          const normCeChng = Math.abs(r.ce_oi_chng);
          const normPeChng = Math.abs(r.pe_oi_chng);
          const normCeVol = r.ce_vol;
          const normPeVol = r.pe_vol;
          const normCeDelta = Math.abs(r.ce_delta) * 100; // Scale up
          const normPeDelta = Math.abs(r.pe_delta) * 100;
          const normCeGamma = r.ce_gamma * 10000; // Scale up
          const normPeGamma = r.pe_gamma * 10000;
          
          ceVal = (normCeOi * 0.30) + (normCeChng * 0.25) + (normCeVol * 0.20) + 
                  (normCeDelta * 0.15) + (normCeGamma * 0.10);
          peVal = (normPeOi * 0.30) + (normPeChng * 0.25) + (normPeVol * 0.20) + 
                  (normPeDelta * 0.15) + (normPeGamma * 0.10);
          total = ceVal + peVal;
          break;
          
        // Reversal Zones = Support/Resistance Strength Scores plotted at DYNAMIC levels
        // CLUSTERED to reduce noise
        case 'reversal': {
          // 1. Collect ALL independent reversal levels first
          // We need a temporary collection because clustering happens across ALL strikes, not just per-strike loop
          // But here we are inside the map loop (iterating strikes). 
          // ! wait, we are inside `rawData.map`. We can't cluster efficiently here.
          // Correct approach:
          // The current arch loops `rawData` (which is per strike) and pushes to `dataPoints`.
          // To cluster properly, we should:
          // A. Collect levels in this loop.
          // B. AFTER the loop, process the collection to cluster and push to `dataPoints`.
          //
          // HOWEVER, refactoring the outer `profileData` calculation structure is risky/large.
          // ALTERNATIVE:
          // Push "raw" reversal points to `dataPoints` with a special flag, 
          // then add a POST-PROCESSING step before returning `profileData`.
          //
          // Let's modify the plan:
          // 1. In this loop, push ALL raw reversal points as usual (using the logic I just wrote).
          // 2. Add a post-processing block after the `rawData.forEach` loop to CLUSTER the `dataPoints` if activeProfile == 'reversal'.
          
          // Advanced Strength Scoring:
          // 1. Base: OI (70%) + Volume (30%)
          // 2. Multipliers: Gamma (Hedging Pressure) & IV (Risk/Fear)
          
          // Gamma Multiplier: High Gamma (>0.01) implies pinning/reversal pressure
          // Scaling: 1 + (Gamma * 50). e.g., 0.02 * 50 = 1.0 -> 2.0x boost
          const ceGammaMult = 1 + (Math.abs(r.ce_gamma || 0) * 50);
          const peGammaMult = 1 + (Math.abs(r.pe_gamma || 0) * 50);
          
          // IV Multiplier: High IV (>20%) implies market pays premium for this level
          // Scaling: 1 + (IV / 100). e.g., 30% IV -> 1.3x boost
          const ceIvMult = 1 + ((r.ce_iv || 0) / 100);
          const peIvMult = 1 + ((r.pe_iv || 0) / 100);

          const ceStrength = ((r.ce_oi * 0.7) + (r.ce_vol * 0.3)) * ceGammaMult * ceIvMult;
          const peStrength = ((r.pe_oi * 0.7) + (r.pe_vol * 0.3)) * peGammaMult * peIvMult;

          // Collect valid reversal levels for this strike (Use formatted values)
          const levels = [
            { val: parseFloat(r.reversal), label: 'Intraday' },
            { val: parseFloat(r.wkly_reversal), label: 'Weekly' },
            { val: parseFloat(r.fut_reversal), label: 'Future' }
          ].filter(l => l.val && l.val > 0 && !isNaN(l.val));

          levels.forEach(l => {
             // Determine raw type (Support/Res) just for initial strength assignment
             // but store BOTH strengths for dominance calculation later
             const isResistance = spotApprox ? l.val > spotApprox : l.val > r.strike;
             const strength = isResistance ? ceStrength : peStrength; // This is just for the "total" used in other places, but we need components
             
             dataPoints.push({
               strike: l.val, 
               total: strength,
               ceVal: isResistance ? strength : 0, 
               peVal: isResistance ? 0 : strength,
               singleVal: strength,
               
               // Store raw components for Dominance Logic
               rawCeStrength: ceStrength,
               rawPeStrength: peStrength,
               isResistanceRaw: isResistance, // Keep this for reference but use dominance later
               
               isRawReversal: true, // Flag for post-processing
               reversalType: l.label,
               metrics: { gamma: isResistance ? r.ce_gamma : r.pe_gamma, iv: isResistance ? r.ce_iv : r.pe_iv }
             });
          });

          return; // Skip default push
        }
          
        // Vega Exposure = OI × Vega (sensitivity to IV changes)
        case 'vega':
          ceVal = r.ce_oi * Math.abs(r.ce_vega);
          peVal = r.pe_oi * Math.abs(r.pe_vega);
          total = ceVal + peVal;
          break;
          
        // Theta Decay = Daily premium decay at each strike
        case 'theta':
          ceVal = Math.abs(r.ce_theta * r.ce_oi);
          peVal = Math.abs(r.pe_theta * r.pe_oi);
          total = ceVal + peVal;
          break;

        default:
          return;
      }

      const maxSideVal = Math.max(Math.abs(ceVal), Math.abs(peVal));
      maxVal = Math.max(maxVal, maxSideVal);
      totalSum += total;
      
      if (total > maxTotalVal) {
        maxTotalVal = total;
        pocStrike = r.strikeStr;
      }

      dataPoints.push({ 
        strike: r.strikeStr, 
        total, 
        ceVal, 
        peVal,
        singleVal, // For profiles that show net value
        raw: r // Keep raw data for tooltips
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // POST-PROCESSING: CLUSTERING FOR REVERSAL PROFILE (Noise Reduction)
    // ═══════════════════════════════════════════════════════════════
    if (activeProfile === 'reversal' && dataPoints.length > 0) {
      // 1. Sort points by price
      dataPoints.sort((a, b) => a.strike - b.strike);
      
      const clusters = [];
      // Threshold: 0.1% of price (e.g. ~25 pts for Nifty 25000)
      const refPrice = spotApprox || dataPoints[0].strike;
      const threshold = refPrice * 0.001; 
      
      let currentCluster = null;
      
      dataPoints.forEach(p => {
        if (!currentCluster) {
          // Initialize cluster with dominance components
          // USE RAW STRENGTHS to avoid bias from potentially incorrect Spot Price checks earlier
          currentCluster = { 
            totalStrength: p.total, 
            ceSum: p.rawCeStrength || p.ceVal, // Fallback for safety
            peSum: p.rawPeStrength || p.peVal,
            weightedSum: p.strike * p.total,
            points: [p] 
          };
        } else {
          // Compare against cluster's current weighted center
          const currentAvg = currentCluster.weightedSum / currentCluster.totalStrength;
          
          if (Math.abs(p.strike - currentAvg) < threshold) {
            // Merge into cluster
            currentCluster.totalStrength += p.total;
            currentCluster.ceSum += (p.rawCeStrength || p.ceVal);
            currentCluster.peSum += (p.rawPeStrength || p.peVal);
            currentCluster.weightedSum += (p.strike * p.total);
            currentCluster.points.push(p);
          } else {
            // Finalize old cluster
            clusters.push(currentCluster);
            // Start new
            currentCluster = { 
              totalStrength: p.total, 
              ceSum: p.rawCeStrength || p.ceVal,
              peSum: p.rawPeStrength || p.peVal,
              weightedSum: p.strike * p.total,
              points: [p] 
            };
          }
        }
      });
      if (currentCluster) clusters.push(currentCluster);
      
      // Filter clusters to reduce noise (Smart Filtering)
      if (clusters.length > 0) {
        // Statistical Analysis for Auto-Detection (Smart Brain)
        const strengths = clusters.map(c => c.totalStrength);
        const maxClusterStrength = Math.max(...strengths);
        const mean = strengths.reduce((a, b) => a + b, 0) / strengths.length;
        const variance = strengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / strengths.length;
        const stdDev = Math.sqrt(variance);

        // Dynamic Threshold: Auto-detect noise floor
        // Use Max(5% of Max, 50% of Mean) to ensure we hide noise but keep relevant structure
        const dynamicThreshold = Math.max(maxClusterStrength * 0.05, mean * 0.5);

        const relevantClusters = clusters.filter(c => c.totalStrength > dynamicThreshold);
        
        // 2. Convert filtered clusters to final dataPoints
        // Color Logic Fix: Ensure strict comparison against a VALID spot price
        const validSpot = (spotApprox && spotApprox > 100) ? spotApprox : (dataPoints[0].strike);
        
        dataPoints = relevantClusters.map(c => {
           const finalPrice = c.weightedSum / c.totalStrength;
           
           // Dominance Check
           const isResistance = c.ceSum >= c.peSum;

           // Confidence Tier Calculation
           // Tier 1 (Super Key): > Mean + 1.5 StdDev OR > 80% of Max
           // Tier 2 (Tradeable): > Threshold
           const isTier1 = c.totalStrength > (mean + (1.5 * stdDev)) || c.totalStrength > (maxClusterStrength * 0.8);

           // Visual Confidence:
           // Tier 1: Full Brightness (1.0)
           // Tier 2: Standard (0.65)
           const baseColor = isResistance ? 'rgba(255, 82, 82, ' : 'rgba(0, 230, 118, '; // Bright Red vs Bright Green
           const opacity = isTier1 ? '1.0)' : '0.55)';
           const finalColor = baseColor + opacity;
           
           return {
             strike: finalPrice,
             total: c.totalStrength,
             ceVal: isResistance ? c.totalStrength : 0,
             peVal: isResistance ? 0 : c.totalStrength,
             singleVal: c.totalStrength,
             isCluster: true,
             clusterCount: c.points.length,
             confidenceTier: isTier1 ? 1 : 2,
             color: finalColor // Used for visual highlighting
           };
        });
      } else {
        dataPoints = [];
      }
      
      // 3. Recalculate Stats for Scaling
      if (dataPoints.length > 0) {
        maxVal = Math.max(...dataPoints.map(d => d.total));
        totalSum = dataPoints.reduce((acc, d) => acc + d.total, 0);
        // Find POC of clustered data
        const pocPoint = dataPoints.reduce((best, d) => d.total > best.total ? d : best, dataPoints[0]);
        pocStrike = pocPoint.strike.toString();
        maxTotalVal = pocPoint.total;
      }
    }

    if (maxVal === 0) return null;

    // Value Area Calculation (70% of volume)
    const sortedByVal = [...dataPoints].sort((a, b) => b.total - a.total);
    const vaThreshold = totalSum * 0.70;
    let currentSum = 0;
    const vaStrikes = new Set();
    
    for (const p of sortedByVal) {
      currentSum += p.total;
      vaStrikes.add(p.strike);
      if (currentSum >= vaThreshold) break;
    }

    // Profile metadata for rendering
    const profileMeta = {
      oi: { name: 'Open Interest', ceLabel: 'CE OI', peLabel: 'PE OI' },
      volume: { name: 'Volume', ceLabel: 'CE Vol', peLabel: 'PE Vol' },
      oi_change: { name: 'OI Change', ceLabel: 'CE Chng', peLabel: 'PE Chng', showSign: true },
      delta: { name: 'Delta', ceLabel: 'CE Δ', peLabel: 'PE Δ' },
      gamma: { name: 'Gamma', ceLabel: 'CE Γ', peLabel: 'PE Γ' },
      gex: { name: 'Gamma Exposure', ceLabel: 'CE GEX', peLabel: 'PE GEX', showNet: true },
      delta_oi: { name: 'Delta-Weighted OI', ceLabel: 'CE Δ×OI', peLabel: 'PE Δ×OI' },
      iv_skew: { name: 'IV Skew', ceLabel: 'CE IV↑', peLabel: 'PE IV↑', showNet: true },
      pcr: { name: 'PCR Profile', ceLabel: 'Bearish', peLabel: 'Bullish', showRatio: true },
      oi_strength: { name: 'OI Strength', ceLabel: 'CE Str', peLabel: 'PE Str' },
      composite: { name: 'Composite', ceLabel: 'CE Score', peLabel: 'PE Score' },
      reversal: { name: 'Reversal Zones', ceLabel: 'Resist. Str', peLabel: 'Support Str' },
      vega: { name: 'Vega Exposure', ceLabel: 'CE Vega', peLabel: 'PE Vega' },
      theta: { name: 'Theta Decay', ceLabel: 'CE Θ', peLabel: 'PE Θ' },
    };

    return { dataPoints, maxVal, pocStrike, vaStrikes, meta: profileMeta[activeProfile] };
  }, [oc, activeProfile, price]);

  // Canvas Overlay Logic (Profiles) - Optimized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartRef.current || !candleSeriesRef.current || !profileData) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    const series = candleSeriesRef.current;
    const { dataPoints, maxVal, pocStrike, vaStrikes } = profileData;
    
    // Throttle flag to prevent overdraw
    let animationFrameId = null;
    let lastDrawTime = 0;
    const MIN_DRAW_INTERVAL = 16; // ~60fps cap

    const draw = (timestamp) => {
      // Throttle draws to prevent performance issues
      if (timestamp - lastDrawTime < MIN_DRAW_INTERVAL) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = timestamp;

      if (!canvas || !series) return;
      
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Only resize if needed
      const targetWidth = Math.floor(rect.width * dpr);
      const targetHeight = Math.floor(rect.height * dpr);
      
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
      
      // Reset transform and clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Professional styling
      const rightPadding = 65;
      const startX = rect.width - rightPadding;
      const maxBarWidth = (rect.width - rightPadding) * 0.40;
      const barHeight = 5;
      const barGap = 1;
      
      // Colors - CE Red, PE Green (swapped per user request)
      const ceColor = { r: 239, g: 68, b: 68 };   // Red-500 for CE
      const peColor = { r: 34, g: 197, b: 94 };   // Green-500 for PE
      const pocColor = '#FACC15';
      
      // Batch similar operations for performance
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Pre-calculate all coordinates
      // Pre-calculate all coordinates
      const bars = [];
      dataPoints.forEach((p) => {
        const strike = parseFloat(p.strike);
        const y = series.priceToCoordinate(strike);
        if (y === null || y < 0 || y > rect.height) return;
        
        const isVA = vaStrikes.has(p.strike);
        const isPOC = p.strike === pocStrike;
        
        const ceWidth = (Math.abs(p.ceVal) / maxVal) * maxBarWidth;
        const peWidth = (Math.abs(p.peVal) / maxVal) * maxBarWidth;
        
        bars.push({
          y, ceWidth, peWidth, isVA, isPOC,
          ceUnwinding: activeProfile === 'oi_change' && p.ceVal < 0,
          peUnwinding: activeProfile === 'oi_change' && p.peVal < 0,
          customColor: p.color // Pass custom confidence color from Smart Auto-Detection
        });
      });
      
      // Draw all bars in batches for better performance
      // First pass: Draw all fills
      bars.forEach(({ y, ceWidth, peWidth, isVA, ceUnwinding, peUnwinding, customColor }) => {
        const baseOpacity = isVA ? 0.6 : 0.25;
        
        // CE Bar (Red / Custom) - Above strike line
        if (ceWidth > 0.5) {
          if (customColor) {
             ctx.fillStyle = customColor; // Use Confidence Layout (Smart Auto-Detection)
          } else if (ceUnwinding) {
            ctx.fillStyle = `rgba(${ceColor.r}, ${ceColor.g}, ${ceColor.b}, ${baseOpacity * 0.4})`;
          } else {
            // Gradient for professional look
            const gradient = ctx.createLinearGradient(startX - ceWidth, 0, startX, 0);
            gradient.addColorStop(0, `rgba(${ceColor.r}, ${ceColor.g}, ${ceColor.b}, ${baseOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${ceColor.r}, ${ceColor.g}, ${ceColor.b}, ${baseOpacity})`);
            ctx.fillStyle = gradient;
          }
          ctx.beginPath();
          ctx.roundRect(startX - ceWidth, y - barHeight - barGap, ceWidth, barHeight, 2);
          ctx.fill();
        }
        
        // PE Bar (Green / Custom) - Below strike line
        if (peWidth > 0.5) {
          if (customColor) {
             ctx.fillStyle = customColor; // Use Confidence Layout (Smart Auto-Detection)
          } else if (peUnwinding) {
            ctx.fillStyle = `rgba(${peColor.r}, ${peColor.g}, ${peColor.b}, ${baseOpacity * 0.4})`;
          } else {
            const gradient = ctx.createLinearGradient(startX - peWidth, 0, startX, 0);
            gradient.addColorStop(0, `rgba(${peColor.r}, ${peColor.g}, ${peColor.b}, ${baseOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${peColor.r}, ${peColor.g}, ${peColor.b}, ${baseOpacity})`);
            ctx.fillStyle = gradient;
          }
          ctx.beginPath();
          ctx.roundRect(startX - peWidth, y + barGap, peWidth, barHeight, 2);
          ctx.fill();
        }
      });
      
      // Second pass: Draw unwinding borders
      ctx.lineWidth = 1;
      bars.forEach(({ y, ceWidth, peWidth, isVA, ceUnwinding, peUnwinding }) => {
        const lineOpacity = isVA ? 0.8 : 0.4;
        
        if (ceUnwinding && ceWidth > 0.5) {
          ctx.strokeStyle = `rgba(${ceColor.r}, ${ceColor.g}, ${ceColor.b}, ${lineOpacity})`;
          ctx.beginPath();
          ctx.roundRect(startX - ceWidth, y - barHeight - barGap, ceWidth, barHeight, 2);
          ctx.stroke();
        }
        
        if (peUnwinding && peWidth > 0.5) {
          ctx.strokeStyle = `rgba(${peColor.r}, ${peColor.g}, ${peColor.b}, ${lineOpacity})`;
          ctx.beginPath();
          ctx.roundRect(startX - peWidth, y + barGap, peWidth, barHeight, 2);
          ctx.stroke();
        }
      });
      
      // Third pass: POC highlight with glow effect
      ctx.lineWidth = 2;
      ctx.strokeStyle = pocColor;
      ctx.shadowColor = pocColor;
      ctx.shadowBlur = 6;
      
      bars.filter(b => b.isPOC).forEach(({ y, ceWidth, peWidth }) => {
        // POC indicator line
        ctx.beginPath();
        ctx.moveTo(startX - Math.max(ceWidth, peWidth) - 10, y);
        ctx.lineTo(startX + 5, y);
        ctx.stroke();
        
        // POC label
        ctx.shadowBlur = 0;
        ctx.font = 'bold 10px Inter, system-ui, sans-serif';
        ctx.fillStyle = pocColor;
        ctx.textAlign = 'right';
        ctx.fillText('POC', startX - Math.max(ceWidth, peWidth) - 14, y + 3);
      });
      
      ctx.shadowBlur = 0;
    };

    // Initial draw with animation frame
    const startDraw = () => {
      animationFrameId = requestAnimationFrame(draw);
    };
    
    startDraw();

    // Subscribe to chart changes with throttling
    const chart = chartRef.current;
    const timeScale = chart.timeScale();
    
    const handleVisibleRangeChange = throttle(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(draw);
    }, 32); // ~30fps for scroll events
    
    timeScale.subscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
    
    // ResizeObserver with debounce
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(draw);
      }, 100)
    );
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
      resizeObserver.disconnect();
    };
  }, [profileData, chartRef.current, candleSeriesRef.current, activeProfile]);

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

      {/* Professional Compact Toolbar */}
      <div className={`relative z-[100] flex items-center gap-1.5 px-2 py-1.5 border-b backdrop-blur-sm ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        
        {/* Symbol & Price */}
        {!embedded && (
          <div className="flex items-center gap-2 pr-2 border-r border-gray-700/30">
            <SymbolSelector
              symbols={symbols}
              currentSymbol={currentSymbol}
              onSelect={(s) => dispatch(setCurrentSymbol(s))}
              theme={theme}
            />
            {livePrice && (
              <span className={`text-sm font-bold tabular-nums ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`}>{livePrice.toFixed(2)}</span>
            )}
          </div>
        )}

        {/* Timeframes - Compact horizontal scroll */}
        <div className="flex items-center gap-0.5 px-1">
          {timeframes.slice(0, 6).map((tf) => (
            <button 
              key={tf.value} 
              onClick={() => dispatch(setTimeframe(tf.value))}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-all ${
                timeframe === tf.value 
                  ? theme === 'dark' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >{tf.label}</button>
          ))}
          {/* More Timeframes Dropdown - Click-based */}
          <div className="relative">
            <button 
              onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-all ${
                timeframes.slice(6).some(tf => tf.value === timeframe)
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {timeframes.slice(6).some(tf => tf.value === timeframe) 
                ? timeframes.find(tf => tf.value === timeframe)?.label 
                : '+'
              }
            </button>
            {showTimeframeDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-[2147483646]" 
                  onClick={() => setShowTimeframeDropdown(false)}
                />
                <div className={`absolute top-full right-0 mt-1 py-1 rounded-lg shadow-xl border z-[2147483647] min-w-[100px] ${
                  theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  {timeframes.slice(6).map((tf) => (
                    <button 
                      key={tf.value}
                      onClick={() => {
                        dispatch(setTimeframe(tf.value));
                        setShowTimeframeDropdown(false);
                      }}
                      className={`block w-full px-3 py-1.5 text-xs text-left whitespace-nowrap ${
                        timeframe === tf.value
                          ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >{tf.label}</button>
                  ))}
                  <div className={`border-t my-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
                  <button 
                    onClick={() => {
                      setShowCustomTimeframe(true);
                      setShowTimeframeDropdown(false);
                    }}
                    className={`block w-full px-3 py-1.5 text-xs text-left ${
                      theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >Custom...</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className={`w-px h-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />

        {/* S/R Lines Toggle Group */}
        <div className={`flex items-center rounded-md overflow-hidden border ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <button 
            onClick={() => handleDailyToggle(!daily)}
            className={`px-2 py-1 text-[10px] font-semibold transition-all ${
              daily 
                ? 'bg-blue-500 text-white' 
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Daily S/R"
          >D</button>
          <button 
            onClick={() => handleWeeklyToggle(!weekly)}
            className={`px-2 py-1 text-[10px] font-semibold transition-all border-l ${
              weekly 
                ? 'bg-emerald-500 text-white' 
                : theme === 'dark' ? 'text-gray-400 hover:text-white border-gray-700' : 'text-gray-500 hover:text-gray-900 border-gray-200'
            }`}
            title="Weekly S/R"
          >W</button>
          <button 
            onClick={() => handleAvgToggle(!avg)}
            className={`px-2 py-1 text-[10px] font-semibold transition-all border-l ${
              avg 
                ? 'bg-purple-500 text-white' 
                : theme === 'dark' ? 'text-gray-400 hover:text-white border-gray-700' : 'text-gray-500 hover:text-gray-900 border-gray-200'
            }`}
            title="Average S/R"
          >A</button>
        </div>

        {/* Drawing Tools */}
        <button 
          onClick={() => setDrawingMode(drawingMode === 'hline' ? null : 'hline')}
          className={`p-1.5 rounded transition-all ${
            drawingMode === 'hline'
              ? 'bg-blue-500 text-white'
              : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Draw Line"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
          </svg>
        </button>

        {/* Separator */}
        <div className={`w-px h-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />

        {/* Profile Selector - Compact */}
        <select 
          className={`text-[11px] font-medium px-2 py-1 rounded border-0 outline-none cursor-pointer ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-300 focus:ring-1 focus:ring-blue-500' 
              : 'bg-gray-100 text-gray-700 focus:ring-1 focus:ring-blue-500'
          }`}
          value={activeProfile} 
          onChange={(e) => setActiveProfile(e.target.value)}
        >
          <option value="none">Profile</option>
          <option value="oi">OI</option>
          <option value="oi_change">OI Δ</option>
          <option value="volume">Vol</option>
          <option value="delta">Delta</option>
          <option value="gamma">Gamma</option>
          <option value="gex">GEX</option>
          <option value="delta_oi">Δ×OI</option>
          <option value="composite">Comp</option>
          <option value="pcr">PCR</option>
          <option value="iv_skew">IV Skew</option>
          <option value="vega">Vega</option>
          <option value="theta">Theta</option>
          <option value="reversal">Reversal</option>
        </select>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Right Controls */}
        <div className="flex items-center gap-0.5">
          {/* Zoom Controls */}
          <button 
            onClick={() => { if (chartRef.current) { const ts = chartRef.current.timeScale(); const r = ts.getVisibleLogicalRange(); if (r) ts.setVisibleLogicalRange({ from: r.from + (r.to - r.from) * 0.1, to: r.to - (r.to - r.from) * 0.1 }); } }}
            className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title="Zoom In"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
            </svg>
          </button>
          <button 
            onClick={() => { if (chartRef.current) { const ts = chartRef.current.timeScale(); const r = ts.getVisibleLogicalRange(); if (r) ts.setVisibleLogicalRange({ from: r.from - (r.to - r.from) * 0.1, to: r.to + (r.to - r.from) * 0.1 }); } }}
            className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title="Zoom Out"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button 
            onClick={() => { if (chartRef.current) chartRef.current.timeScale().fitContent(); }}
            className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title="Fit All"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          {/* Separator */}
          <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
          
          {/* Fullscreen */}
          <button 
            onClick={() => { 
              const elem = chartContainerRef.current?.parentElement?.parentElement; 
              if (!document.fullscreenElement) { elem?.requestFullscreen?.(); setIsFullscreen(true); } 
              else { document.exitFullscreen?.(); setIsFullscreen(false); } 
            }}
            className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              }
            </svg>
          </button>

          {/* Status Indicator */}
          <div 
            className={`w-2 h-2 rounded-full ml-1 ${
              connectionStatus === 'connected' ? 'bg-emerald-500' 
              : connectionStatus === 'loading' ? 'bg-amber-500 animate-pulse' 
              : 'bg-red-500'
            }`} 
            title={connectionStatus}
          />
        </div>
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
