/**
 * Analytics Dashboard - Main Container
 * Tabbed interface for all analytics modules
 */
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { 
    selectSelectedSymbol, 
    selectSelectedExpiry, 
    selectSpotPrice,
    selectDaysToExpiry,
    selectDataLoading,
    selectOptionChain,
    selectDataSymbol
} from '../context/selectors';
import { fetchLiveData } from '../context/dataSlice';
import { 
    ArrowPathIcon, 
    ChartBarIcon, 
    BeakerIcon,
    ScaleIcon,
    CubeIcon,
    ChartPieIcon,
    PresentationChartBarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

// Import all analysis modules
import OIAnalysis from '../components/analytics/OIAnalysis';
import VolumeAnalysis from '../components/analytics/VolumeAnalysis';
import GreeksAnalysis from '../components/analytics/GreeksAnalysis';
import StraddleAnalysis from '../components/analytics/StraddleAnalysis';
import MultiStrikeAnalysis from '../components/analytics/MultiStrikeAnalysis';
import StrategyBuilder from '../components/analytics/StrategyBuilder';

const tabs = [
    { id: 'oi', label: 'OI Analysis', icon: ChartBarIcon, component: OIAnalysis },
    { id: 'volume', label: 'Volume', icon: PresentationChartBarIcon, component: VolumeAnalysis },
    { id: 'greeks', label: 'Greeks', icon: BeakerIcon, component: GreeksAnalysis },
    { id: 'straddle', label: 'Straddle', icon: ScaleIcon, component: StraddleAnalysis },
    { id: 'multistrike', label: 'Multi-Strike', icon: ChartPieIcon, component: MultiStrikeAnalysis },
    { id: 'strategy', label: 'Strategy', icon: CubeIcon, component: StrategyBuilder },
];

const Analytics = () => {
    const dispatch = useDispatch();
    const symbol = useSelector(selectSelectedSymbol);
    const dataSymbol = useSelector(selectDataSymbol); // Actual loaded data symbol
    const expiry = useSelector(selectSelectedExpiry);
    const spotPrice = useSelector(selectSpotPrice);
    const daysToExpiry = useSelector(selectDaysToExpiry);
    const isLoading = useSelector(selectDataLoading);
    const optionChain = useSelector(selectOptionChain);
    
    // Use dataSymbol if available, otherwise fall back to selected symbol
    const displaySymbol = dataSymbol || symbol || 'NIFTY';
    
    const [activeTab, setActiveTab] = useState('oi');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Refresh data
    const refreshData = useCallback(() => {
        if (symbol && expiry) {
            dispatch(fetchLiveData({ symbol, expiry: String(expiry) }));
            setLastUpdate(new Date());
        }
    }, [dispatch, symbol, expiry]);

    useEffect(() => {
        // Auto-refresh every 30 seconds
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const formatExpiry = (ts) => {
        if (!ts) return '';
        const date = new Date(Number(ts) * 1000);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || OIAnalysis;

    // No data state
    if (!optionChain && !isLoading) {
        return (
            <>
                <Helmet><title>Analytics | Stockify</title></Helmet>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md">
                        <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Data Available</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Please visit the Option Chain page first to load market data.
                        </p>
                        <a 
                            href="/option-chain" 
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Go to Option Chain
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{displaySymbol} Analytics | Stockify</title>
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sticky Header */}
                <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="px-4 py-3">
                        {/* Top row - Symbol info */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                                </div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{displaySymbol}</h1>
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">₹{spotPrice?.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">{formatExpiry(expiry)}</span>
                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs font-medium flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {daysToExpiry} DTE
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 hidden sm:block">
                                    Updated: {lastUpdate.toLocaleTimeString()}
                                </span>
                                <button
                                    onClick={refreshData}
                                    disabled={isLoading}
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                            isActive 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 md:p-6">
                    <ActiveComponent />
                </div>
            </div>
        </>
    );
};

export default Analytics;
