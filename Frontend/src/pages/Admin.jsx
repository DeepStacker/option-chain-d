/**
 * Admin Page - Comprehensive Administration Dashboard
 * Tabs: System Health, Users, Cache, Config Manager, Instruments, Settings
 */
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
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
    PlusIcon,
    PencilIcon,
    CheckIcon,
    WrenchScrewdriverIcon,
    AdjustmentsHorizontalIcon,
    ChartBarIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';
import adminService from '../services/adminService';
import { Card, Button, Spinner } from '../components/common';

// ═══════════════════════════════════════════════════════════════════
// Tab Components
// ═══════════════════════════════════════════════════════════════════

const SystemHealthTab = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

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
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Health</h3>
                <button
                    onClick={fetchHealth}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
    const [total, setTotal] = useState(0);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.listUsers(page, 10);
            setUsers(data.items || data.data || []);
            setTotalPages(data.pages || 1);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            toast.error('Failed to load users');
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
            toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update user status');
        }
    };

    const toggleAdminRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const confirmMsg = newRole === 'admin' 
            ? `Grant admin privileges to ${user.email}?` 
            : `Revoke admin privileges from ${user.email}?`;
        
        if (!confirm(confirmMsg)) return;
        
        try {
            await adminService.updateUser(user.id, { role: newRole });
            toast.success(`${user.email} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update user role');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <p className="text-sm text-gray-500">{total} total users</p>
                </div>
                <button onClick={fetchUsers} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="w-full">
                    <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                        <tr>
                            <th className="text-left py-3 px-4">User</th>
                            <th className="text-left py-3 px-4">Role</th>
                            <th className="text-left py-3 px-4">Provider</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Last Login</th>
                            <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        {user.profile_image ? (
                                            <img src={user.profile_image} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                <UsersIcon className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{user.username || user.email?.split('@')[0]}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        user.role === 'admin' ? 'bg-purple-500 text-white' : 
                                        user.role === 'premium' ? 'bg-yellow-500 text-black' : 
                                        'bg-gray-500 text-white'
                                    }`}>
                                        {user.role?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-sm">{user.login_provider || 'email'}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleAdminRole(user)}
                                            className={`px-3 py-1 rounded text-xs font-medium ${
                                                user.role === 'admin' 
                                                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                            }`}
                                        >
                                            {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                        <button
                                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                                            className={`px-3 py-1 rounded text-xs ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                        >
                                            {user.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan="6" className="py-8 text-center text-gray-500">No users found. Users are added when they log in via Google.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Showing {users.length} of {total} users</span>
                <div className="flex gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50">
                        Previous
                    </button>
                    <span className="px-3 py-1">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const CacheManagerTab = () => {
    const [clearing, setClearing] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const handleClearCache = async (clearAll = false) => {
        setClearing(true);
        try {
            await adminService.clearCache(null, clearAll);
            toast.success(clearAll ? 'All cache cleared!' : 'Options cache cleared!');
        } catch (err) {
            toast.error('Failed to clear cache');
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cache Management</h3>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'} border border-yellow-500`}>
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

            <div className="flex flex-wrap gap-4">
                <Button onClick={() => handleClearCache(false)} loading={clearing} variant="secondary">
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Clear Options Cache
                </Button>
                <Button onClick={() => handleClearCache(true)} loading={clearing} variant="danger">
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Clear All Cache
                </Button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: Config Manager Tab
// ═══════════════════════════════════════════════════════════════════

const ConfigManagerTab = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [editConfig, setEditConfig] = useState(null);
    const [showSensitive, setShowSensitive] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newConfig, setNewConfig] = useState({ key: '', value: '', category: 'system', description: '', is_sensitive: false });
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const categories = ['api', 'trading', 'cache', 'features', 'system'];

    const fetchConfigs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.listConfigs(category || null);
            // axios interceptor already unwraps response.data.data to response.data
            setConfigs(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) {
            console.error('Failed to fetch configs:', err);
            toast.error('Failed to load configurations');
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    const handleSave = async (key, value) => {
        try {
            await adminService.updateConfig(key, { value });
            toast.success(`Config "${key}" updated`);
            fetchConfigs();
            setEditConfig(null);
        } catch (err) {
            toast.error('Failed to update config');
        }
    };

    const handleDelete = async (key) => {
        if (!confirm(`Delete config "${key}"?`)) return;
        try {
            await adminService.deleteConfig(key);
            toast.success(`Config "${key}" deleted`);
            fetchConfigs();
        } catch (err) {
            toast.error('Failed to delete config');
        }
    };

    const toggleSensitive = (key) => {
        setShowSensitive(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCreate = async () => {
        if (!newConfig.key || !newConfig.value) {
            toast.error('Key and Value are required');
            return;
        }
        try {
            await adminService.createConfig({
                key: newConfig.key,
                value: newConfig.value,
                category: newConfig.category,
                description: newConfig.description,
                is_sensitive: newConfig.is_sensitive,
                value_type: 'string',
            });
            toast.success(`Config "${newConfig.key}" created`);
            setShowCreateModal(false);
            setNewConfig({ key: '', value: '', category: 'system', description: '', is_sensitive: false });
            fetchConfigs();
        } catch (err) {
            toast.error('Failed to create config: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold">Configuration Manager</h3>
                <div className="flex items-center gap-2">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Config
                    </button>
                    <button onClick={fetchConfigs} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Create Config Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className={`w-full max-w-md p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold mb-4">Create New Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Key *</label>
                                    <input
                                        value={newConfig.key}
                                        onChange={(e) => setNewConfig(p => ({ ...p, key: e.target.value }))}
                                        placeholder="e.g., DHAN_API_TIMEOUT"
                                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Value *</label>
                                    <input
                                        value={newConfig.value}
                                        onChange={(e) => setNewConfig(p => ({ ...p, value: e.target.value }))}
                                        placeholder="e.g., 30"
                                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={newConfig.category}
                                        onChange={(e) => setNewConfig(p => ({ ...p, category: e.target.value }))}
                                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <input
                                        value={newConfig.description}
                                        onChange={(e) => setNewConfig(p => ({ ...p, description: e.target.value }))}
                                        placeholder="What does this config do?"
                                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    />
                                </div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newConfig.is_sensitive}
                                        onChange={(e) => setNewConfig(p => ({ ...p, is_sensitive: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Sensitive (hide value by default)</span>
                                </label>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : (
                <div className="space-y-3">
                    {configs.map((config) => (
                        <Card key={config.key} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-bold text-blue-500">{config.key}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            {config.category}
                                        </span>
                                        {config.is_sensitive && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500">Sensitive</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">{config.description}</div>
                                    
                                    {editConfig === config.key ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                id={`edit-${config.key}`}
                                                defaultValue={config.value}
                                                className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                                            />
                                            <button
                                                onClick={() => handleSave(config.key, document.getElementById(`edit-${config.key}`).value)}
                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                <CheckIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setEditConfig(null)}
                                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <code className={`px-3 py-1 rounded text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                {config.is_sensitive && !showSensitive[config.key] ? '••••••••' : config.value}
                                            </code>
                                            {config.is_sensitive && (
                                                <button onClick={() => toggleSensitive(config.key)} className="text-gray-400 hover:text-gray-600">
                                                    {showSensitive[config.key] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditConfig(config.key)}
                                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(config.key)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {configs.length === 0 && (
                        <Card className="text-center py-12 text-gray-500">
                            No configurations found
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: Instruments Tab
// ═══════════════════════════════════════════════════════════════════

const InstrumentsTab = () => {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editInstrument, setEditInstrument] = useState(null);
    const [formData, setFormData] = useState({
        symbol: '', display_name: '', segment: 'IDX', lot_size: 25,
        tick_size: 0.05, strike_interval: 50, strikes_count: 20, priority: 0, is_active: true
    });
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchInstruments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.listInstruments(!showInactive);
            setInstruments(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) {
            console.error('Failed to fetch instruments:', err);
            toast.error('Failed to load instruments');
        } finally {
            setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => {
        fetchInstruments();
    }, [fetchInstruments]);

    const resetForm = () => {
        setFormData({
            symbol: '', display_name: '', segment: 'IDX', lot_size: 25,
            tick_size: 0.05, strike_interval: 50, strikes_count: 20, priority: 0, is_active: true
        });
    };

    const openEditModal = (inst) => {
        setFormData({
            symbol: inst.symbol, display_name: inst.display_name || '',
            segment: inst.segment || 'IDX', lot_size: inst.lot_size || 25,
            tick_size: inst.tick_size || 0.05, strike_interval: inst.strike_interval || 50,
            strikes_count: inst.strikes_count || 20, priority: inst.priority || 0, is_active: inst.is_active
        });
        setEditInstrument(inst);
    };

    const handleCreate = async () => {
        if (!formData.symbol) {
            toast.error('Symbol is required');
            return;
        }
        try {
            await adminService.createInstrument(formData);
            toast.success(`Instrument "${formData.symbol}" created`);
            setShowCreateModal(false);
            resetForm();
            fetchInstruments();
        } catch (err) {
            toast.error('Failed to create instrument: ' + (err.message || err));
        }
    };

    const handleUpdate = async () => {
        try {
            await adminService.updateInstrument(editInstrument.id, formData);
            toast.success(`${formData.symbol} updated`);
            setEditInstrument(null);
            resetForm();
            fetchInstruments();
        } catch (err) {
            toast.error('Failed to update instrument');
        }
    };

    const handleDelete = async (inst) => {
        if (!confirm(`Delete instrument "${inst.symbol}"? This cannot be undone.`)) return;
        try {
            await adminService.deleteInstrument(inst.id);
            toast.success(`${inst.symbol} deleted`);
            fetchInstruments();
        } catch (err) {
            toast.error('Failed to delete instrument');
        }
    };

    const toggleActive = async (inst) => {
        try {
            await adminService.updateInstrument(inst.id, { is_active: !inst.is_active });
            toast.success(`${inst.symbol} ${inst.is_active ? 'deactivated' : 'activated'}`);
            fetchInstruments();
        } catch (err) {
            toast.error('Failed to update instrument');
        }
    };

    const InstrumentModal = ({ isEdit, onClose, onSubmit }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`w-full max-w-lg p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">{isEdit ? 'Edit Instrument' : 'Create New Instrument'}</h3>
                <div className="grid gap-4 grid-cols-2">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Symbol *</label>
                        <input
                            value={formData.symbol}
                            onChange={(e) => setFormData(p => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                            placeholder="e.g., NIFTY"
                            disabled={isEdit}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${isEdit ? 'opacity-50' : ''}`}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Display Name</label>
                        <input
                            value={formData.display_name}
                            onChange={(e) => setFormData(p => ({ ...p, display_name: e.target.value }))}
                            placeholder="e.g., Nifty 50"
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Segment</label>
                        <select
                            value={formData.segment}
                            onChange={(e) => setFormData(p => ({ ...p, segment: e.target.value }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                            <option value="IDX">Index (IDX)</option>
                            <option value="EQ">Equity (EQ)</option>
                            <option value="COMM">Commodity</option>
                            <option value="CUR">Currency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Lot Size</label>
                        <input
                            type="number"
                            value={formData.lot_size}
                            onChange={(e) => setFormData(p => ({ ...p, lot_size: parseInt(e.target.value) || 1 }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tick Size</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.tick_size}
                            onChange={(e) => setFormData(p => ({ ...p, tick_size: parseFloat(e.target.value) || 0.05 }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Strike Interval</label>
                        <input
                            type="number"
                            value={formData.strike_interval}
                            onChange={(e) => setFormData(p => ({ ...p, strike_interval: parseFloat(e.target.value) || 50 }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Strikes Count</label>
                        <input
                            type="number"
                            value={formData.strikes_count}
                            onChange={(e) => setFormData(p => ({ ...p, strikes_count: parseInt(e.target.value) || 20 }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <input
                            type="number"
                            value={formData.priority}
                            onChange={(e) => setFormData(p => ({ ...p, priority: parseInt(e.target.value) || 0 }))}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                                className="rounded"
                            />
                            <span className="text-sm">Active</span>
                        </label>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold">Trading Instruments</h3>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="rounded"
                        />
                        Show Inactive
                    </label>
                    <button
                        onClick={() => { resetForm(); setShowCreateModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Instrument
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <InstrumentModal 
                        isEdit={false} 
                        onClose={() => setShowCreateModal(false)} 
                        onSubmit={handleCreate} 
                    />
                )}
                {editInstrument && (
                    <InstrumentModal 
                        isEdit={true} 
                        onClose={() => { setEditInstrument(null); resetForm(); }} 
                        onSubmit={handleUpdate} 
                    />
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {instruments.map((inst) => (
                        <Card key={inst.id} className={`p-4 ${!inst.is_active ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold">{inst.symbol}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${inst.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {inst.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Display:</span>
                                    <span>{inst.display_name || inst.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Segment:</span>
                                    <span>{inst.segment || 'IDX'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Lot Size:</span>
                                    <span>{inst.lot_size || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Strike Interval:</span>
                                    <span>{inst.strike_interval || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Strikes:</span>
                                    <span>{inst.strikes_count || 20}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => openEditModal(inst)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    <PencilIcon className="w-4 h-4 inline mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => toggleActive(inst)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                                        inst.is_active 
                                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {inst.is_active ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                    onClick={() => handleDelete(inst)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}
                    {instruments.length === 0 && (
                        <Card className="col-span-full text-center py-12 text-gray-500">
                            No instruments found. Click "Add Instrument" to create one.
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: Settings Overview Tab
// ═══════════════════════════════════════════════════════════════════

const SettingsOverviewTab = () => {
    const [runtimeSettings, setRuntimeSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getRuntimeSettings();
            // axios interceptor unwraps response - data might be the settings object directly
            setRuntimeSettings(typeof data === 'object' && !Array.isArray(data) && !data?.data ? data : (data?.data || {}));
        } catch (err) {
            console.error('Failed to fetch runtime settings:', err);
            toast.error('Failed to load runtime settings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleReseed = async () => {
        setSeeding(true);
        try {
            const result = await adminService.seedDatabase();
            toast.success(result.message || 'Database re-seeded');
            // Refresh config tab data if needed
        } catch (err) {
            toast.error('Failed to re-seed database');
        } finally {
            setSeeding(false);
        }
    };

    const categoryColors = {
        application: 'text-purple-500',
        server: 'text-blue-500',
        database: 'text-green-500',
        redis: 'text-red-500',
        api: 'text-orange-500',
        websocket: 'text-cyan-500',
        security: 'text-pink-500',
        trading: 'text-yellow-500',
        logging: 'text-gray-500',
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold">Runtime Settings (.env)</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReseed}
                        disabled={seeding}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        <PlusIcon className="w-5 h-5" />
                        {seeding ? 'Seeding...' : 'Re-seed Defaults'}
                    </button>
                    <button onClick={fetchSettings} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(runtimeSettings || {}).map(([category, settings]) => (
                    <Card key={category} className="p-4">
                        <h4 className={`font-bold mb-3 capitalize ${categoryColors[category] || 'text-blue-500'}`}>
                            {category}
                        </h4>
                        <div className="space-y-2">
                            {Object.entries(settings || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-mono text-xs">{key}</span>
                                    <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <Card className={`p-4 ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'} border border-yellow-500/30`}>
                <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-yellow-700 dark:text-yellow-300">Read-Only Settings</div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">
                            These values are loaded from the server's .env file and cannot be changed via UI.
                            Use the <strong>Config</strong> tab to manage dynamic runtime settings stored in the database.
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: API Keys Management Tab
// ═══════════════════════════════════════════════════════════════════

const APIKeysTab = () => {
    const [apiConfigs, setApiConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSecrets, setShowSecrets] = useState({});
    const [editKey, setEditKey] = useState(null);
    const [editValue, setEditValue] = useState('');
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchApiConfigs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.listConfigs('api');
            const configs = Array.isArray(data) ? data : (data?.data || []);
            setApiConfigs(configs);
        } catch (err) {
            console.error('Failed to fetch API configs:', err);
            toast.error('Failed to load API configurations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApiConfigs();
    }, [fetchApiConfigs]);

    const toggleSecret = (key) => {
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const startEdit = (config) => {
        setEditKey(config.key);
        setEditValue(config.value);
    };

    const saveEdit = async () => {
        try {
            await adminService.updateConfig(editKey, { value: editValue });
            toast.success(`${editKey} updated successfully`);
            setEditKey(null);
            setEditValue('');
            fetchApiConfigs();
        } catch (err) {
            toast.error('Failed to update configuration');
        }
    };

    const cancelEdit = () => {
        setEditKey(null);
        setEditValue('');
    };

    const maskValue = (value, show = false) => {
        if (!value) return <span className="text-gray-400 italic">Not set</span>;
        if (show) return value;
        if (value.length <= 8) return '••••••••';
        return value.substring(0, 4) + '••••••••' + value.substring(value.length - 4);
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">API Keys & Tokens</h3>
                    <p className="text-sm text-gray-500">Manage sensitive API credentials securely</p>
                </div>
                <button onClick={fetchApiConfigs} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <Card className={`p-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'} border border-red-500/30`}>
                <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-red-700 dark:text-red-300">Security Notice</div>
                        <div className="text-sm text-red-600 dark:text-red-400">
                            API tokens are sensitive credentials. Never share them publicly. 
                            Changes take effect immediately.
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                {apiConfigs.filter(c => c.is_sensitive || c.key.includes('TOKEN') || c.key.includes('KEY') || c.key.includes('SECRET')).map((config) => (
                    <Card key={config.key} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-blue-500">{config.display_name || config.key}</span>
                                    {config.is_sensitive && (
                                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500">Sensitive</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">{config.description}</div>
                                
                                {editKey === config.key ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type={showSecrets[config.key] ? 'text' : 'password'}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder="Enter new value..."
                                            className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                                        />
                                        <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={cancelEdit} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <code className={`px-3 py-1 rounded text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'} font-mono`}>
                                            {config.is_sensitive ? maskValue(config.value, showSecrets[config.key]) : config.value}
                                        </code>
                                        {config.is_sensitive && (
                                            <button onClick={() => toggleSecret(config.key)} className="text-gray-400 hover:text-gray-600">
                                                {showSecrets[config.key] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {editKey !== config.key && (
                                <button
                                    onClick={() => startEdit(config)}
                                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}

                {apiConfigs.filter(c => !c.is_sensitive && !c.key.includes('TOKEN') && !c.key.includes('KEY')).length > 0 && (
                    <>
                        <h4 className="text-md font-semibold mt-6">Other API Settings</h4>
                        {apiConfigs.filter(c => !c.is_sensitive && !c.key.includes('TOKEN') && !c.key.includes('KEY')).map((config) => (
                            <Card key={config.key} className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="font-medium">{config.display_name || config.key}</div>
                                        <div className="text-sm text-gray-500 mb-2">{config.description}</div>
                                        {editKey === config.key ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                                                />
                                                <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={cancelEdit} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <code className={`px-3 py-1 rounded text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{config.value}</code>
                                        )}
                                    </div>
                                    {editKey !== config.key && (
                                        <button onClick={() => startEdit(config)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </>
                )}

                {apiConfigs.length === 0 && (
                    <Card className="text-center py-12 text-gray-500">
                        No API configurations found. Run the database seeder to create default configs.
                    </Card>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: System Monitoring Tab
// ═══════════════════════════════════════════════════════════════════

const MonitoringTab = () => {
    const [metrics, setMetrics] = useState(null);
    const [dbStats, setDbStats] = useState(null);
    const [redisStats, setRedisStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchAll = useCallback(async () => {
        try {
            const [sysData, dbData, redisData] = await Promise.all([
                adminService.getSystemMetrics(),
                adminService.getDatabaseStats(),
                adminService.getRedisStats(),
            ]);
            setMetrics(Array.isArray(sysData) ? null : (sysData?.data || sysData));
            setDbStats(Array.isArray(dbData) ? null : (dbData?.data || dbData));
            setRedisStats(Array.isArray(redisData) ? null : (redisData?.data || redisData));
        } catch (err) {
            console.error('Failed to fetch metrics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(fetchAll, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchAll]);

    const formatBytes = (bytes) => {
        if (!bytes) return 'N/A';
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb >= 1) return `${gb.toFixed(2)} GB`;
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    const GaugeCard = ({ title, value, max, unit, color }) => {
        const percent = max ? Math.min((value / max) * 100, 100) : value;
        return (
            <Card className="p-4">
                <div className="text-sm text-gray-500 mb-2">{title}</div>
                <div className="text-2xl font-bold mb-2">{typeof value === 'number' ? value.toFixed(1) : value}{unit}</div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                        className={`h-full rounded-full transition-all ${
                            percent > 80 ? 'bg-red-500' : percent > 50 ? 'bg-yellow-500' : color || 'bg-green-500'
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </Card>
        );
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Monitoring</h3>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded"
                        />
                        Auto-refresh (5s)
                    </label>
                    <button onClick={fetchAll} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* System Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <GaugeCard title="CPU Usage" value={metrics?.cpu?.percent || 0} max={100} unit="%" color="bg-blue-500" />
                <GaugeCard title="Memory Usage" value={metrics?.memory?.percent || 0} max={100} unit="%" color="bg-purple-500" />
                <GaugeCard title="Disk Usage" value={metrics?.disk?.percent || 0} max={100} unit="%" color="bg-orange-500" />
                <GaugeCard title="Process Memory" value={formatBytes(metrics?.process?.memory_rss)} max={null} unit="" color="bg-green-500" />
            </div>

            {/* Database Stats */}
            <Card className="p-4">
                <h4 className="font-semibold mb-3">Database</h4>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div><span className="text-gray-500">Size:</span> {formatBytes(dbStats?.database_size_bytes)}</div>
                    <div><span className="text-gray-500">Connections:</span> {dbStats?.active_connections || 0}</div>
                    <div><span className="text-gray-500">Tables:</span> {dbStats?.tables?.length || 0}</div>
                </div>
                {dbStats?.tables?.length > 0 && (
                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                        {dbStats.tables.slice(0, 6).map(t => (
                            <div key={t.name} className={`px-3 py-2 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <div className="font-mono text-sm">{t.name}</div>
                                <div className="text-xs text-gray-500">{t.rows} rows</div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Redis Stats */}
            <Card className="p-4">
                <h4 className="font-semibold mb-3">Redis Cache</h4>
                <div className="grid gap-4 md:grid-cols-4 text-sm">
                    <div><span className="text-gray-500">Status:</span> {redisStats?.connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
                    <div><span className="text-gray-500">Memory:</span> {redisStats?.used_memory || 'N/A'}</div>
                    <div><span className="text-gray-500">Clients:</span> {redisStats?.connected_clients || 0}</div>
                    <div><span className="text-gray-500">Hit Rate:</span> {redisStats?.hit_rate ? `${redisStats.hit_rate}%` : 'N/A'}</div>
                </div>
            </Card>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// NEW: Feature Flags Tab
// ═══════════════════════════════════════════════════════════════════

const FeatureFlagsTab = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState({});
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    const fetchFeatures = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getFeatureFlags();
            setFeatures(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) {
            console.error('Failed to fetch features:', err);
            toast.error('Failed to load feature flags');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures]);

    const handleToggle = async (key, currentValue) => {
        setToggling(prev => ({ ...prev, [key]: true }));
        try {
            await adminService.toggleFeature(key, !currentValue);
            toast.success(`Feature ${!currentValue ? 'enabled' : 'disabled'}`);
            fetchFeatures();
        } catch (err) {
            toast.error('Failed to toggle feature');
        } finally {
            setToggling(prev => ({ ...prev, [key]: false }));
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Feature Flags</h3>
                    <p className="text-sm text-gray-500">Enable or disable application features</p>
                </div>
                <button onClick={fetchFeatures} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <ArrowPathIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {features.map((flag) => (
                    <Card key={flag.key} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="font-medium">{flag.display_name}</div>
                                <div className="text-sm text-gray-500">{flag.description}</div>
                            </div>
                            <button
                                onClick={() => handleToggle(flag.key, flag.enabled)}
                                disabled={toggling[flag.key]}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    flag.enabled 
                                        ? 'bg-green-500' 
                                        : isDark ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    flag.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>
                    </Card>
                ))}
                {features.length === 0 && (
                    <Card className="col-span-full text-center py-12 text-gray-500">
                        No feature flags found. Run the database seeder to create default flags.
                    </Card>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// Main Admin Page
// ═══════════════════════════════════════════════════════════════════

const TABS = [
    { id: 'health', name: 'Health', icon: HeartIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'cache', name: 'Cache', icon: ServerStackIcon },
    { id: 'config', name: 'Config', icon: WrenchScrewdriverIcon },
    { id: 'instruments', name: 'Instruments', icon: ChartBarIcon },
    { id: 'apikeys', name: 'API Keys', icon: ShieldCheckIcon },
    { id: 'monitoring', name: 'Monitoring', icon: ChartBarIcon },
    { id: 'features', name: 'Features', icon: AdjustmentsHorizontalIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
];

const Admin = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('health');
    const [isChecking, setIsChecking] = useState(true);

    // Debug: Log user data to see what we have
    useEffect(() => {
        console.log('🔐 Admin Page - User data:', {
            hasUser: !!user,
            email: user?.email,
            role: user?.role,
            is_admin: user?.is_admin,
        });
    }, [user]);

    // Strict admin role check - user must have explicit admin role from backend
    // role MUST be exactly 'admin' or 'ADMIN' - undefined or other values = not admin
    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';
    
    // Check if user is logged in AND has explicit admin role
    const hasAdminAccess = !!user && isAdmin;

    // Simulate a brief loading state to prevent flash
    useEffect(() => {
        const timer = setTimeout(() => setIsChecking(false), 300);
        return () => clearTimeout(timer);
    }, []);

    // If still checking, show loading
    if (isChecking) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Spinner size="lg" />
            </div>
        );
    }

    // If not logged in, redirect to login
    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Card className="text-center p-8 max-w-md">
                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-4">Please log in to access the admin panel.</p>
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                </Card>
            </div>
        );
    }

    // If logged in but not admin, deny access
    if (!hasAdminAccess) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Card className="text-center p-8 max-w-md">
                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-4">
                        You don't have administrator privileges to access this page.
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                        If you believe this is an error, contact your system administrator.
                    </p>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Panel | DeepStrike</title>
            </Helmet>

            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                    <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                                    <Cog6ToothIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">Admin Panel</h1>
                                    <p className="text-sm text-gray-500">System Administration</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                                : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
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
                    {activeTab === 'config' && <ConfigManagerTab />}
                    {activeTab === 'instruments' && <InstrumentsTab />}
                    {activeTab === 'apikeys' && <APIKeysTab />}
                    {activeTab === 'monitoring' && <MonitoringTab />}
                    {activeTab === 'features' && <FeatureFlagsTab />}
                    {activeTab === 'settings' && <SettingsOverviewTab />}
                </motion.div>
            </div>
        </>
    );
};

export default Admin;
