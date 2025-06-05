// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import dataReducer from './dataSlice';
import optionChainReducer from './optionData';
import tcaReducer from './tcaSlice';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import configReducer from './configSlice';
// Load token from localStorage
const token = localStorage.getItem('token');

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    data: dataReducer,
    optionChain: optionChainReducer,
    tca: tcaReducer,
    config: configReducer,
    auth: authReducer,
    toast: toastReducer,
  },
  preloadedState: {
    auth: {
      token: token,
      isAuthenticated: !!token,
      loading: false,
      error: null,
      user: null
    }
  }
});

export default store;
