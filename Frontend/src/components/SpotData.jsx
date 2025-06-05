// src/components/SpotData.js
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaChartBar, 
  FaClock, 
  FaDollarSign,
  FaVolumeUp,
  FaExchangeAlt
} from "react-icons/fa";
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ChartBarIcon,
  BanknotesIcon,
  SignalIcon,
  BoltIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { toFixed, formatNumber } from "../utils/utils";
import MarketSight from "./MarketSight";
import { useSelector } from "react-redux";

function SpotData() {
  const data = useSelector((state) => state.data.data);
  const theme = useSelector((state) => state.theme.theme);
  
  const [previousPrice, setPreviousPrice] = useState(null);
  const [priceAnimation, setPriceAnimation] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const marketData = data?.spot?.data;
  
  // Enhanced market data processing
  const processedData = useMemo(() => {
    if (!marketData) return null;
    
    const currentPrice = parseFloat(marketData.Ltp);
    const change = parseFloat(marketData.ch);
    const percentChange = parseFloat(marketData.p_ch);
    
    return {
      symbol: marketData.d_sym || "N/A",
      price: currentPrice,
      change: change,
      percentChange: percentChange,
      open: parseFloat(marketData.op),
      high: parseFloat(marketData.hg),
      low: parseFloat(marketData.lo),
      close: parseFloat(marketData.cl),
      volume: marketData.vol || 0,
      isPositive: change >= 0,
      priceRange: parseFloat(marketData.hg) - parseFloat(marketData.lo),
      dayPerformance: ((currentPrice - parseFloat(marketData.op)) / parseFloat(marketData.op)) * 100
    };
  }, [marketData]);

  // Price change animation effect
  useEffect(() => {
    if (processedData && previousPrice !== null) {
      if (processedData.price > previousPrice) {
        setPriceAnimation('up');
      } else if (processedData.price < previousPrice) {
        setPriceAnimation('down');
      }
      
      const timer = setTimeout(() => setPriceAnimation(null), 1000);
      return () => clearTimeout(timer);
    }
    
    if (processedData) {
      setPreviousPrice(processedData.price);
    }
  }, [processedData?.price, previousPrice]);

  // Live data indicator
  useEffect(() => {
    if (processedData) {
      setIsLive(true);
      const timer = setTimeout(() => setIsLive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [processedData]);

  // Dynamic document title[2]
  useEffect(() => {
    if (processedData) {
      const title = `${processedData.symbol} | ₹${toFixed(processedData.price)} | ${processedData.isPositive ? '+' : ''}${formatNumber(processedData.change)} (${processedData.isPositive ? '+' : ''}${formatNumber(processedData.percentChange)}%)`;
      document.title = title;
    }
  }, [processedData]);

  if (!processedData) {
    return (
      <div className={`p-6 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const priceVariants = {
    up: { 
      scale: [1, 1.05, 1], 
      color: ['#10B981', '#34D399', '#10B981'],
      transition: { duration: 0.6 }
    },
    down: { 
      scale: [1, 1.05, 1], 
      color: ['#EF4444', '#F87171', '#EF4444'],
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative overflow-hidden rounded-2xl shadow-2xl border transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}
    >
      {/* Live indicator */}
      <AnimatePresence>
        {isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 p-6">
        {/* Main price section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          {/* Symbol and price */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className={`p-3 rounded-xl ${
              processedData.isPositive 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-red-500/10 text-red-500'
            }`}>
              <ChartBarIcon className="w-6 h-6" />
            </div>
            
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {processedData.symbol}
              </h2>
              <div className="flex items-center space-x-3">
                <motion.span
                  variants={priceAnimation ? priceVariants[priceAnimation] : {}}
                  animate={priceAnimation || ""}
                  className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  ₹{toFixed(processedData.price)}
                </motion.span>
                
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                  processedData.isPositive 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-red-500/20 text-red-600'
                }`}>
                  {processedData.isPositive ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {processedData.isPositive ? '+' : ''}{formatNumber(processedData.change)}
                  </span>
                  <span className="text-sm">
                    ({processedData.isPositive ? '+' : ''}{formatNumber(processedData.percentChange)}%)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Market Sight Component */}
          <motion.div variants={itemVariants}>
            <MarketSight />
          </motion.div>
        </div>

        {/* Market data grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Open */}
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className={`w-4 h-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Open
              </span>
            </div>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ₹{toFixed(processedData.open)}
            </p>
          </div>

          {/* High */}
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                High
              </span>
            </div>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ₹{toFixed(processedData.high)}
            </p>
          </div>

          {/* Low */}
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Low
              </span>
            </div>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ₹{toFixed(processedData.low)}
            </p>
          </div>

          {/* Previous Close */}
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <BanknotesIcon className={`w-4 h-4 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Prev Close
              </span>
            </div>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ₹{toFixed(processedData.close)}
            </p>
          </div>
        </motion.div>

        {/* Additional metrics */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <SignalIcon className="w-4 h-4" />
                <span>Range: ₹{toFixed(processedData.priceRange)}</span>
              </div>
              
              <div className={`flex items-center space-x-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <BoltIcon className="w-4 h-4" />
                <span>Day Performance: {processedData.isPositive ? '+' : ''}{toFixed(processedData.dayPerformance)}%</span>
              </div>
            </div>

            <div className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SpotData;
