import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaChartLine, FaBell, FaWallet, FaExchangeAlt, FaChartBar, FaRegCalendarAlt } from 'react-icons/fa';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      icon: <FaWallet className="text-blue-500" />,
      label: 'Portfolio Value',
      value: '₹45,000',
      change: '+15%',
      positive: true
    },
    {
      icon: <FaExchangeAlt className="text-green-500" />,
      label: 'Today\'s Trades',
      value: '12',
      change: '+3',
      positive: true
    },
    {
      icon: <FaChartBar className="text-purple-500" />,
      label: 'Win Rate',
      value: '68%',
      change: '+5%',
      positive: true
    },
    {
      icon: <FaRegCalendarAlt className="text-yellow-500" />,
      label: 'Active Days',
      value: '45',
      change: '+2',
      positive: true
    }
  ];

  const recentTrades = [
    { symbol: 'NIFTY', type: 'BUY', price: '19850', time: '10:30 AM', pnl: '+₹1,200' },
    { symbol: 'BANKNIFTY', type: 'SELL', price: '44200', time: '11:15 AM', pnl: '-₹800' },
    { symbol: 'RELIANCE', type: 'BUY', price: '2450', time: '12:30 PM', pnl: '+₹500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Mobile Tab Navigation */}
      <div className="flex overflow-x-auto gap-4 pb-4 md:hidden">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex gap-4 mb-6">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
              activeTab === tab.id
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Grid - Responsive for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{stat.icon}</div>
                    <div className={`text-sm font-semibold ${
                      stat.positive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Trades - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-4`}
            >
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Trades
              </h2>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Symbol
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            P&L
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentTrades.map((trade, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              {trade.symbol}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap ${
                              trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {trade.type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {trade.price}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {trade.time}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap ${
                              trade.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {trade.pnl}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Analytics />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
