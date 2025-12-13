import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PositionCalculator from '../components/position/PositionCalculator';
import RiskAnalysis from '../components/position/RiskAnalysis';
import SuggestedPositions from '../components/position/SuggestedPositions';

const PositionSizing = () => {
    const theme = useSelector((state) => state.theme.theme);
    const [calculatedPosition, setCalculatedPosition] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);

    useEffect(() => {
        document.title = 'DeepStrike | Position Sizing';
    }, []);

    return (
        <div className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}>
            {/* Header Section */}
            <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center md:text-left">Position Sizing Calculator</h2>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl flex flex-col gap-6 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calculator Section */}
                    <div className="lg:col-span-1">
                        <div className={`p-6 rounded-lg shadow-lg ${
                            theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}>
                            <PositionCalculator 
                                setCalculatedPosition={setCalculatedPosition}
                                setAnalysisData={setAnalysisData}
                            />
                        </div>
                    </div>

                    {/* Analysis and Suggestions Section */}
                    <div className="lg:col-span-2">
                        {calculatedPosition ? (
                            <div className="space-y-6">
                                <RiskAnalysis 
                                    calculatedPosition={calculatedPosition}
                                    analysisData={analysisData}
                                    theme={theme}
                                />
                                <SuggestedPositions 
                                    calculatedPosition={calculatedPosition}
                                    analysisData={analysisData}
                                    theme={theme}
                                />
                            </div>
                        ) : (
                            <div className={`flex justify-center items-center h-64 rounded-lg ${
                                theme === "dark" ? "bg-gray-800" : "bg-white"
                            } shadow-lg`}>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    Calculate position size to view analysis and suggestions
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PositionSizing;
