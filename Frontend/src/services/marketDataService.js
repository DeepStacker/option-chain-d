import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const API_URL = `${API_BASE_URL}`;

export const marketDataService = {
    // Get live market data
    getLiveData: async (symbol, expiry) => {
        try {
            const response = await axios.get(`${API_URL}/live-data/`, {
                params: {
                    sid: symbol,
                    exp: expiry
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch live data';
        }
    },

    // Get expiry dates for a symbol
    getExpiryDates: async (symbol) => {
        try {
            const response = await axios.get(`${API_URL}/exp-date/`, {
                params: {
                    sid: symbol
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch expiry dates';
        }
    },

    // Get percentage data
    getPercentageData: async (symbol, expiry, isCe, strike) => {
        try {
            const response = await axios.post(`${API_URL}/percentage-data/`, {
                sid: symbol,
                exp: expiry,
                isCe: isCe,
                strike: strike
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch percentage data';
        }
    },

    // Get IV data
    getIVData: async (symbol, expiry, isCe, strike) => {
        try {
            const response = await axios.post(`${API_URL}/iv-data/`, {
                sid: symbol,
                exp: expiry,
                isCe: isCe,
                strike: strike
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch IV data';
        }
    },

    // Get delta data
    getDeltaData: async (symbol, expiry, strike) => {
        try {
            const response = await axios.post(`${API_URL}/delta-data/`, {
                sid: symbol,
                exp: expiry,
                strike: strike
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch delta data';
        }
    },

    // Get futures data
    getFuturesData: async (symbol, expiry) => {
        try {
            const response = await axios.post(`${API_URL}/fut-data/`, {
                sid: symbol,
                exp: expiry
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch futures data';
        }
    }
};
