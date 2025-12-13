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
    setDarkTheme: (state) => {
      state.theme = 'dark';
      localStorage.setItem('theme', 'dark');
    },
    setLightTheme: (state) => {
      state.theme = 'light';
      localStorage.setItem('theme', 'light');
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    setIsItmHighlighting: (state) => {
      state.isItmHighlighting = state.isItmHighlighting === true ? false : true;
    },
  },
});

export const { toggleTheme, setIsReversed, setIsHighlighting, setIsItmHighlighting } =
  themeSlice.actions;
export default themeSlice.reducer;
