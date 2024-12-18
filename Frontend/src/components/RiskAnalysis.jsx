import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Line,
  Bar,
  Scatter,
  Bubble
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaChartLine, FaChartBar, FaPercent, FaCoins, FaExclamationTriangle } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RiskAnalysis = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedMetric, setSelectedMetric] = useState('var');
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // Risk Metrics Data
  const riskMetrics = {
    var: {
      daily: '2.5%',
      weekly: '5.2%',
      monthly: '8.7%'
    },
    sharpeRatio: 1.8,
    beta: 1.2,
    alpha: 0.3,
    maxDrawdown: '15.4%',
    volatility: '12.8%'
  };

  // Position Sizing Calculator
  const [positionSize, setPositionSize] = useState({
    accountSize: 100000,
    riskPerTrade: 1,
    entryPrice: 0,
    stopLoss: 0
  });

  const calculatePosition = () => {
    if (!positionSize.entryPrice || !positionSize.stopLoss) return 0;
    const riskAmount = (positionSize.accountSize * (positionSize.riskPerTrade / 100));
    const riskPerShare = Math.abs(positionSize.entryPrice - positionSize.stopLoss);
    return Math.floor(riskAmount / riskPerShare);
  };

  // Risk Distribution Data
  const riskDistributionData = {
    labels: ['Equity', 'Options', 'Futures', 'Cash'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: [
        theme === 'dark' ? '#60A5FA' : '#3B82F6',
        theme === 'dark' ? '#F87171' : '#EF4444',
        theme === 'dark' ? '#34D399' : '#10B981',
        theme === 'dark' ? '#FBBF24' : '#F59E0B'
      ]
    }]
  };

  // VaR Chart Data
  const varChartData = {
    labels: ['1D', '1W', '2W', '1M', '3M', '6M'],
    datasets: [{
      label: 'Value at Risk',
      data: [1.2, 2.5, 3.8, 5.2, 7.5, 9.8],
      borderColor: theme === 'dark' ? '#60A5FA' : '#3B82F6',
      backgroundColor: theme === 'dark' 
        ? 'rgba(96, 165, 250, 0.1)' 
        : 'rgba(59, 130, 246, 0.1)',
      fill: true
    }]
  };

  // Risk-Return Scatter Plot
  const riskReturnData = {
    datasets: [{
      label: 'Risk-Return Profile',
      data: [
        { x: 5, y: 8 },
        { x: 8, y: 12 },
        { x: 12, y: 15 },
        { x: 15, y: 18 },
        { x: 18, y: 20 }
      ],
      backgroundColor: theme === 'dark' ? '#60A5FA' : '#3B82F6'
    }]
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#4B5563'
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#4B5563'
        }
      }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Value at Risk', value: riskMetrics.var.daily, icon: <FaChartLine /> },
          { label: 'Sharpe Ratio', value: riskMetrics.sharpeRatio.toFixed(2), icon: <FaChartBar /> },
          { label: 'Volatility', value: riskMetrics.volatility, icon: <FaPercent /> },
          { label: 'Max Drawdown', value: riskMetrics.maxDrawdown, icon: <FaExclamationTriangle /> }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl text-blue-500">{metric.icon}</div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.value}
              </div>
            </div>
            <div className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Position Sizing Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Position Size Calculator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Account Size
            </label>
            <input
              type="number"
              value={positionSize.accountSize}
              onChange={(e) => setPositionSize({
                ...positionSize,
                accountSize: parseFloat(e.target.value)
              })}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Risk Per Trade (%)
            </label>
            <input
              type="number"
              value={positionSize.riskPerTrade}
              onChange={(e) => setPositionSize({
                ...positionSize,
                riskPerTrade: parseFloat(e.target.value)
              })}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Entry Price
            </label>
            <input
              type="number"
              value={positionSize.entryPrice}
              onChange={(e) => setPositionSize({
                ...positionSize,
                entryPrice: parseFloat(e.target.value)
              })}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Stop Loss
            </label>
            <input
              type="number"
              value={positionSize.stopLoss}
              onChange={(e) => setPositionSize({
                ...positionSize,
                stopLoss: parseFloat(e.target.value)
              })}
              className={`w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>
        <div className={`mt-4 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex justify-between items-center">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Recommended Position Size:
            </span>
            <span className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {calculatePosition()} shares
            </span>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VaR Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Value at Risk Over Time
          </h3>
          <div className="h-[300px]">
            <Line data={varChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Risk-Return Scatter Plot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Risk-Return Profile
          </h3>
          <div className="h-[300px]">
            <Scatter
              data={riskReturnData}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales.x,
                    title: {
                      display: true,
                      text: 'Risk (%)',
                      color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
                    }
                  },
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Return (%)',
                      color: theme === 'dark' ? '#E5E7EB' : '#4B5563'
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Advanced Metrics Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
        className={`w-full p-4 rounded-lg shadow-lg ${
          theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced Metrics
          </span>
          <FaChartLine className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
        </div>
      </motion.button>

      {/* Advanced Metrics Section */}
      <AnimatePresence>
        {showAdvancedMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Beta', value: riskMetrics.beta },
                { label: 'Alpha', value: riskMetrics.alpha },
                { label: 'Information Ratio', value: '0.85' }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg`}
                >
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {metric.label}
                  </div>
                  <div className={`text-xl font-bold mt-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {metric.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskAnalysis;
