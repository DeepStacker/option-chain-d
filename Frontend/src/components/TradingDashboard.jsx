// src/components/TradingDashboard.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  BoltIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";

// Professional Trading Dashboard Component[1][2][3]
const TradingDashboard = memo(({ onClose, theme }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({});
  const dashboardRef = useRef(null);

  // Simulate real-time trading data[1]
  useEffect(() => {
    const ws = new WebSocket("wss://api.deepstrike.com/trading-data");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeData((prev) => ({ ...prev, ...data }));
    };

    // Simulate data for demo
    const interval = setInterval(() => {
      setRealTimeData({
        portfolioValue: 2847392 + Math.random() * 10000,
        dailyPnL: 15420 + Math.random() * 1000,
        totalPositions: 24,
        activeStrategies: 8,
        riskScore: 65 + Math.random() * 10,
        winRate: 78.5 + Math.random() * 2,
      });
    }, 2000);

    setIsLoading(false);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  // Portfolio metrics for professional traders[2][4]
  const portfolioMetrics = useMemo(
    () => [
      {
        title: "Portfolio Value",
        value: `₹${(realTimeData.portfolioValue || 2847392).toLocaleString()}`,
        change: "+2.4%",
        trend: "up",
        icon: CurrencyDollarIcon,
        color: "text-green-500",
      },
      {
        title: "Daily P&L",
        value: `₹${(realTimeData.dailyPnL || 15420).toLocaleString()}`,
        change: "+0.8%",
        trend: "up",
        icon: TrendingUpIcon,
        color: "text-green-500",
      },
      {
        title: "Active Positions",
        value: realTimeData.totalPositions || 24,
        change: "+3",
        trend: "up",
        icon: ChartBarIcon,
        color: "text-blue-500",
      },
      {
        title: "Risk Score",
        value: `${Math.round(realTimeData.riskScore || 65)}/100`,
        change: "Low Risk",
        trend: "neutral",
        icon: ShieldCheckIcon,
        color: "text-yellow-500",
      },
    ],
    [realTimeData]
  );

  // Recent trades data[3]
  const recentTrades = useMemo(
    () => [
      {
        symbol: "NIFTY 18000 CE",
        action: "BUY",
        quantity: 50,
        price: 125.5,
        time: "14:30:25",
        pnl: "+₹2,450",
        status: "executed",
      },
      {
        symbol: "BANKNIFTY 42000 PE",
        action: "SELL",
        quantity: 25,
        price: 89.75,
        time: "14:28:15",
        pnl: "+₹1,875",
        status: "executed",
      },
      {
        symbol: "RELIANCE 2500 CE",
        action: "BUY",
        quantity: 100,
        price: 45.25,
        time: "14:25:10",
        pnl: "-₹750",
        status: "executed",
      },
    ],
    []
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div
          className={`p-8 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-center">Loading Trading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={dashboardRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Trading Dashboard
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Real-time portfolio analytics and trading insights
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Portfolio Metrics Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {portfolioMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${metric.color}`} />
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up"
                          ? "text-green-500"
                          : metric.trend === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {metric.value}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {metric.title}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            {["portfolio", "trades", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "trades" && (
              <motion.div
                key="trades"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-xl border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`p-4 border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Recent Trades
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {recentTrades.map((trade, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {trade.symbol}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {trade.action} {trade.quantity} @ ₹{trade.price}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              trade.pnl.includes("+")
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {trade.pnl}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {trade.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
});

TradingDashboard.displayName = "TradingDashboard";

export default TradingDashboard;
