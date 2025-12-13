
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveData, fetchExpiryDate, updateLiveData, setStreamingState, setConnectionMethod } from '../context/dataSlice';
import {
    selectSelectedSymbol,
    selectSelectedExpiry,
    selectOptionsData,
    selectSpotData,
    selectFuturesData,
    selectExpiryList,
    selectDataLoading,
} from '../context/selectors';
import useSocket from './useSocket';

/**
 * Custom hook for managing option chain data
 * Uses WebSocket for real-time data, falls back to polling if WebSocket unavailable
 * 
 * Key fixes:
 * - Properly waits for expiry to be set before WebSocket subscription
 * - Uses useMemo for derived values to prevent unnecessary re-renders
 * - Tracks subscription state per symbol+expiry to allow proper re-subscription
 */
export const useOptionsChain = () => {
    const dispatch = useDispatch();

    // Selectors
    const symbol = useSelector(selectSelectedSymbol);
    const expiry = useSelector(selectSelectedExpiry);
    const data = useSelector(selectOptionsData);
    const spotData = useSelector(selectSpotData);
    const futuresData = useSelector(selectFuturesData);
    const expiryList = useSelector(selectExpiryList);
    const isLoading = useSelector(selectDataLoading);

    // Local state
    const [isPaused, setIsPaused] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(3000);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [useWebSocket, setUseWebSocket] = useState(true);

    // Refs for tracking state across renders
    const pollTimerRef = useRef(null);
    const lastFetchedKeyRef = useRef(null); // Track what symbol+expiry we fetched
    const currentSubscriptionRef = useRef(null); // Track current WS subscription

    // Memoized: Check if we have valid data
    const hasData = useMemo(() => {
        return !!(data && data.oc && Object.keys(data.oc).length > 0);
    }, [data]);

    // Memoized: Current subscription key
    const subscriptionKey = useMemo(() => {
        if (!symbol || !expiry) return null;
        return `${symbol}:${expiry}`;
    }, [symbol, expiry]);

    // Memoized: Check if expiry is valid (not default/placeholder)
    const isExpiryValid = useMemo(() => {
        // expiry should be a valid timestamp > 0
        return expiry && typeof expiry === 'number' && expiry > 0;
    }, [expiry]);

    // WebSocket data handler - receives real-time data
    const handleWebSocketData = useCallback((wsData) => {
        // Skip error messages
        if (wsData?.type === 'error') {
            console.warn('WebSocket error:', wsData.message);
            return;
        }

        // Update Redux store with live data
        if (wsData && (wsData.oc || wsData.spot || wsData.futures)) {
            dispatch(updateLiveData(wsData));
            setLastUpdated(new Date());

            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [dispatch, isInitialLoad]);

    // Initialize WebSocket connection - only connect when enabled
    const {
        isConnected: wsConnected,
        error: wsError,
        subscribe,
        unsubscribe,
        subscription
    } = useSocket(handleWebSocketData, { enabled: useWebSocket });

    // Update streaming state in Redux
    useEffect(() => {
        dispatch(setStreamingState(wsConnected && !!subscription));
        dispatch(setConnectionMethod(wsConnected ? 'websocket' : 'api'));
    }, [wsConnected, subscription, dispatch]);

    // Fetch expiry dates when symbol changes
    useEffect(() => {
        if (symbol) {
            dispatch(fetchExpiryDate(symbol));
        }
    }, [symbol, dispatch]);

    // WebSocket subscription - ONLY subscribe when we have valid symbol AND expiry
    useEffect(() => {
        if (!useWebSocket || isPaused || !wsConnected) return;

        // Don't subscribe until we have valid expiry
        if (!symbol || !isExpiryValid) {
            console.log('⏳ Waiting for valid expiry before WebSocket subscription');
            return;
        }

        const newKey = `${symbol}:${expiry}`;

        // Check if we're already subscribed to this combination
        if (currentSubscriptionRef.current === newKey) {
            return; // Already subscribed, no action needed
        }

        // If we had a previous subscription, unsubscribe first
        if (currentSubscriptionRef.current) {
            console.log('📡 Unsubscribing from:', currentSubscriptionRef.current);
            unsubscribe();
        }

        // Subscribe to new symbol+expiry
        console.log('📡 Subscribing to WebSocket:', symbol, expiry);
        subscribe(symbol, String(expiry));
        currentSubscriptionRef.current = newKey;

        return () => {
            // Cleanup on unmount
            if (currentSubscriptionRef.current) {
                unsubscribe();
                currentSubscriptionRef.current = null;
            }
        };
    }, [wsConnected, symbol, expiry, isExpiryValid, isPaused, useWebSocket, subscribe, unsubscribe]);

    // REST API fetch function (fallback or initial load)
    const fetchData = useCallback(async () => {
        if (!symbol || !isExpiryValid || isPaused) return;

        const fetchKey = `${symbol}:${expiry}`;

        try {
            await dispatch(fetchLiveData({ symbol, expiry: String(expiry) })).unwrap();
            setLastUpdated(new Date());
            lastFetchedKeyRef.current = fetchKey;
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        } catch (error) {
            console.error('Failed to fetch option chain data:', error);
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [symbol, expiry, isExpiryValid, isPaused, dispatch, isInitialLoad]);

    // Initial fetch - do one REST fetch for immediate data when symbol+expiry is ready
    useEffect(() => {
        if (!symbol || !isExpiryValid) return;

        const currentKey = `${symbol}:${expiry}`;

        // Only fetch if we haven't fetched this combination yet
        if (lastFetchedKeyRef.current !== currentKey) {
            console.log('📥 Fetching initial data for:', currentKey);
            fetchData();
        }
    }, [symbol, expiry, isExpiryValid, fetchData]);

    // Polling fallback - only if WebSocket is not connected or not subscribed OR if there's an error
    useEffect(() => {
        // Skip polling if WebSocket is connected and streaming AND NO ERROR
        // We trust the connection if it's open and error-free (don't wait for subscription confirmation to stop polling)
        console.log('📊 Polling Check:', { wsConnected, useWebSocket, wsError, subscription });
        if (wsConnected && useWebSocket && !wsError) {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            return;
        }

        // Use polling as fallback
        if (isPaused || !symbol || !isExpiryValid || isInitialLoad) {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            return;
        }

        console.log('⏱️ Starting REST polling (WebSocket fallback)');
        pollTimerRef.current = setInterval(fetchData, refreshInterval);

        return () => {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
            }
        };
    }, [fetchData, refreshInterval, isPaused, symbol, isExpiryValid, isInitialLoad, wsConnected, subscription, useWebSocket, wsError]);

    // Manual refresh handler
    const handleRefresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Toggle pause/resume
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Update polling interval
    const updateInterval = useCallback((newInterval) => {
        setRefreshInterval(newInterval);
    }, []);

    // Toggle WebSocket/Polling mode
    const toggleWebSocket = useCallback(() => {
        setUseWebSocket(prev => !prev);
    }, []);

    // Memoized return object to prevent unnecessary re-renders of consumers
    return useMemo(() => ({
        // Data
        data,
        spotData,
        futuresData,
        expiryList,
        symbol,
        expiry,

        // Status
        isLoading,
        isInitialLoad,
        isPaused,
        lastUpdated,
        refreshInterval,
        hasData,

        // WebSocket status
        isWebSocketConnected: wsConnected,
        isStreaming: wsConnected && !!subscription,
        wsError,
        useWebSocket,

        // Actions
        refresh: handleRefresh,
        togglePause,
        setRefreshInterval: updateInterval,
        toggleWebSocket,
    }), [
        data, spotData, futuresData, expiryList, symbol, expiry,
        isLoading, isInitialLoad, isPaused, lastUpdated, refreshInterval, hasData,
        wsConnected, subscription, wsError, useWebSocket,
        handleRefresh, togglePause, updateInterval, toggleWebSocket
    ]);
};

export default useOptionsChain;
