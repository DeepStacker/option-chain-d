import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  symbols: [],
  currentSymbol: null,
  timeframe: "10",
  // Initialize chartData as an empty array to prevent errors
  chartData: [],
  connectionStatus: "disconnected",
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setSymbols: (state, action) => {
      state.symbols = action.payload;
    },
    setCurrentSymbol: (state, action) => {
      state.currentSymbol = action.payload;
    },
    setTimeframe: (state, action) => {
        action.payload !== "1" ? state.timeframe = action.payload : state.timeframe = "";
    },
    // This reducer is for setting the initial historical data
    setChartData: (state, action) => {
      state.chartData = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    // 1. Add the new reducer for live updates
    appendLiveCandle: (state, action) => {
      const newCandle = action.payload;
      const lastCandle = state.chartData[state.chartData.length - 1];

      if (lastCandle && lastCandle.time === newCandle.time) {
        // If the new candle has the same timestamp, it's an update to the current candle
        state.chartData[state.chartData.length - 1] = newCandle;
      } else {
        // Otherwise, it's a new candle, so we append it
        state.chartData.push(newCandle);
      }
    },
  },
});

export const {
  setSymbols,
  setCurrentSymbol,
  setTimeframe,
  // Renamed updateChartData to setChartData for clarity
  setChartData,
  setConnectionStatus,
  // 2. Export the new action so it can be imported elsewhere
  appendLiveCandle,
} = chartSlice.actions;

export default chartSlice.reducer;
