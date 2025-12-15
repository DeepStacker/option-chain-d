/**
 * Notifications API Client
 * Handles all notification-related API calls
 */
import axiosInstance from './config';

const NOTIFICATIONS_BASE = '/api/v1/notifications';

/**
 * Get notifications list
 * @param {number} limit - Maximum number of notifications to fetch
 * @returns {Promise<Object>} Notifications list response
 */
export const getNotifications = async (limit = 20) => {
    const response = await axiosInstance.get(NOTIFICATIONS_BASE, {
        params: { limit }
    });
    return response.data;
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Success response
 */
export const markAsRead = async (notificationId) => {
    const response = await axiosInstance.post(`${NOTIFICATIONS_BASE}/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success response
 */
export const markAllAsRead = async () => {
    const response = await axiosInstance.post(`${NOTIFICATIONS_BASE}/read-all`);
    return response.data;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Success response
 */
export const deleteNotification = async (notificationId) => {
    const response = await axiosInstance.delete(`${NOTIFICATIONS_BASE}/${notificationId}`);
    return response.data;
};

/**
 * Create a new notification (admin/testing)
 * @param {Object} notification - Notification data
 * @param {string} notification.title - Title
 * @param {string} notification.message - Message
 * @param {string} notification.type - Type (info, success, warning, error, trade, price)
 * @param {string} notification.link - Optional link
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (notification) => {
    const response = await axiosInstance.post(NOTIFICATIONS_BASE, notification);
    return response.data;
};

export default {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
};
