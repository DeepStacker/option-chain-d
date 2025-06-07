// slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark",
    isReversed: true,
    isHighlighting: true,
    isItmHighlighting: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setIsReversed: (state, action) => {
      state.isReversed = state.isReversed === true ? false : true;
    },
    setIsHighlighting: (state, action) => {
      state.isHighlighting = state.isHighlighting === true ? false : true;
    },
    setIsItmHighlighting: (state, action) => {
      state.isItmHighlighting = state.isItmHighlighting === true ? false : true;
    },
  },
});

export const { toggleTheme, setIsReversed, setIsHighlighting, setIsItmHighlighting } =
  themeSlice.actions;
export default themeSlice.reducer;
