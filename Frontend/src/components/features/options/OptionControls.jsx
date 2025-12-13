import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSid, selectSelectedExpiry, selectExpiryList } from '../../../context/selectors';
import { setSid, setExp_sid } from '../../../context/dataSlice';

/**
 * Compact Option Controls - Symbol and Expiry selection only
 * Column settings are now in TableSettingsModal
 */
const OptionControls = memo(() => {
    const dispatch = useDispatch();
    const sid = useSelector(selectSid);
    const expiry = useSelector(selectSelectedExpiry);
    const expiryList = useSelector(selectExpiryList);

    const displaySymbol = sid || 'NIFTY';

    const handleSymbolChange = (e) => {
        dispatch(setSid(e.target.value));
    };

    const handleExpiryChange = (e) => {
        dispatch(setExp_sid(e.target.value));
    };

    const formatExpiryDate = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    return (
        <div className="flex items-center gap-2">
            {/* Symbol */}
            <select
                value={displaySymbol}
                onChange={handleSymbolChange}
                className="px-2 py-1 text-sm font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
                <option value="NIFTY">NIFTY</option>
                <option value="BANKNIFTY">BANKNIFTY</option>
                <option value="FINNIFTY">FINNIFTY</option>
                <option value="MIDCPNIFTY">MIDCPNIFTY</option>
            </select>

            {/* Expiry */}
            <select
                value={expiry}
                onChange={handleExpiryChange}
                className="px-2 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
                {expiryList?.map((exp) => (
                    <option key={exp} value={exp}>
                        {formatExpiryDate(exp)}
                    </option>
                ))}
            </select>
        </div>
    );
});

OptionControls.displayName = 'OptionControls';

export default OptionControls;

