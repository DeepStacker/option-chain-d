// components/ChartContainer.jsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import { useSelector } from "react-redux";

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

const ChartContainer = ({ onOHLCUpdate, chartRef, candleSeriesRef }) => {
  const theme = useSelector((state) => state.theme.theme);
  const chartContainerRef = useRef(null);

  // Memoized theme colors
  const themeColors = useMemo(
    () => ({
      gridColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    }),
    [theme]
  );

  // Chart theme configuration
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

  // Chart initialization
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

      const candleSeries = chart.addSeries(CandlestickSeries, candlestickTheme);

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;

      // Crosshair move handler
      const throttledCrosshairMove = throttle((param) => {
        if (param.time) {
          const data = param.seriesData.get(candleSeries);
          if (data) {
            onOHLCUpdate({
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

      // Resize handler
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

        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          candleSeriesRef.current = null;
        }
      };
    } catch (error) {
      console.error("❌ Error initializing chart:", error);
    }
  }, []);

  // Theme updates
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions(chartTheme);
    }
    if (candleSeriesRef.current) {
      candleSeriesRef.current.applyOptions(candlestickTheme);
    }
  }, [chartTheme, candlestickTheme]);

  return (
    <div
      ref={chartContainerRef}
      className={`w-full flex-grow ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      style={{ height: `${window.innerHeight - 180}px` }}
    />
  );
};

export default ChartContainer;
