import axiosInstance from '../api/config';

/**
 * Admin Service - Backend Admin API Integration
 * All endpoints require admin role authentication
 */
export const adminService = {
    // ═══════════════════════════════════════════════════════════════════
    // Configuration Management
    // ═══════════════════════════════════════════════════════════════════

    /**
     * List all configurations
     */
    listConfigs: async (category = null) => {
        const params = category ? { category } : {};
        const response = await axiosInstance.get('/admin/config', { params });
        return response.data;
    },

    /**
     * Get configuration by key
     */
    getConfig: async (key) => {
        const response = await axiosInstance.get(`/admin/config/${key}`);
        return response.data;
    },

    /**
     * Create new configuration
     */
    createConfig: async (configData) => {
        const response = await axiosInstance.post('/admin/config', configData);
        return response.data;
    },

    /**
     * Update configuration
     */
    updateConfig: async (key, updateData) => {
        const response = await axiosInstance.put(`/admin/config/${key}`, updateData);
        return response.data;
    },

    /**
     * Delete configuration
     */
    deleteConfig: async (key) => {
        const response = await axiosInstance.delete(`/admin/config/${key}`);
        return response.data;
    },

    // ═══════════════════════════════════════════════════════════════════
    // Instrument Management
    // ═══════════════════════════════════════════════════════════════════

    /**
     * List all instruments
     */
    listInstruments: async (activeOnly = true) => {
        const response = await axiosInstance.get('/admin/instruments', {
            params: { active_only: activeOnly }
        });
        return response.data;
    },

    /**
     * Create new instrument
     */
    createInstrument: async (instrumentData) => {
        const response = await axiosInstance.post('/admin/instruments', instrumentData);
        return response.data;
    },

    /**
     * Update instrument
     */
    updateInstrument: async (instrumentId, updateData) => {
        const response = await axiosInstance.put(`/admin/instruments/${instrumentId}`, updateData);
        return response.data;
    },

    // ═══════════════════════════════════════════════════════════════════
    // User Management
    // ═══════════════════════════════════════════════════════════════════

    /**
     * List all users (paginated)
     */
    listUsers: async (page = 1, pageSize = 20, search = null) => {
        const params = { page, page_size: pageSize };
        if (search) params.search = search;
        const response = await axiosInstance.get('/users', { params });
        return response.data;
    },

    /**
     * Get user by ID
     */
    getUser: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * Update user
     */
    updateUser: async (userId, updateData) => {
        const response = await axiosInstance.put(`/users/${userId}`, updateData);
        return response.data;
    },

    /**
     * Deactivate user
     */
    deactivateUser: async (userId) => {
        const response = await axiosInstance.post(`/users/${userId}/deactivate`);
        return response.data;
    },

    /**
     * Activate user
     */
    activateUser: async (userId) => {
        const response = await axiosInstance.post(`/users/${userId}/activate`);
        return response.data;
    },

    // ═══════════════════════════════════════════════════════════════════
    // Cache Management
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Clear cache
     */
    clearCache: async (pattern = null, clearAll = false) => {
        const response = await axiosInstance.post('/admin/cache/clear', {
            pattern,
            clear_all: clearAll
        });
        return response.data;
    },

    // ═══════════════════════════════════════════════════════════════════
    // Health & System
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get system health
     */
    getHealth: async () => {
        const response = await axiosInstance.get('/health');
        return response.data;
    },
};

export default adminService;
