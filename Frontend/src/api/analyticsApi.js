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

/**
 * Get aggregate Change in OI (COI) across all strikes
 * Similar to LOC Calculator's "COi" and "Overall COi" views
 */
export const getAggregateCOI = async ({
    symbol,
    expiry,
    topN = 30,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/aggregate/coi/${symbol}/${expiry}`,
        {
            params: { top_n: topN },
        }
    );
    return response.data;
};

/**
 * Get aggregate OI across all strikes
 * Similar to LOC Calculator's "Oi" and "Overall Oi" views
 */
export const getAggregateOI = async ({
    symbol,
    expiry,
    topN = 30,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/aggregate/oi/${symbol}/${expiry}`,
        {
            params: { top_n: topN },
        }
    );
    return response.data;
};

/**
 * Get aggregate PCR (Put-Call Ratio) across all strikes
 * Similar to LOC Calculator's "PCR" view
 */
export const getAggregatePCR = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/aggregate/pcr/${symbol}/${expiry}`
    );
    return response.data;
};

/**
 * Get aggregate percentage changes across all strikes
 * Similar to LOC Calculator's "Percentage" view
 */
export const getAggregatePercentage = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${ANALYTICS_BASE}/aggregate/percentage/${symbol}/${expiry}`
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
    getAggregateCOI,
    getAggregateOI,
    getAggregatePCR,
    getAggregatePercentage,
};

