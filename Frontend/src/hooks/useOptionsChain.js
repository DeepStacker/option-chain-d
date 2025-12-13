
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveData, fetchExpiryDate } from '../context/dataSlice';
import {
    selectSelectedSymbol,
    selectSelectedExpiry,
    selectOptionsData,
    selectSpotData,
    selectFuturesData,
    selectExpiryList,
    selectDataLoading,
} from '../context/selectors';

/**
 * Custom hook for managing option chain data
 * Handles fetching, polling, and state management
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
    const [refreshInterval, setRefreshInterval] = useState(3000); // 3 seconds to reduce load
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const pollTimerRef = useRef(null);
    const hasFetchedRef = useRef(false);

    // Check if we have data
    const hasData = !!(data && data.oc && Object.keys(data.oc).length > 0);

    // Fetch expiry dates when symbol changes
    useEffect(() => {
        if (symbol) {
            dispatch(fetchExpiryDate(symbol));
        }
    }, [symbol, dispatch]);

    // Main data fetching function
    const fetchData = useCallback(async () => {
        if (!symbol || !expiry || isPaused) return;

        try {
            await dispatch(fetchLiveData({ symbol, expiry: String(expiry) })).unwrap();
            setLastUpdated(new Date());
            hasFetchedRef.current = true;
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        } catch (error) {
            console.error('Failed to fetch option chain data:', error);
            // Still mark as not initial load even on error
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [symbol, expiry, isPaused, dispatch, isInitialLoad]);

    // Initial fetch when symbol/expiry changes
    useEffect(() => {
        if (symbol && expiry) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, expiry]);

    // Polling logic - only start after initial load
    useEffect(() => {
        if (isPaused || !symbol || !expiry || isInitialLoad) {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            return;
        }

        // Start polling after initial load
        pollTimerRef.current = setInterval(fetchData, refreshInterval);

        return () => {
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
            }
        };
    }, [fetchData, refreshInterval, isPaused, symbol, expiry, isInitialLoad]);

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

    return {
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

        // Actions
        refresh: handleRefresh,
        togglePause,
        setRefreshInterval: updateInterval,
    };
};

export default useOptionsChain;
