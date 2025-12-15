/**
 * Historical API Service
 * Handles endpoints for historical option chain data
 */
import axiosInstance from './config';

const HISTORICAL_BASE = '/historical';

/**
 * Get available historical dates for a symbol
 */
export const getAvailableDates = async (symbol) => {
    const response = await axiosInstance.get(
        `${HISTORICAL_BASE}/dates/${symbol}`
    );
    return response.data;
};

/**
 * Get available snapshot times for a specific date
 */
export const getAvailableTimes = async (symbol, date) => {
    const response = await axiosInstance.get(
        `${HISTORICAL_BASE}/times/${symbol}/${date}`
    );
    return response.data;
};

/**
 * Get a specific historical snapshot
 */
export const getHistoricalSnapshot = async ({
    symbol,
    expiry,
    date,
    time,
}) => {
    const response = await axiosInstance.get(
        `${HISTORICAL_BASE}/snapshot/${symbol}/${expiry}`,
        {
            params: { date, time },
        }
    );
    return response.data;
};

/**
 * Get replay data for a time range
 */
export const getReplayData = async ({
    symbol,
    expiry,
    date,
    startTime = '09:15',
    endTime = '15:30',
    interval = 5,
}) => {
    const response = await axiosInstance.get(
        `${HISTORICAL_BASE}/replay/${symbol}/${expiry}`,
        {
            params: {
                date,
                start_time: startTime,
                end_time: endTime,
                interval,
            },
        }
    );
    return response.data;
};

/**
 * Save current snapshot (admin function)
 */
export const saveCurrentSnapshot = async (symbol, expiry) => {
    const response = await axiosInstance.post(
        `${HISTORICAL_BASE}/snapshot/${symbol}/${expiry}`
    );
    return response.data;
};

export default {
    getAvailableDates,
    getAvailableTimes,
    getHistoricalSnapshot,
    getReplayData,
    saveCurrentSnapshot,
};
