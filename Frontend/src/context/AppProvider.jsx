import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import logger from "../utils/logger";

import {
  setExp_sid,
  stopLiveStream,
  setSidAndFetchData,
} from "./dataSlice";
import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeAuth } from "./authSlice";
import { tokenManager } from "./authSlice";

import { AppContext } from "./AppContext";
import { selectAppState } from "./selectors";



export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
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
        logger.log("Token expired, re-initializing auth");
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

  // Initialize data on first mount when auth is complete
  // This handles the INITIAL load only - subsequent symbol changes are handled by OptionControls
  const initialLoadDoneRef = useRef(false);
  
  useEffect(() => {
    logger.debug('🔍 AppProvider effect check:', { 
      authLoading, 
      isAuthenticated, 
      isOc, 
      symbol, 
      initialLoadDone: initialLoadDoneRef.current 
    });
    
    if (!authLoading && isAuthenticated && isOc && symbol && !initialLoadDoneRef.current) {
      logger.log('🚀 Initial data load for:', symbol);
      initialLoadDoneRef.current = true;
      dispatch(setSidAndFetchData({ newSid: symbol }));
    }
  }, [dispatch, symbol, isAuthenticated, authLoading, isOc]);

  // Fetch expiry dates when the symbol changes and user is authenticated
  // Fetch expiry dates when the symbol changes - REMOVED (Handled locally)
  /*
  const fetchExpiryDates = useCallback(() => {
    if (!authLoading && symbol && isAuthenticated && isOc) {
      dispatch(fetchExpiryDate({ sid: symbol, exp }));
    }
  }, [dispatch, symbol, isAuthenticated, authLoading, exp, isOc]);

  useEffect(() => {
    fetchExpiryDates();
  }, [fetchExpiryDates]);
  */

  // Fetch live data when expiry changes
  // Fetch live data when expiry changes - REMOVED (Handled locally)
  /*
  useEffect(() => {
    if (!authLoading && isAuthenticated && isOc && symbol && exp_sid) {
      dispatch(fetchLiveData({ sid: symbol, exp_sid }));
    }
  }, [dispatch, symbol, exp_sid, isAuthenticated, authLoading, isOc]);
  */

  // Update expiry when expiry list changes - fixed dependency array
  useEffect(() => {
    if (!authLoading && data?.fut?.data?.explist?.length && isOc && !exp_sid) {
      const firstExpiry = data.fut.data.explist[0];
      if (firstExpiry) {
        dispatch(setExp_sid(firstExpiry));
      }
    }
  }, [dispatch, data?.fut?.data?.explist, isOc, authLoading, exp_sid]);

  // WebSocket streaming is now handled by individual components using useSocket hook
  useEffect(() => {
    // Cleanup any streaming state if component unmounts or auth changes
    if (authLoading) return;

    if (!isOc || !isAuthenticated) {
      if (isStreaming) {
        dispatch(stopLiveStream());
      }
    }

    return () => {
      if (isStreaming) {
        dispatch(stopLiveStream());
      }
    };
  }, [
    dispatch,
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
