import React from "react";
import { useSelector } from "react-redux";

const InputForm = ({
    tradePerDay,
    ndtpc,
    tradeAmount,
    riskReward,
    chancePercent,
    chargesPerTrade,
    setTradePerDay,
    setNdtpc,
    setTradeAmount,
    setRiskReward,
    setChancePercent,
    setChargesPerTrade,
    handleGenerateClick,
}) => {
    const theme = useSelector((state) => state.theme.theme);

    return (
        <div className={`rounded-3xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'} p-5  pb-10`} >
            <div>
                <label className="block text-sm font-medium">Trades per Day</label>
                <input
                    type="number"
                    value={tradePerDay}
                    onChange={(e) => setTradePerDay(parseInt(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Days to Simulate</label>
                <input
                    type="number"
                    value={ndtpc}
                    onChange={(e) => setNdtpc(parseInt(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Trade Amount</label>
                <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}  w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Risk-Reward Ratio</label>
                <input
                    type="number"
                    value={riskReward}
                    onChange={(e) => setRiskReward(parseFloat(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}  w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Chance Percent</label>
                <input
                    type="number"
                    value={chancePercent}
                    onChange={(e) => setChancePercent(parseFloat(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}  w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Charges per Trade</label>
                <input
                    type="number"
                    value={chargesPerTrade}
                    onChange={(e) => setChargesPerTrade(parseFloat(e.target.value))}
                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}  w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            <div className="text-center">
                <button
                    onClick={handleGenerateClick}
                    className="px-2 mt-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Generate Profit/Loss
                </button>
            </div>
        </div>
    );
};

export default InputForm;
