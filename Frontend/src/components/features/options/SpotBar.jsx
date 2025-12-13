import { memo } from 'react';
import PropTypes from 'prop-types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

/**
 * Premium Compact Metric Pill
 */
const Metric = memo(({ label, value, change, highlight = false }) => {
    const isPositive = change > 0;
    const isZero = change === 0 || change === undefined;

    return (
        <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-200
            ${highlight 
                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700/50' 
                : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }
            backdrop-blur-md
        `}>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
            <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold tracking-tight ${highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
                    {value?.toLocaleString?.() || '—'}
                </span>
                {!isZero && (
                    <span className={`
                        flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full
                        ${isPositive 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                        }
                    `}>
                        {isPositive ? <ArrowTrendingUpIcon className="w-3 h-3 mr-0.5" /> : <ArrowTrendingDownIcon className="w-3 h-3 mr-0.5" />}
                        {Math.abs(change).toFixed(2)}%
                    </span>
                )}
            </div>
        </div>
    );
});

Metric.displayName = 'Metric';

/**
 * Premium SpotBar - Inline dashboard metrics
 */
const SpotBar = memo(({ spotData, futuresData, pcr, maxPain }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Metric label="Spot" value={spotData?.ltp} change={spotData?.change_percent} highlight />
            {futuresData && <Metric label="Fut" value={futuresData.ltp} change={futuresData.change_percent} />}
            <Metric label="PCR" value={pcr?.toFixed(2)} />
            {maxPain && <Metric label="Max Pain" value={maxPain} />}
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
