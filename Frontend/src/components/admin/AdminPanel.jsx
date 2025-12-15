import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
    XMarkIcon,
    Cog6ToothIcon,
    UsersIcon,
    ServerStackIcon,
    TrashIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

import useAdminAccess from '../../hooks/useAdminAccess';
import adminService from '../../services/adminService';

// ═══════════════════════════════════════════════════════════════════
// Tab Components
// ═══════════════════════════════════════════════════════════════════

const SystemHealthTab = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useSelector((state) => state.theme.theme);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const data = await adminService.getHealth();
            setHealth(data);
        } catch (err) {
            console.error('Health check failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
            case 'connected':
                return 'text-green-500';
            case 'degraded':
                return 'text-yellow-500';
            default:
                return 'text-red-500';
        }
    };

    if (loading && !health) {
        return (
            <div className="flex items-center justify-center h-64">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Health</h3>
                <button
                    onClick={fetchHealth}
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="text-sm text-gray-500 mb-1">Overall Status</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.status)}`}>
                        {health?.status?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="text-sm text-gray-500 mb-1">Uptime</div>
                    <div className="text-xl font-bold">
                        {health?.uptime_seconds ? `${Math.floor(health.uptime_seconds / 60)}m` : 'N/A'}
                    </div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="text-sm text-gray-500 mb-1">Database</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.database)}`}>
                        {health?.database?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="text-sm text-gray-500 mb-1">Redis Cache</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.redis)}`}>
                        {health?.redis?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-sm text-gray-500 mb-1">Version</div>
                <div className="font-mono">{health?.version || 'N/A'}</div>
            </div>
        </div>
    );
};

const ConfigManagerTab = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [editValue, setEditValue] = useState('');
    const theme = useSelector((state) => state.theme.theme);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const data = await adminService.listConfigs();
            setConfigs(data.data || []);
        } catch (err) {
            console.error('Failed to fetch configs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleSave = async (key) => {
        try {
            await adminService.updateConfig(key, { value: editValue });
            setEditingKey(null);
            fetchConfigs();
        } catch (err) {
            console.error('Failed to update config:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Configurations</h3>
            <div className="space-y-2">
                {configs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No configurations found</div>
                ) : (
                    configs.map((config) => (
                        <div
                            key={config.key}
                            className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{config.key}</div>
                                    <div className="text-sm text-gray-500">{config.description || 'No description'}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {editingKey === config.key ? (
                                        <>
                                            <input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                                            />
                                            <button
                                                onClick={() => handleSave(config.key)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingKey(null)}
                                                className="px-3 py-1 bg-gray-500 text-white rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <code className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                                {config.value}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    setEditingKey(config.key);
                                                    setEditValue(config.value);
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const UserManagerTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const theme = useSelector((state) => state.theme.theme);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.listUsers(page, 10);
            setUsers(data.items || []);
            setTotalPages(data.pages || 1);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleUserStatus = async (userId, isActive) => {
        try {
            if (isActive) {
                await adminService.deactivateUser(userId);
            } else {
                await adminService.activateUser(userId);
            }
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle user status:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Role</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-2">{user.email}</td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                        className={`px-3 py-1 rounded text-sm ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                            } text-white`}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const CacheManagerTab = () => {
    const [clearing, setClearing] = useState(false);
    const [result, setResult] = useState(null);
    const theme = useSelector((state) => state.theme.theme);

    const handleClearCache = async (clearAll = false) => {
        setClearing(true);
        try {
            const data = await adminService.clearCache(null, clearAll);
            setResult(data);
        } catch (err) {
            console.error('Failed to clear cache:', err);
            setResult({ error: err.message });
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cache Management</h3>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'} border border-yellow-500`}>
                <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-yellow-700 dark:text-yellow-300">Warning</div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">
                            Clearing cache will force all data to be refetched from external APIs.
                            This may temporarily slow down the application.
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={() => handleClearCache(false)}
                    disabled={clearing}
                    className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50`}
                >
                    <TrashIcon className="w-5 h-5" />
                    <span>{clearing ? 'Clearing...' : 'Clear Options Cache'}</span>
                </button>
                <button
                    onClick={() => handleClearCache(true)}
                    disabled={clearing}
                    className={`flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50`}
                >
                    <TrashIcon className="w-5 h-5" />
                    <span>{clearing ? 'Clearing...' : 'Clear All Cache'}</span>
                </button>
            </div>

            {result && (
                <div className={`p-4 rounded-lg ${result.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {result.error ? `Error: ${result.error}` : `Success: ${result.message || 'Cache cleared'}`}
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// Main Admin Panel
// ═══════════════════════════════════════════════════════════════════

const TABS = [
    { id: 'health', name: 'System Health', icon: HeartIcon },
    { id: 'config', name: 'Configurations', icon: Cog6ToothIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'cache', name: 'Cache', icon: ServerStackIcon },
];

const AdminPanel = () => {
    const { isAdminUnlocked, isWaitingForPhrase, lockAdmin } = useAdminAccess();
    const [activeTab, setActiveTab] = useState('health');
    const theme = useSelector((state) => state.theme.theme);

    // Visual indicator when waiting for phrase
    if (isWaitingForPhrase) {
        return (
            <div className="fixed bottom-4 right-4 z-50 p-4 bg-blue-500 text-white rounded-lg shadow-lg animate-pulse">
                🔐 Enter admin phrase...
            </div>
        );
    }

    if (!isAdminUnlocked) {
        return null; // Hidden - no visual presence
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={lockAdmin}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Cog6ToothIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Admin Panel</h2>
                                <p className="text-sm text-gray-500">System Administration</p>
                            </div>
                        </div>
                        <button
                            onClick={lockAdmin}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-500'
                                            : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {activeTab === 'health' && <SystemHealthTab />}
                        {activeTab === 'config' && <ConfigManagerTab />}
                        {activeTab === 'users' && <UserManagerTab />}
                        {activeTab === 'cache' && <CacheManagerTab />}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminPanel;
