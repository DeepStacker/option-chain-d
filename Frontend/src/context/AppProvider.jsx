import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import logger from "../utils/logger";

import {
  setExp_sid,
  stopLiveStream,
  setSidAndFetchData,
  updateLiveData,
  fetchLiveData,
  setStreamingState,
  setConnectionMethod,
} from "./dataSlice";
import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeAuth } from "./authSlice";
import { tokenManager } from "./authSlice";

import { AppContext } from "./AppContext";
import { selectAppState, selectSelectedSymbol, selectSelectedExpiry } from "./selectors";
import useSocket from "../hooks/useSocket";



export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const tokenCheckInterval = useRef(null);
  const pollTimerRef = useRef(null);
  const currentSubscriptionRef = useRef(null);

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

  // Get selected symbol and expiry for global WebSocket subscription
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const selectedExpiry = useSelector(selectSelectedExpiry);

  // Check if expiry is valid
  const isExpiryValid = selectedExpiry && typeof selectedExpiry === 'number' && selectedExpiry > 0;

  // Global WebSocket data handler - updates Redux store
  const handleWebSocketData = useCallback((wsData) => {
    if (wsData?.type === 'error') {
      console.warn('Global WebSocket error:', wsData.message);
      return;
    }

    if (wsData && (wsData.oc || wsData.spot || wsData.futures)) {
      dispatch(updateLiveData(wsData));
    }
  }, [dispatch]);

  // Global WebSocket connection for options data
  const {
    isConnected: wsConnected,
    error: wsError,
    subscribe,
    unsubscribe,
    subscription
  } = useSocket(handleWebSocketData, { enabled: isAuthenticated && isOc });

  // Update streaming state in Redux
  useEffect(() => {
    dispatch(setStreamingState(wsConnected && !!subscription));
    dispatch(setConnectionMethod(wsConnected && !!subscription ? 'websocket' : 'api'));
  }, [wsConnected, subscription, dispatch]);

  // Global WebSocket subscription - subscribes when symbol/expiry are valid
  useEffect(() => {
    if (!wsConnected || !isAuthenticated || !isOc) return;
    if (!selectedSymbol || !isExpiryValid) return;

    const newKey = `${selectedSymbol}:${selectedExpiry}`;

    // Already subscribed to this combination
    if (currentSubscriptionRef.current === newKey) return;

    // Unsubscribe from previous if different
    if (currentSubscriptionRef.current) {
      logger.log('📡 Global: Unsubscribing from:', currentSubscriptionRef.current);
      unsubscribe();
    }

    // Subscribe to new symbol+expiry
    logger.log('📡 Global: Subscribing to:', selectedSymbol, selectedExpiry);
    subscribe(selectedSymbol, String(selectedExpiry));
    currentSubscriptionRef.current = newKey;

  }, [wsConnected, selectedSymbol, selectedExpiry, isExpiryValid, isAuthenticated, isOc, subscribe, unsubscribe]);

  // Global polling fallback - when WebSocket is not connected
  useEffect(() => {
    // Clear existing interval
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    // Skip polling if WebSocket is active
    if (wsConnected && subscription && !wsError) {
      logger.log('📡 Global: WebSocket active, polling disabled');
      return;
    }

    // Skip if not authenticated or no symbol
    if (!isAuthenticated || !isOc || !selectedSymbol) return;

    // Start polling as fallback
    logger.log('⏱️ Global: Starting REST polling (WebSocket fallback)');

    const fetchData = () => {
      dispatch(fetchLiveData({
        symbol: selectedSymbol,
        expiry: isExpiryValid ? String(selectedExpiry) : null
      }));
    };

    fetchData(); // Initial fetch
    pollTimerRef.current = setInterval(fetchData, 3000); // Poll every 3s

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [wsConnected, subscription, wsError, isAuthenticated, isOc, selectedSymbol, selectedExpiry, isExpiryValid, dispatch]);

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
