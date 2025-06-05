import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { runMonteCarloSimulation, calculateRiskMetrics, generateTradingSuggestions } from '../../utils/positionAnalytics';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const RiskAnalysis = ({ calculatedPosition, analysisData, theme }) => {
    const [selectedTab, setSelectedTab] = useState('overview');
    
    // Run Monte Carlo simulation
    const marketData = {
        price: calculatedPosition.entryPrice,
        stopLoss: calculatedPosition.stopLoss,
        target: calculatedPosition.targetPrice,
        volatility: analysisData.volatilityLevel || 'medium',
        volume: 500000 // Example volume, should be fetched from market data
    };
    
    const simulationResults = runMonteCarloSimulation(calculatedPosition, marketData);
    const riskMetrics = calculateRiskMetrics(calculatedPosition, marketData);
    const tradingSuggestions = generateTradingSuggestions(calculatedPosition, analysisData, marketData);

    // Chart data for Monte Carlo simulation
    const simulationChartData = {
        labels: ['Win Probability', 'Loss Probability'],
        datasets: [{
            data: [simulationResults.winProbability, (100 - simulationResults.winProbability)],
            backgroundColor: theme === 'dark' 
                ? ['rgba(34, 197, 94, 0.5)', 'rgba(239, 68, 68, 0.5)']
                : ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderColor: theme === 'dark'
                ? ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)']
                : ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
            borderWidth: 1
        }]
    };

    // Original chart data
    const positionChartData = {
        labels: ['Position Value', 'Risk Amount', 'Potential Gain', 'Potential Loss'],
        datasets: [{
            label: 'Amount (₹)',
            data: [
                calculatedPosition.totalValue,
                calculatedPosition.riskAmount,
                parseFloat(analysisData.potentialGain),
                parseFloat(analysisData.potentialLoss)
            ],
            backgroundColor: theme === 'dark' 
                ? ['rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)', 'rgba(34, 197, 94, 0.5)', 'rgba(249, 115, 22, 0.5)']
                : ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)'],
            borderColor: theme === 'dark'
                ? ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)']
                : ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)'],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return typeof value === 'number' ? `₹${value.toFixed(2)}` : `${value}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
                }
            }
        }
    };

    return (
        <div className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}>
            <h3 className="text-xl font-semibold mb-4">Risk Analysis</h3>
            
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setSelectedTab('overview')}
                    className={`px-4 py-2 rounded-lg ${
                        selectedTab === 'overview'
                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setSelectedTab('simulation')}
                    className={`px-4 py-2 rounded-lg ${
                        selectedTab === 'simulation'
                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Monte Carlo
                </button>
                <button
                    onClick={() => setSelectedTab('suggestions')}
                    className={`px-4 py-2 rounded-lg ${
                        selectedTab === 'suggestions'
                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Suggestions
                </button>
            </div>
            
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Position Size</p>
                            <p className="text-lg font-semibold">{calculatedPosition.quantity} units</p>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk:Reward</p>
                            <p className="text-lg font-semibold">{analysisData.riskRewardRatio}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Heat</p>
                            <p className="text-lg font-semibold">{analysisData.portfolioHeat}%</p>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Volatility Impact</p>
                            <p className="text-lg font-semibold">{analysisData.volatilityImpact}%</p>
                        </div>
                    </div>

                    {/* Risk Chart */}
                    <div className="h-64 mb-6">
                        <Bar data={positionChartData} options={chartOptions} />
                    </div>

                    {/* Risk Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <h4 className="font-medium mb-2">Market Risk Metrics</h4>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Volatility Risk:</span>
                                    <span>{(riskMetrics.volatilityRisk * 100).toFixed(2)}%</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Liquidity Risk:</span>
                                    <span className={
                                        riskMetrics.liquidityRisk === 'high' 
                                            ? 'text-red-500' 
                                            : riskMetrics.liquidityRisk === 'medium'
                                                ? 'text-yellow-500'
                                                : 'text-green-500'
                                    }>{riskMetrics.liquidityRisk}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Position Impact:</span>
                                    <span>{(riskMetrics.positionImpact * 100).toFixed(2)}%</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Est. Slippage:</span>
                                    <span>{riskMetrics.slippageEstimate.toFixed(2)}%</span>
                                </li>
                            </ul>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <h4 className="font-medium mb-2">Position Risk Factors</h4>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Correlation Risk:</span>
                                    <span>{analysisData.correlationRisk}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Time Frame Risk:</span>
                                    <span>{analysisData.timeFrameRisk}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Market Condition:</span>
                                    <span>{marketData.volatility}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Risk Score:</span>
                                    <span className={
                                        simulationResults.confidenceScore > 70
                                            ? 'text-green-500'
                                            : simulationResults.confidenceScore > 50
                                                ? 'text-yellow-500'
                                                : 'text-red-500'
                                    }>{simulationResults.confidenceScore.toFixed(1)}%</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Monte Carlo Tab */}
            {selectedTab === 'simulation' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Probability</p>
                            <p className="text-lg font-semibold">{simulationResults.winProbability}%</p>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Days to Outcome</p>
                            <p className="text-lg font-semibold">{simulationResults.averageDaysToOutcome} days</p>
                        </div>
                        <div className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence Score</p>
                            <p className="text-lg font-semibold">{simulationResults.confidenceScore}%</p>
                        </div>
                    </div>

                    <div className="h-64">
                        <Bar data={simulationChartData} options={chartOptions} />
                    </div>

                    <div className={`p-4 rounded-lg ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                        <h4 className="font-medium mb-2">Simulation Insights</h4>
                        <ul className="space-y-2 text-sm">
                            <li>• Based on {marketData.volatility} market volatility</li>
                            <li>• Simulated over 1000 iterations</li>
                            <li>• Maximum simulation period: 20 days</li>
                            <li>• Includes market drift and random walk</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Suggestions Tab */}
            {selectedTab === 'suggestions' && (
                <div className="space-y-4">
                    {tradingSuggestions.map((suggestion, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                            theme === "dark" ? "bg-gray-700 " : "bg-gray-50 "
                        }${
                            suggestion.type === 'danger' 
                                ? 'border-red-500' 
                                : suggestion.type === 'warning'
                                    ? 'border-yellow-500'
                                    : 'border-blue-500'
                        }`}>
                            <p className="font-medium mb-1">{suggestion.message}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.action}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiskAnalysis;
