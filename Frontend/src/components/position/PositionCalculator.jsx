import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const PositionCalculator = ({ setCalculatedPosition, setAnalysisData }) => {
    const theme = useSelector((state) => state.theme.theme);
    
    // Basic Position Sizing
    const [accountSize, setAccountSize] = useState('');
    const [riskPercentage, setRiskPercentage] = useState('1');
    const [entryPrice, setEntryPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    
    // Advanced Options
    const [positionType, setPositionType] = useState('long');
    const [marginRequired, setMarginRequired] = useState('');
    const [leverageUsed, setLeverageUsed] = useState('1');
    const [maxPositionSize, setMaxPositionSize] = useState('');
    const [correlatedPositions, setCorrelatedPositions] = useState('0');
    const [marketVolatility, setMarketVolatility] = useState('medium');
    const [timeFrame, setTimeFrame] = useState('intraday');
    
    // Additional Risk Parameters
    const [maxDrawdown, setMaxDrawdown] = useState('');
    const [portfolioHeatMap, setPortfolioHeatMap] = useState('0');
    const [riskRewardRatio, setRiskRewardRatio] = useState('');

    // Show/Hide Advanced Options
    const [showAdvanced, setShowAdvanced] = useState(false);

    const calculatePosition = () => {
        if (!accountSize || !entryPrice || !stopLoss) {
            alert('Please fill in all required fields');
            return;
        }

        const riskAmount = (parseFloat(accountSize) * parseFloat(riskPercentage)) / 100;
        const stopLossDistance = Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss));
        let positionSize = riskAmount / stopLossDistance;
        
        // Apply leverage
        positionSize *= parseFloat(leverageUsed);
        
        // Adjust for market volatility
        const volatilityMultiplier = {
            low: 1.2,
            medium: 1.0,
            high: 0.8
        }[marketVolatility];
        positionSize *= volatilityMultiplier;

        // Calculate risk metrics
        const potentialLoss = stopLossDistance * positionSize;
        const potentialGain = targetPrice ? 
            Math.abs(parseFloat(targetPrice) - parseFloat(entryPrice)) * positionSize : 0;
        const calculatedRR = potentialGain / potentialLoss;

        // Portfolio heat calculation
        const portfolioHeat = (parseFloat(portfolioHeatMap) + parseFloat(riskPercentage)) / 100;

        const positionData = {
            quantity: Math.floor(positionSize),
            totalValue: positionSize * parseFloat(entryPrice),
            riskAmount,
            leveragedValue: positionSize * parseFloat(entryPrice) * parseFloat(leverageUsed),
            marginUsed: marginRequired ? parseFloat(marginRequired) : 0
        };

        const analysisData = {
            riskRewardRatio: calculatedRR.toFixed(2),
            portfolioHeat: portfolioHeat.toFixed(2),
            potentialLoss: potentialLoss.toFixed(2),
            potentialGain: potentialGain.toFixed(2),
            volatilityImpact: ((1 - volatilityMultiplier) * 100).toFixed(1),
            correlationRisk: parseFloat(correlatedPositions) > 30 ? 'High' : 'Moderate',
            timeFrameRisk: timeFrame === 'intraday' ? 'Lower' : 'Higher',
            suggestions: []
        };

        // Generate suggestions
        if (calculatedRR < 2) {
            analysisData.suggestions.push('Consider a better entry point for improved R:R ratio');
        }
        if (portfolioHeat > 0.5) {
            analysisData.suggestions.push('High portfolio heat - consider reducing position size');
        }
        if (parseFloat(leverageUsed) > 2) {
            analysisData.suggestions.push('High leverage - monitor position closely');
        }

        setCalculatedPosition(positionData);
        setAnalysisData(analysisData);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Position Calculator</h3>
            
            {/* Basic Fields */}
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Account Size (₹)</label>
                    <input
                        type="number"
                        value={accountSize}
                        onChange={(e) => setAccountSize(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                        }`}
                        placeholder="Enter account size"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Risk Percentage (%)</label>
                    <input
                        type="number"
                        value={riskPercentage}
                        onChange={(e) => setRiskPercentage(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                        }`}
                        placeholder="Enter risk percentage"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Entry Price (₹)</label>
                    <input
                        type="number"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                        }`}
                        placeholder="Enter entry price"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Stop Loss (₹)</label>
                    <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                        }`}
                        placeholder="Enter stop loss"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target Price (₹)</label>
                    <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className={`w-full p-2 rounded border ${
                            theme === "dark" 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                        }`}
                        placeholder="Enter target price"
                    />
                </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="pt-4">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`text-sm font-medium ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                    {showAdvanced ? '- Hide Advanced Options' : '+ Show Advanced Options'}
                </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
                <div className="space-y-3 pt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Position Type</label>
                        <select
                            value={positionType}
                            onChange={(e) => setPositionType(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                        >
                            <option value="long">Long</option>
                            <option value="short">Short</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Leverage Used</label>
                        <input
                            type="number"
                            value={leverageUsed}
                            onChange={(e) => setLeverageUsed(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                            placeholder="Enter leverage"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Market Volatility</label>
                        <select
                            value={marketVolatility}
                            onChange={(e) => setMarketVolatility(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Time Frame</label>
                        <select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                        >
                            <option value="intraday">Intraday</option>
                            <option value="swing">Swing</option>
                            <option value="positional">Positional</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Correlated Positions (%)</label>
                        <input
                            type="number"
                            value={correlatedPositions}
                            onChange={(e) => setCorrelatedPositions(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                            placeholder="Enter correlated positions percentage"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Portfolio Heat (%)</label>
                        <input
                            type="number"
                            value={portfolioHeatMap}
                            onChange={(e) => setPortfolioHeatMap(e.target.value)}
                            className={`w-full p-2 rounded border ${
                                theme === "dark" 
                                    ? "bg-gray-700 border-gray-600" 
                                    : "bg-white border-gray-300"
                            }`}
                            placeholder="Enter current portfolio heat"
                        />
                    </div>
                </div>
            )}

            {/* Calculate Button */}
            <div className="pt-6">
                <button
                    onClick={calculatePosition}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                        theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    Calculate Position
                </button>
            </div>
        </div>
    );
};

export default PositionCalculator;
