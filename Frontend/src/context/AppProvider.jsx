import React, { createContext, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  fetchExpiryDate,
  setExp_sid,
  startLiveStream,
  stopLiveStream,
  setSidAndFetchData,
  fetchLiveData,
} from "./dataSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeAuth } from "./authSlice";
import { tokenManager } from "./authSlice";

// Create a context for app-wide state management
export const AppContext = createContext();

// Create memoized selectors
const selectUser = (state) => state.auth.user;
const selectToken = (state) => state.auth.token;
const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
const selectAuthLoading = (state) => state.auth.authLoading;
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
    selectAuthLoading,
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
    authLoading,
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
    authLoading,
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
  const tokenCheckInterval = useRef(null);

  const {
    user,
    token,
    isAuthenticated,
    authLoading,
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

  // Token expiry check with proper cleanup
  useEffect(() => {
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    tokenCheckInterval.current = setInterval(() => {
      const storedToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (storedToken && tokenManager.isTokenExpired(storedToken)) {
        console.log("Token expired, re-initializing auth");
        dispatch(initializeAuth());
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
      }
    };
  }, [dispatch]);

  // Set up axios auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Initialize data when symbol changes - only when auth is complete
  useEffect(() => {
    if (!authLoading && isAuthenticated && isOc && symbol) {
      dispatch(setSidAndFetchData(symbol));
    }
  }, [dispatch, symbol, isAuthenticated, authLoading, isOc]);

  // Fetch expiry dates when the symbol changes and user is authenticated
  const fetchExpiryDates = useCallback(() => {
    if (!authLoading && symbol && isAuthenticated && isOc) {
      dispatch(fetchExpiryDate({ sid: symbol, exp }));
    }
  }, [dispatch, symbol, isAuthenticated, authLoading, exp, isOc]);

  useEffect(() => {
    fetchExpiryDates();
  }, [fetchExpiryDates]);

  // Fetch live data when expiry changes
  useEffect(() => {
    if (!authLoading && isAuthenticated && isOc && symbol && exp_sid) {
      dispatch(fetchLiveData({ sid: symbol, exp_sid }));
    }
  }, [dispatch, symbol, exp_sid, isAuthenticated, authLoading, isOc]);

  // Update expiry when expiry list changes - fixed dependency array
  useEffect(() => {
    if (!authLoading && data?.fut?.data?.explist?.length && isOc && !exp_sid) {
      const firstExpiry = data.fut.data.explist[0];
      if (firstExpiry) {
        dispatch(setExp_sid(firstExpiry));
      }
    }
  }, [dispatch, data?.fut?.data?.explist, isOc, authLoading, exp_sid]);

  // Manage WebSocket streaming state with proper cleanup
  useEffect(() => {
    // Don't proceed if auth is still loading
    if (authLoading) return;

    if (!isOc || !isAuthenticated) {
      // Stop the live stream if Open Chain is disabled or user is not authenticated
      if (isStreaming && socketInitialized.current) {
        dispatch(stopLiveStream());
        socketInitialized.current = false;
      }
      return;
    }

    if (!socketInitialized.current && isAuthenticated && symbol && exp_sid) {
      // Initialize WebSocket only once and when authenticated with required data
      socketInitialized.current = true;
      dispatch(startLiveStream());
    }

    return () => {
      if (socketInitialized.current && isStreaming) {
        dispatch(stopLiveStream());
        socketInitialized.current = false;
      }
    };
  }, [
    dispatch,
    symbol,
    exp_sid,
    isOc,
    isAuthenticated,
    authLoading,
    isStreaming,
  ]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    authLoading,
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
  return <AppProvider>{children}</AppProvider>;
};
