import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Line,
  Bar,
  Doughnut,
  Radar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [timeframe, setTimeframe] = useState('1M');
  const [selectedMetric, setSelectedMetric] = useState('returns');

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
        },
      },
    },
  };

  // Returns Data
  const returnsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Returns',
        data: [5, 8, 6, 12, 9, 15],
        borderColor: theme === 'dark' ? '#60A5FA' : '#3B82F6',
        backgroundColor: theme === 'dark' 
          ? 'rgba(96, 165, 250, 0.1)' 
          : 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Market Returns',
        data: [4, 6, 8, 10, 8, 12],
        borderColor: theme === 'dark' ? '#F87171' : '#EF4444',
        backgroundColor: theme === 'dark'
          ? 'rgba(248, 113, 113, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Trading Volume Data
  const volumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Trading Volume',
      data: [120, 190, 150, 220, 180, 250],
      backgroundColor: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    }],
  };

  // Asset Allocation Data
  const allocationData = {
    labels: ['Stocks', 'Options', 'Futures', 'Bonds', 'Cash'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#60A5FA',
        '#F87171',
        '#34D399',
        '#FBBF24',
        '#A78BFA',
      ],
    }],
  };

  // Trading Performance Data
  const performanceData = {
    labels: ['Win Rate', 'Risk Management', 'Timing', 'Strategy', 'Discipline'],
    datasets: [{
      label: 'Performance Metrics',
      data: [85, 75, 80, 70, 90],
      backgroundColor: theme === 'dark' 
        ? 'rgba(96, 165, 250, 0.5)'
        : 'rgba(59, 130, 246, 0.5)',
      borderColor: theme === 'dark' ? '#60A5FA' : '#3B82F6',
      borderWidth: 2,
    }],
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-gray-200'
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>

        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-gray-200'
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="returns">Returns</option>
          <option value="volume">Volume</option>
          <option value="allocation">Allocation</option>
          <option value="performance">Performance</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Returns Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Portfolio Returns
          </h3>
          <div className="h-[300px]">
            <Line data={returnsData} options={commonOptions} />
          </div>
        </motion.div>

        {/* Volume Chart */}
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
            Trading Volume
          </h3>
          <div className="h-[300px]">
            <Bar data={volumeData} options={commonOptions} />
          </div>
        </motion.div>

        {/* Asset Allocation Chart */}
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
            Asset Allocation
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[80%] h-[80%]">
              <Doughnut
                data={allocationData}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: {
                      ...commonOptions.plugins.legend,
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Performance Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Trading Performance
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[80%] h-[80%]">
              <Radar
                data={performanceData}
                options={{
                  ...commonOptions,
                  scales: {
                    r: {
                      angleLines: {
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                      grid: {
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                      ticks: {
                        color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
                        backdropColor: 'transparent',
                      },
                      pointLabels: {
                        color: theme === 'dark' ? '#E5E7EB' : '#4B5563',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile-Optimized Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Trades', value: '156' },
          { label: 'Win Rate', value: '68%' },
          { label: 'Avg Return', value: '12.5%' },
          { label: 'Sharpe Ratio', value: '1.8' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className={`text-xl font-bold mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
