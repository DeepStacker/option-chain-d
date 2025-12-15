/**
 * Profile API Client
 * Handles user profile management
 */
import axiosInstance from './config';

const PROFILE_BASE = '/api/v1/profile';

/**
 * Get current user's profile
 * @returns {Promise<Object>} Profile data
 */
export const getMyProfile = async () => {
    const response = await axiosInstance.get(`${PROFILE_BASE}/me`);
    return response.data;
};

/**
 * Update current user's profile
 * @param {Object} profileData - Profile update data
 * @returns {Promise<Object>} Updated profile
 */
export const updateMyProfile = async (profileData) => {
    const response = await axiosInstance.put(`${PROFILE_BASE}/me`, profileData);
    return response.data;
};

/**
 * Update notification settings
 * @param {Object} settings - Notification settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateNotificationSettings = async (settings) => {
    const response = await axiosInstance.put(`${PROFILE_BASE}/me/notification-settings`, settings);
    return response.data;
};

/**
 * Get trading statistics
 * @returns {Promise<Object>} Trading stats
 */
export const getMyTradingStats = async () => {
    const response = await axiosInstance.get(`${PROFILE_BASE}/me/stats`);
    return response.data;
};

export default {
    getMyProfile,
    updateMyProfile,
    updateNotificationSettings,
    getMyTradingStats,
};
