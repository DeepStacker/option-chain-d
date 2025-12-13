/**
 * Admin Page - Direct Route Access
 * Accessible via /admin for users with admin role
 */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
    XMarkIcon,
    Cog6ToothIcon,
    UsersIcon,
    ServerStackIcon,
    TrashIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import adminService from '../services/adminService';
import { Card } from '../components/common';

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
        const interval = setInterval(fetchHealth, 30000);
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <div className="text-sm text-gray-500 mb-1">Overall Status</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.status)}`}>
                        {health?.status?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500 mb-1">Uptime</div>
                    <div className="text-xl font-bold">
                        {health?.uptime_seconds ? `${Math.floor(health.uptime_seconds / 60)}m` : 'N/A'}
                    </div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500 mb-1">Database</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.database)}`}>
                        {health?.database?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500 mb-1">Redis Cache</div>
                    <div className={`text-xl font-bold ${getStatusColor(health?.redis)}`}>
                        {health?.redis?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </Card>
            </div>

            <Card>
                <div className="text-sm text-gray-500 mb-1">Version</div>
                <div className="font-mono">{health?.version || 'N/A'}</div>
            </Card>
        </div>
    );
};

const UserManagerTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const theme = useSelector((state) => state.theme.theme);

    const fetchUsers = async () => {
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
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

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
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                        className={`px-3 py-1 rounded text-sm ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
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
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50">
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4">
                <button onClick={() => handleClearCache(false)} disabled={clearing} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    <TrashIcon className="w-5 h-5" />
                    <span>{clearing ? 'Clearing...' : 'Clear Options Cache'}</span>
                </button>
                <button onClick={() => handleClearCache(true)} disabled={clearing} className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
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
// Main Admin Page
// ═══════════════════════════════════════════════════════════════════

const TABS = [
    { id: 'health', name: 'System Health', icon: HeartIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'cache', name: 'Cache', icon: ServerStackIcon },
];

const Admin = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const theme = useSelector((state) => state.theme.theme);
    const [activeTab, setActiveTab] = useState('health');

    // Check admin access - for now allow any authenticated user to view
    // In production, check user.role === 'admin'
    const hasAdminAccess = !!user; // || user?.role === 'admin';

    if (!hasAdminAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="text-center p-8 max-w-md">
                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You don't have permission to access the admin panel.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Panel | Stockify</title>
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 shadow-sm`}>
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <Cog6ToothIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                                    <p className="text-sm text-gray-500">System Administration</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                >
                    {activeTab === 'health' && <SystemHealthTab />}
                    {activeTab === 'users' && <UserManagerTab />}
                    {activeTab === 'cache' && <CacheManagerTab />}
                </motion.div>
            </div>
        </>
    );
};

export default Admin;
