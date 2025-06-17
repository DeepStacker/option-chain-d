// components/DataFetcher.jsx
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChartData, setConnectionStatus } from "../context/chartSlice";

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

const DataFetcher = ({ candleSeriesRef, onOHLCUpdate, onLivePriceUpdate }) => {
  const dispatch = useDispatch();
  const { currentSymbol, timeframe } = useSelector((state) => state.chart);
  const evtSourceRef = useRef(null);

  useEffect(() => {
    if (!currentSymbol?.sym_id || !candleSeriesRef.current) return;

    // console.log("🔄 Creating SSE connection for:", currentSymbol.symbol, timeframe);

    // Cleanup existing SSE connection
    if (evtSourceRef.current) {
      // console.log("🧹 Closing existing SSE connection");
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
        interval: timeframe === "D" ? "1" : timeframe === "W" ? "W" : timeframe === "M" ? "M" : timeframe,
        type: timeframe === "D" ? "day" : timeframe === "W" ? "week" : timeframe === "M" ? "month" : "minute",
        instrument_token: currentSymbol.sym_id,
      });

      try {
        const url = `http://localhost:3000/data?${params.toString()}`;
        // console.log("📡 Creating new SSE connection:", url);
        
        evtSourceRef.current = new EventSource(url);

        evtSourceRef.current.onopen = () => {
          console.log("✅ SSE connection opened successfully");
        };

        evtSourceRef.current.onerror = () => {
          console.log("❌ SSE connection error:", error);
          dispatch(setConnectionStatus("error"));
        };

        evtSourceRef.current.onmessage = async (event) => {
          let obj; // Declare obj outside the try block
          try {
            obj = JSON.parse(event.data);
            // console.log("SSE data received:", obj); // Log the obj variable

            if (obj.status === "success" && obj.data?.candles) {
              // console.log("📊 Processing candles, count:", obj.data.candles.length);

              const formattedData = obj.data.candles.map((candle) => {
                if (candle.length !== 7) {
                  console.warn("Candle data has unexpected format:", candle);
                  return null; // Skip this candle
                }
                const [timestamp, open, high, low, close] = candle;
                const utcTimestamp = Math.floor(new Date(timestamp).getTime() / 1000);
                const istTimestamp = convertUTCToISTTimestamp(utcTimestamp);

                return {
                  time: istTimestamp,
                  open: parseFloat(open),
                  high: parseFloat(high),
                  low: parseFloat(low),
                  close: parseFloat(close),
                };
              }).filter(candle => candle !== null);

              // console.log("Formatted data:", formattedData); // Log the formattedData variable

              if (candleSeriesRef.current && formattedData.length > 0) {
                candleSeriesRef.current.setData(formattedData);

                const lastCandle = formattedData[formattedData.length - 1];
                onOHLCUpdate({
                  open: lastCandle.open.toFixed(2),
                  high: lastCandle.high.toFixed(2),
                  low: lastCandle.low.toFixed(2),
                  time: formatTimeForIST(lastCandle.time),
                });

                onLivePriceUpdate(lastCandle.close);
                dispatch(setChartData(formattedData));
              }
            } else {
              console.warn("SSE data status is not success:", obj.status);
              dispatch(setConnectionStatus("error"));
            }
          } catch (error) {
            console.error("❌ Error processing SSE data:", error);
            dispatch(setConnectionStatus("error"));
          } finally {
            if (obj?.status === "success") {
              dispatch(setConnectionStatus("connected"));
            }
          }
        };
      } catch (error) {
        console.error("❌ Data loading failed:", error);
        dispatch(setConnectionStatus("error"));
      }
    };

    const timeoutId = setTimeout(fetchHistoricalData, 50);

    return () => {
      clearTimeout(timeoutId);
      if (evtSourceRef.current) {
        // console.log("🧹 Cleaning up SSE connection");
        evtSourceRef.current.close();
        evtSourceRef.current = null;
      }
    };
  }, [currentSymbol?.sym_id, timeframe, dispatch, candleSeriesRef, onOHLCUpdate, onLivePriceUpdate]);

  return null;
};

export default DataFetcher;
