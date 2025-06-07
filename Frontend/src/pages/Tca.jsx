import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';
import InputForm from '../components/tca/InputForm';
import ResultSection from '../components/tca/ResultSection';
import PNL from '../components/tca/PNL';
import ChartSection from '../components/tca/ChartSection';
import GeneratedTrades from '../components/tca/GeneratedTrades';
import TradeAnalysis from '../components/tca/TradeAnalysis';
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
        document.title = 'DeepStrike | Risk Analysis';
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
            className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            {/* Header Section */}
            <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-300">
                <h2 className="text-3xl font-bold text-center md:text-left">Trading Strategy Analysis</h2>
                <PNL results={results} />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl flex flex-col gap-6 p-4">
                {/* Input and Results Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className={`p-6 rounded-lg shadow-lg ${
                            theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}>
                            <InputForm handleGenerateClick={handleGenerateClick} />
                            <div className="mt-6">
                                <ResultSection results={results} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {results ? (
                            <div className="space-y-6">
                                <ChartSection
                                    profitLossChart={profitLossChart}
                                    profitLossData={results.netProfitLossValues}
                                    theme={theme}
                                />
                                <TradeAnalysis results={results} theme={theme} />
                                <GeneratedTrades results={results} />
                            </div>
                        ) : (
                            <div className={`flex justify-center items-center h-64 rounded-lg ${
                                theme === "dark" ? "bg-gray-800" : "bg-white"
                            } shadow-lg`}>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    Generate results to view detailed trading analysis
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitLossCalculator;
