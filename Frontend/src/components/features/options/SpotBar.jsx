import { memo } from 'react';
import PropTypes from 'prop-types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

/**
 * Compact Metric
 */
const Metric = memo(({ label, value, change, highlight = false }) => {
    const isPositive = change > 0;

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${highlight ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                {value?.toLocaleString?.() || '—'}
            </span>
            {change !== undefined && change !== 0 && (
                <span className={`flex items-center text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                    {Math.abs(change).toFixed(2)}%
                </span>
            )}
        </div>
    );
});

Metric.displayName = 'Metric';

/**
 * Compact SpotBar - Inline metrics display (no wrapping, ultra compact)
 */
const SpotBar = memo(({ spotData, futuresData, pcr, maxPain }) => {
    return (
        <div className="flex items-center gap-1">
            <Metric label="Spot" value={spotData?.ltp} change={spotData?.change_percent} highlight />
            {futuresData && <Metric label="Fut" value={futuresData.ltp} change={futuresData.change_percent} />}
            <Metric label="PCR" value={pcr?.toFixed(2)} />
            {maxPain && <Metric label="MP" value={maxPain} />}
        </div>
    );
});

SpotBar.displayName = 'SpotBar';

SpotBar.propTypes = {
    spotData: PropTypes.object,
    futuresData: PropTypes.object,
    pcr: PropTypes.number,
    maxPain: PropTypes.number,
};

export default SpotBar;
