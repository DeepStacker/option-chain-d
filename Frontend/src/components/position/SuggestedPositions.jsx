import React from 'react';

const SuggestedPositions = ({ calculatedPosition, analysisData, theme }) => {
    // Calculate alternative position sizes
    const conservative = {
        quantity: Math.floor(calculatedPosition.quantity * 0.75),
        risk: (calculatedPosition.riskAmount * 0.75).toFixed(2),
        potential: (parseFloat(analysisData.potentialGain) * 0.75).toFixed(2)
    };

    const aggressive = {
        quantity: Math.floor(calculatedPosition.quantity * 1.25),
        risk: (calculatedPosition.riskAmount * 1.25).toFixed(2),
        potential: (parseFloat(analysisData.potentialGain) * 1.25).toFixed(2)
    };

    const scaled = {
        quantity: Math.floor(calculatedPosition.quantity * (1 - parseFloat(analysisData.volatilityImpact) / 100)),
        risk: (calculatedPosition.riskAmount * (1 - parseFloat(analysisData.volatilityImpact) / 100)).toFixed(2),
        potential: (parseFloat(analysisData.potentialGain) * (1 - parseFloat(analysisData.volatilityImpact) / 100)).toFixed(2)
    };

    return (
        <div className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}>
            <h3 className="text-xl font-semibold mb-4">Alternative Position Sizes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Conservative Position */}
                <div className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Conservative</h4>
                        <span className="text-green-500 text-sm">Lower Risk</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Quantity: </span>
                            <span className="font-medium">{conservative.quantity}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Risk Amount: </span>
                            <span className="font-medium">₹{conservative.risk}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Potential Gain: </span>
                            <span className="font-medium">₹{conservative.potential}</span>
                        </p>
                    </div>
                </div>

                {/* Calculated Position */}
                <div className={`p-4 rounded-lg border-2 ${
                    theme === "dark" 
                        ? "bg-gray-700 border-blue-500" 
                        : "bg-gray-50 border-blue-500"
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Calculated</h4>
                        <span className="text-blue-500 text-sm">Balanced</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Quantity: </span>
                            <span className="font-medium">{calculatedPosition.quantity}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Risk Amount: </span>
                            <span className="font-medium">₹{calculatedPosition.riskAmount.toFixed(2)}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Potential Gain: </span>
                            <span className="font-medium">₹{analysisData.potentialGain}</span>
                        </p>
                    </div>
                </div>

                {/* Aggressive Position */}
                <div className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Aggressive</h4>
                        <span className="text-red-500 text-sm">Higher Risk</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Quantity: </span>
                            <span className="font-medium">{aggressive.quantity}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Risk Amount: </span>
                            <span className="font-medium">₹{aggressive.risk}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Potential Gain: </span>
                            <span className="font-medium">₹{aggressive.potential}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Volatility Adjusted Position */}
            <div className="mt-6">
                <div className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Volatility Adjusted Position</h4>
                        <span className="text-purple-500 text-sm">Market Adapted</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Quantity: </span>
                            <span className="font-medium">{scaled.quantity}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Risk Amount: </span>
                            <span className="font-medium">₹{scaled.risk}</span>
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Potential Gain: </span>
                            <span className="font-medium">₹{scaled.potential}</span>
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        * Adjusted for current market volatility of {analysisData.volatilityImpact}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuggestedPositions;
