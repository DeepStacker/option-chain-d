import React, { createContext, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  fetchExpiryDate,
  setExp_sid,  // Changed from setExp to setExp_sid
  startLiveStream,
  stopLiveStream,
  setSidAndFetchData,
  fetchLiveData,
} from "./dataSlice";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from "./store";
import { checkTokenExpiry } from './authSlice';

// Create a context for app-wide state management
export const AppContext = createContext();

// Create memoized selectors
const selectUser = (state) => state.auth.user;  
const selectToken = (state) => state.auth.token;
const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
const selectTheme = (state) => state.theme.theme;
const selectIsReversed = (state) => state.theme.isReversed;
const selectIsHighlighting = (state) => state.theme.isHighlighting;
const selectData = (state) => state.data.data;
const selectExp = (state) => state.data.exp;
const selectSymbol = (state) => state.data.symbol;
const selectExpDate = (state) => state.data.expDate;
const selectIsOc = (state) => state.data.isOc;
const selectIsStreaming = (state) => state.data.isStreaming;
const selectExp_sid = (state) => state.data.exp_sid;

const selectAppState = createSelector(
  [
    selectUser,
    selectToken,
    selectIsAuthenticated,
    selectTheme,
    selectIsReversed,
    selectIsHighlighting,
    selectData,
    selectExp,
    selectSymbol,
    selectExpDate,
    selectIsOc,
    selectIsStreaming,
    selectExp_sid,
  ],
  (
    user,
    token,
    isAuthenticated,
    theme,
    isReversed,
    isHighlighting,
    data,
    exp,
    symbol,
    expDate,
    isOc,
    isStreaming,
    exp_sid
  ) => ({
    user,
    token,
    isAuthenticated,
    theme,
    isReversed,
    isHighlighting,
    data,
    exp,
    symbol,
    expDate,
    isOc,
    isStreaming,
    exp_sid,
  })
);

export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socketInitialized = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkTokenExpiry(dispatch);
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const {
    user,
    token,
    isAuthenticated,
    theme,
    isReversed,
    isHighlighting,
    data,
    exp,
    symbol,
    expDate,
    isOc,
    isStreaming,
    exp_sid,
  } = useSelector(selectAppState);

  // Set up axios auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Initialize data when symbol changes
  useEffect(() => {
    if (isAuthenticated && isOc && symbol) {
      dispatch(setSidAndFetchData(symbol));
    }
  }, [dispatch, symbol, isAuthenticated, isOc]);

  // Fetch expiry dates when the symbol changes and user is authenticated
  const fetchExpiryDates = useCallback(() => {
    if (symbol && isAuthenticated && isOc) {  
      dispatch(fetchExpiryDate({ sid: symbol, exp }));
    }
  }, [dispatch, symbol, isAuthenticated, exp, isOc]);  

  useEffect(() => {
    fetchExpiryDates();
  }, [fetchExpiryDates]);

  // Fetch live data when expiry changes
  useEffect(() => {
    if (isAuthenticated && isOc && symbol && exp_sid) {
      dispatch(fetchLiveData({ sid: symbol, exp_sid }));
    }
  }, [dispatch, symbol, exp_sid, isAuthenticated, isOc]);

  // Update expiry when expiry list changes
  useEffect(() => {
    if (data?.fut?.data?.explist?.length && isOc) {  
      const firstExpiry = data.fut.data.explist[0];
      if (firstExpiry) {
        dispatch(setExp_sid(firstExpiry));  
      }
    }
  }, [dispatch, symbol, isOc]);  

  // Manage WebSocket streaming state
  useEffect(() => {
    if (!isOc || !isAuthenticated) {
      // Stop the live stream if Open Chain is disabled or user is not authenticated
      if (isStreaming) {
        dispatch(stopLiveStream());
        socketInitialized.current = false;  
      }
      return;
    }

    if (!socketInitialized.current && isAuthenticated) {
      // Initialize WebSocket only once and when authenticated
      socketInitialized.current = true;
      dispatch(startLiveStream());
    }

    return () => {
      if (isStreaming) {
        dispatch(stopLiveStream());
        socketInitialized.current = false;
      }
    };
  }, [dispatch, exp, symbol, isOc, isStreaming, isAuthenticated]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    theme,
    isReversed,
    isHighlighting,
    data,
    exp,
    symbol,
    expDate,
    isOc,
    isStreaming,
    exp_sid,
  };

    return (
      <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    );
  };
  
  export const AppWrapper = ({ children }) => {
    return (
      <AppProvider>
        {children}
      </AppProvider>
    );
  };
