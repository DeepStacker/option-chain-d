import React from 'react';
import { toFixed } from '../utils/utils';
import { useSelector } from "react-redux";

export default function MarketSight() {
    const data = useSelector((state) => state.data.data);
    const theme = useSelector((state) => state.theme.theme);

    // Return null if data is not available
    if (!data || !data.options || !data.options.data) {
        return null;
    }

    // Extracting market data for easier access
    const marketData = data.options.data;

    return (
        <div className={`w-full flex flex-wrap md:flex-nowrap items-center justify-between space-y-1 md:space-y-0 md:space-x-5 rounded-lg transition  ease-in-out ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center ">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>ATM IV</p>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{toFixed(marketData.atmiv) || 0}</p>
            </div>

            <div className="text-center ">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>IV Change</p>
                <p className={`text-lg font-semibold ${marketData.aivperchng >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {toFixed(marketData.aivperchng) || 0}%
                </p>
            </div>

            <div className="text-center ">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Days to Exp</p>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{marketData.dte || 0}</p>
            </div>

            <div className="text-center ">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lot Size</p>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{marketData.olot || 0}</p>
            </div>

            <div className="text-center ">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>PCR</p>
                <p className={`text-lg font-semibold ${marketData.Rto > 1.2 ? 'text-green-400' : marketData.Rto < 0.8 ? 'text-red-400' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-800')}`}>
                    {marketData.Rto ? marketData.Rto.toFixed(2) : 0}
                </p>
            </div>
        </div>
    );
}
