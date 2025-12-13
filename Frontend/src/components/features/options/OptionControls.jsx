import { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSid, selectSelectedExpiry, selectExpiryList } from '../../../context/selectors';
import { setSidAndFetchData, setExp_sid } from '../../../context/dataSlice';
import { setSymbols } from '../../../context/chartSlice';

/**
 * Compact Option Controls - Symbol, Expiry, and Chart Toggle
 */
const OptionControls = memo(({ showChart, onToggleChart }) => {
    const dispatch = useDispatch();
    const sid = useSelector(selectSid);
    const expiry = useSelector(selectSelectedExpiry);
    const expiryList = useSelector(selectExpiryList);
    const theme = useSelector((state) => state.theme.theme);
    const symbols = useSelector((state) => state.chart.symbols);

    const displaySymbol = sid || 'NIFTY';

    // Fetch symbols if not already loaded
    useEffect(() => {
        if (symbols.length === 0) {
            const fetchSymbols = async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/v1/charts/symbols');
                    const data = await response.json();
                    if (data.success && data.data) {
                        dispatch(setSymbols(data.data));
                    }
                } catch (error) {
                    console.error('Failed to fetch symbols:', error);
                }
            };
            fetchSymbols();
        }
    }, [symbols.length, dispatch]);

    const handleSymbolChange = (e) => {
        dispatch(setSidAndFetchData({ newSid: e.target.value }));
    };

    const handleExpiryChange = (e) => {
        dispatch(setExp_sid(Number(e.target.value)));
    };

    const formatExpiryDate = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    return (
        <div className="flex items-center gap-3 p-1">
            {/* Symbol - Pill Shape */}
            <div className="relative group">
                <select
                    value={displaySymbol}
                    onChange={handleSymbolChange}
                    className={`
                        appearance-none pl-4 pr-8 py-1.5 text-sm font-semibold rounded-full 
                        border transition-all duration-200 cursor-pointer shadow-sm
                        ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-100 hover:border-gray-600 focus:ring-2 focus:ring-emerald-500/50'
                            : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 focus:ring-2 focus:ring-emerald-500/50'
                        }
                    `}
                >
                    {symbols.length > 0 ? (
                        symbols.map((s) => (
                            <option key={s.symbol} value={s.symbol}>
                                {s.symbol}
                            </option>
                        ))
                    ) : (
                        <>
                            <option value="NIFTY">NIFTY</option>
                            <option value="BANKNIFTY">BANKNIFTY</option>
                            <option value="FINNIFTY">FINNIFTY</option>
                        </>
                    )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {/* Expiry - hide in chart mode */}
            {!showChart && (
                <div className="relative group">
                    <select
                        value={expiry || ""}
                        onChange={handleExpiryChange}
                        className={`
                            appearance-none pl-4 pr-8 py-1.5 text-sm font-medium rounded-full 
                            border transition-all duration-200 cursor-pointer shadow-sm
                            ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-600 focus:ring-2 focus:ring-emerald-500/50'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-emerald-500/50'
                            }
                        `}
                    >
                        {expiryList?.map((exp) => (
                            <option key={exp} value={exp}>
                                {formatExpiryDate(exp)}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            )}

            {/* Chart Toggle Button */}
            {onToggleChart && (
                <button
                    onClick={onToggleChart}
                    className={`
                        flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                        transition-all duration-200 border
                        ${showChart 
                            ? theme === 'dark' 
                                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 hover:shadow-emerald-500/20' 
                                : 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600 hover:shadow-emerald-500/20'
                            : theme === 'dark'
                                ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                        }
                    `}
                    title={showChart ? 'View Option Chain Table' : 'View Chart'}
                >
                    {showChart ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Table View
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            Chart View
                        </>
                    )}
                </button>
            )}
        </div>
    );
});

OptionControls.displayName = 'OptionControls';

export default OptionControls;
