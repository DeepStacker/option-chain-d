import { createSlice } from "@reduxjs/toolkit";

// Default dev URLs
const localURLs = {
  baseURL: "https://option-chain-d.onrender.com/api",
  socketURL: "https://option-chain-d-new-app.onrender.com",
};

// Load from localStorage or fallback to dev URLs
const savedConfig = JSON.parse(localStorage.getItem("appConfig"));

const initialState = savedConfig || localURLs;

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setURLs: (state, action) => {
      state.baseURL = action.payload.baseURL;
      state.socketURL = action.payload.socketURL;
      localStorage.setItem("appConfig", JSON.stringify(state)); // persist
    },
    resetURLs: (state) => {
      state.baseURL = localURLs.baseURL;
      state.socketURL = localURLs.socketURL;
      localStorage.setItem("appConfig", JSON.stringify(state)); // persist
    },
  },
});

export const { setURLs, resetURLs } = configSlice.actions;
export default configSlice.reducer;
