import { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getStrikeTimeSeries } from '../../../api/analyticsApi';

/**
 * Simple Line Chart Component
 */
const MiniLineChart = memo(({ data, width = 400, height = 200 }) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + ((maxVal - d.value) / range) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const isPositive = lastValue >= firstValue;

    return (
        <svg width={width} height={height} className="mx-auto">
            {/* Grid lines */}
            <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            
            {/* Y-axis labels */}
            <text x="5" y={padding + 5} className="fill-gray-400 text-[10px]">{maxVal.toFixed(0)}</text>
            <text x="5" y={height - padding + 5} className="fill-gray-400 text-[10px]">{minVal.toFixed(0)}</text>
            
            {/* Area under curve */}
            <polygon
                points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
                fill="url(#chartGradient)"
            />
            
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            
            {/* End dot */}
            <circle
                cx={width - padding}
                cy={padding + ((maxVal - lastValue) / range) * chartHeight}
                r="4"
                fill={isPositive ? '#10B981' : '#EF4444'}
            />
        </svg>
    );
});

MiniLineChart.displayName = 'MiniLineChart';

/**
 * Modal for displaying time-series data when a cell is clicked
 */
const CellDetailModal = memo(({ isOpen, onClose, cellData }) => {
    const [activeTab, setActiveTab] = useState('chart');
    const [selectedField, setSelectedField] = useState('oi');
    const [timeSeriesData, setTimeSeriesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { strike, side, field, value, symbol, fullData } = cellData || {};

    // Fetch time-series data
    const fetchData = useCallback(async () => {
        if (!symbol || !strike || !side) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const data = await getStrikeTimeSeries({
                symbol,
                strike,
                optionType: side.toUpperCase(),
                field: selectedField,
                interval: '5m',
                limit: 50,
            });
            setTimeSeriesData(data);
        } catch (err) {
            console.error('Failed to fetch time-series:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [symbol, strike, side, selectedField]);

    // Fetch on mount and field change
    useEffect(() => {
        if (isOpen && cellData) {
            // Set initial field from clicked cell
            if (field && ['OI', 'oi', 'oichng', 'ltp', 'iv', 'volume'].includes(field)) {
                setSelectedField(field === 'OI' ? 'oi' : field === 'oichng' ? 'oi' : field);
            }
            fetchData();
        }
    }, [isOpen, cellData, fetchData, field]);

    if (!isOpen || !cellData) return null;

    const sideLabel = side === 'ce' ? 'Call' : 'Put';
    const sideColor = side === 'ce' ? 'text-green-600' : 'text-red-600';
    const sideBg = side === 'ce' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

    const fieldLabels = {
        oi: 'Open Interest',
        ltp: 'Last Traded Price',
        iv: 'Implied Volatility',
        volume: 'Volume',
        delta: 'Delta',
        theta: 'Theta',
    };

    const ce = fullData?.ce || {};
    const pe = fullData?.pe || {};
    const optData = side === 'ce' ? ce : pe;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${sideBg} ${sideColor}`}>
                                {sideLabel}
                            </span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Strike {strike}
                                </h3>
                                <p className="text-sm text-gray-500">{symbol} • {optData.disp_sym || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
                        <button
                            onClick={() => setActiveTab('chart')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'chart'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <ChartBarIcon className="w-4 h-4 inline-block mr-1.5" />
                            Chart
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'details'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <ArrowTrendingUpIcon className="w-4 h-4 inline-block mr-1.5" />
                            Details
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'chart' && (
                            <div className="space-y-4">
                                {/* Field Selector */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {Object.entries(fieldLabels).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedField(key);
                                                fetchData();
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                selectedField === key
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={fetchData}
                                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        title="Refresh"
                                    >
                                        <ArrowPathIcon className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>

                                {/* Chart Area */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                    {loading ? (
                                        <div className="h-52 flex items-center justify-center">
                                            <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
                                        </div>
                                    ) : error ? (
                                        <div className="h-52 flex items-center justify-center text-red-500">
                                            {error}
                                        </div>
                                    ) : timeSeriesData?.data ? (
                                        <MiniLineChart data={timeSeriesData.data} width={600} height={200} />
                                    ) : (
                                        <div className="h-52 flex items-center justify-center text-gray-400">
                                            No data available
                                        </div>
                                    )}
                                </div>

                                {/* Summary Stats */}
                                {timeSeriesData?.summary && (
                                    <div className="grid grid-cols-5 gap-2">
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                            <div className="text-[10px] text-gray-500 uppercase">Min</div>
                                            <div className="text-sm font-semibold">{timeSeriesData.summary.min?.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                            <div className="text-[10px] text-gray-500 uppercase">Max</div>
                                            <div className="text-sm font-semibold">{timeSeriesData.summary.max?.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                            <div className="text-[10px] text-gray-500 uppercase">Avg</div>
                                            <div className="text-sm font-semibold">{timeSeriesData.summary.avg?.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                            <div className="text-[10px] text-gray-500 uppercase">Current</div>
                                            <div className="text-sm font-semibold">{timeSeriesData.summary.current?.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                                            <div className="text-[10px] text-gray-500 uppercase">Change</div>
                                            <div className={`text-sm font-semibold ${timeSeriesData.summary.change_from_start >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {timeSeriesData.summary.change_from_start >= 0 ? '+' : ''}{timeSeriesData.summary.change_from_start?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                {/* Current Values Grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">LTP</div>
                                        <div className="text-lg font-bold">{optData.ltp?.toFixed(2) || '—'}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Open Interest</div>
                                        <div className="text-lg font-bold">{(optData.OI || optData.oi)?.toLocaleString() || '—'}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">IV</div>
                                        <div className="text-lg font-bold text-blue-600">{optData.iv?.toFixed(2) || '—'}%</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Volume</div>
                                        <div className="text-lg font-bold">{(optData.volume || optData.vol)?.toLocaleString() || '—'}</div>
                                    </div>
                                </div>

                                {/* Greeks */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Greeks</h4>
                                    <div className="grid grid-cols-6 gap-2 text-center text-xs">
                                        {['delta', 'gamma', 'theta', 'vega', 'rho', 'vanna'].map(greek => (
                                            <div key={greek}>
                                                <div className="text-gray-500 uppercase">{greek}</div>
                                                <div className="font-medium text-gray-900 dark:text-white mt-1">
                                                    {optData.optgeeks?.[greek]?.toFixed(4) || '—'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Buildup Info */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">Buildup:</span>
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {optData.BuiltupName || optData.btyp || 'Unknown'}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-auto">
                                        Moneyness: <span className="font-medium">{optData.mness === 'I' ? 'ITM' : 'OTM'}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

CellDetailModal.displayName = 'CellDetailModal';

CellDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    cellData: PropTypes.shape({
        strike: PropTypes.number,
        side: PropTypes.string,
        field: PropTypes.string,
        value: PropTypes.any,
        symbol: PropTypes.string,
        sid: PropTypes.number,
        fullData: PropTypes.object,
    }),
};

export default CellDetailModal;
