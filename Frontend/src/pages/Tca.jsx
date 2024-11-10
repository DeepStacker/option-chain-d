import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';
import InputForm from '../components/tca/InputForm';
import ResultSection from '../components/tca/ResultSection';
import ChartSection from '../components/tca/ChartSection';
import GeneratedTrades from '../components/tca/GeneratedTrades';

const ProfitLossCalculator = () => {
    const theme = useSelector((state) => state.theme.theme); // Fetch theme from Redux store

    useEffect(() => {
        document.title = "Stockify | Risk Analysis"
    }, [])

    const [tradePerDay, setTradePerDay] = useState(3);
    const [ndtpc, setNdtpc] = useState(20);
    const [tradeAmount, setTradeAmount] = useState(500);
    const [riskReward, setRiskReward] = useState(2);
    const [chancePercent, setChancePercent] = useState(50);
    const [chargesPerTrade, setChargesPerTrade] = useState(56);
    const [results, setResults] = useState(0);
    const [profitLossChart, setProfitLossChart] = useState(0);

    const encryptionKey = "Shivam"; // Replace with a secure key

    // Memoize the data object to avoid unnecessary recalculations
    const data = useMemo(() => ({
        tradePerDay,
        ndtpc,
        tradeAmount,
        riskReward,
        chancePercent,
        chargesPerTrade
    }), [tradePerDay, ndtpc, tradeAmount, riskReward, chancePercent, chargesPerTrade]);

    // Memoize encrypted data to avoid redundant encryption
    const encryptedData = useMemo(() =>
        CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString(),
        [data, encryptionKey]
    );

    const handleGenerateClick = async () => {

        try {
            const response = await fetch('https://tca-server-3kvr.onrender.com/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedData })
            });
            const encryptedResult = await response.json();

            // Decrypt the received data
            const decryptedData = CryptoJS.AES.decrypt(encryptedResult.encryptedData, encryptionKey);
            const result = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));

            // Set results for rendering
            setResults(result);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <h2 className="text-3xl font-semibold my-3">Profit & Loss Calculator</h2>
            <div className="flex flex-col md:flex-row w-full max-w-full p-1">
                {/* Sidebar Section */}
                <div className="w-full md:w-3/12 p-4 h-screen  rounded-md shadow-md mb-6 md:mb-0">
                    <InputForm
                        tradePerDay={tradePerDay}
                        ndtpc={ndtpc}
                        tradeAmount={tradeAmount}
                        riskReward={riskReward}
                        chancePercent={chancePercent}
                        chargesPerTrade={chargesPerTrade}
                        setTradePerDay={setTradePerDay}
                        setNdtpc={setNdtpc}
                        setTradeAmount={setTradeAmount}
                        setRiskReward={setRiskReward}
                        setChancePercent={setChancePercent}
                        setChargesPerTrade={setChargesPerTrade}
                        handleGenerateClick={handleGenerateClick}
                    />
                    <div className="mt-8">
                        <ResultSection results={results} />
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="w-full md:w-9/12 md:ml-4 h-screen flex flex-col mb-96 space-y-10">
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
                        <div className="flex justify-center items-center h-full text-xl text-gray-600">
                            Generate results to view profit/loss chart and trades
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfitLossCalculator;
