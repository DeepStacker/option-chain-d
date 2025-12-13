/**
 * Analytics API Service
 * Handles all analytics endpoints for charts and time-series data
 */
import axiosInstance from './config';

// Note: baseURL already includes /api/v1, so only add /analytics
const ANALYTICS_BASE = '/analytics';

/**
 * Get time-series data for a specific strike
 */
export const getStrikeTimeSeries = async ({
    symbol,
    strike,
    optionType = 'CE',
    field = 'oi',
    interval = '5m',
    limit = 50,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/timeseries/${symbol}/${strike}`,
        {
            params: {
                option_type: optionType,
                field,
                interval,
                limit,
            },
        }
    );
    return response.data;
};

/**
 * Get spot price time-series
 */
export const getSpotTimeSeries = async ({
    symbol,
    interval = '5m',
    limit = 100,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/timeseries/spot/${symbol}`,
        {
            params: { interval, limit },
        }
    );
    return response.data;
};

/**
 * Get comprehensive strike analysis
 */
export const getStrikeAnalysis = async ({
    symbol,
    strike,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/strike/${symbol}/${strike}`,
        {
            params: { expiry },
        }
    );
    return response.data;
};

/**
 * Get futures summary for all contracts
 */
export const getFuturesSummary = async (symbol) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/futures/${symbol}`
    );
    return response.data;
};

/**
 * Get OI distribution across strikes
 */
export const getOIDistribution = async ({
    symbol,
    expiry,
    topN = 20,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/oi-distribution/${symbol}/${expiry}`,
        {
            params: { top_n: topN },
        }
    );
    return response.data;
};

/**
 * Get max pain analysis
 */
export const getMaxPainAnalysis = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/maxpain/${symbol}/${expiry}`
    );
    return response.data;
};

/**
 * Get IV skew analysis
 */
export const getIVSkew = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/iv-skew/${symbol}/${expiry}`
    );
    return response.data;
};

export default {
    getStrikeTimeSeries,
    getSpotTimeSeries,
    getStrikeAnalysis,
    getFuturesSummary,
    getOIDistribution,
    getMaxPainAnalysis,
    getIVSkew,
};
