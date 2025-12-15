/**
 * Screener API Service
 * Handles endpoints for Scalp, Positional, and S/R screeners
 */
import axiosInstance from './config';

const SCREENER_BASE = '/screeners';

/**
 * Get scalp trading signals
 */
export const getScalpSignals = async ({
    symbol,
    expiry,
    minOiChangePct = 5.0,
    minVolume = 1000,
}) => {
    const response = await axiosInstance.get(
        `${SCREENER_BASE}/scalp/${symbol}/${expiry}`,
        {
            params: {
                min_oi_change_pct: minOiChangePct,
                min_volume: minVolume,
            },
        }
    );
    return response.data;
};

/**
 * Get positional trading signals
 */
export const getPositionalSignals = async ({
    symbol,
    expiry,
    minOiBuildup = 100000,
}) => {
    const response = await axiosInstance.get(
        `${SCREENER_BASE}/positional/${symbol}/${expiry}`,
        {
            params: { min_oi_buildup: minOiBuildup },
        }
    );
    return response.data;
};

/**
 * Get support/resistance trading signals
 */
export const getSRSignals = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${SCREENER_BASE}/sr/${symbol}/${expiry}`
    );
    return response.data;
};

/**
 * Get all screener signals combined
 */
export const getAllSignals = async ({
    symbol,
    expiry,
}) => {
    const response = await axiosInstance.get(
        `${SCREENER_BASE}/all/${symbol}/${expiry}`
    );
    return response.data;
};

export default {
    getScalpSignals,
    getPositionalSignals,
    getSRSignals,
    getAllSignals,
};
