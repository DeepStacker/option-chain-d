import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';
import InputForm from '../components/tca/InputForm';
import ResultSection from '../components/tca/ResultSection';
import PNL from '../components/tca/PNL';
import ChartSection from '../components/tca/ChartSection';
import GeneratedTrades from '../components/tca/GeneratedTrades';
import {
    setTradePerDay,
    setNdtpc,
    setTradeAmount,
    setRiskReward,
    setChancePercent,
    setChargesPerTrade,
    setResults,
    setProfitLossChart
} from '../context/tcaSlice';

const ProfitLossCalculator = () => {
    const dispatch = useDispatch();
    const {
        tradePerDay,
        ndtpc,
        tradeAmount,
        riskReward,
        chancePercent,
        chargesPerTrade,
        results,
        profitLossChart,
    } = useSelector((state) => state.tca);
    const theme = useSelector((state) => state.theme.theme);


    const encryptionKey = 'Shivam';

    useEffect(() => {
        document.title = 'Stockify | Risk Analysis';
    }, []);

    const data = useMemo(
        () => ({
            tradePerDay,
            ndtpc,
            tradeAmount,
            riskReward,
            chancePercent,
            chargesPerTrade,
        }),
        [tradePerDay, ndtpc, tradeAmount, riskReward, chancePercent, chargesPerTrade]
    );

    const encryptedData = useMemo(
        () => CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString(),
        [data, encryptionKey]
    );

    const handleGenerateClick = async () => {
        try {
            const response = await fetch('https://tca-server-3kvr.onrender.com/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedData }),
            });
            const encryptedResult = await response.json();

            const decryptedData = CryptoJS.AES.decrypt(
                encryptedResult.encryptedData,
                encryptionKey
            );
            const result = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));

            dispatch(setResults(result));
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >
            {/* Header Section */}
            <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-300">
                <h2 className="text-3xl font-bold text-center md:text-left">Profit & Loss Calculator</h2>
                <PNL results={results} />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 p-4">

                <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <InputForm handleGenerateClick={handleGenerateClick} />
                    <div className="mt-6">
                        <ResultSection results={results} />
                    </div>
                </div>

                {/* Main Panel Section */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                    {results ? (
                        <>
                            <ChartSection
                                profitLossChart={profitLossChart}
                                profitLossData={results.netProfitLossValues}
                                theme={theme}
                            />
                            <GeneratedTrades results={results} />
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full text-xl text-gray-600 dark:text-gray-400">
                            Generate results to view profit/loss chart and trades
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfitLossCalculator;
