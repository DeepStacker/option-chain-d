import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  BellIcon,
  EyeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  CpuChipIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BeakerIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  FireIcon,
  LightBulbIcon,
  CommandLineIcon,
  CircleStackIcon,
  SignalIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const EnhancedTradingDashboard = () => {
  const theme = useSelector((state) => state.theme?.theme || "light");
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);
  const [riskManagementActive, setRiskManagementActive] = useState(true);

  // Enhanced algorithmic trading stats[10][12]
  const [algoStats, setAlgoStats] = useState([
    {
      id: "portfolio",
      icon: CurrencyDollarIcon,
      label: "Portfolio Value",
      value: "₹4,50,000",
      change: "+15.2%",
      changeValue: "+₹57,800",
      positive: true,
      color: "from-blue-500 to-blue-600",
      description: "Total portfolio value including all positions",
      automation: "Auto-rebalancing active",
    },
    {
      id: "algo_performance",
      icon: CpuChipIcon,
      label: "Algo Performance",
      value: "87.3%",
      change: "+5.1%",
      changeValue: "+4.2%",
      positive: true,
      color: "from-purple-500 to-purple-600",
      description: "ML-enhanced algorithm success rate",
      automation: "AI optimization running",
    },
    {
      id: "options_pnl",
      icon: ArrowTrendingUpIcon,
      label: "Options P&L",
      value: "+₹1,23,450",
      change: "+12.8%",
      changeValue: "+₹14,200",
      positive: true,
      color: "from-green-500 to-green-600",
      description: "Options trading profit/loss",
      automation: "Greeks auto-hedging on",
    },
    {
      id: "execution_speed",
      icon: BoltIcon,
      label: "Execution Speed",
      value: "2.3ms",
      change: "-0.5ms",
      changeValue: "Improved",
      positive: true,
      color: "from-orange-500 to-orange-600",
      description: "Average order execution latency",
      automation: "Low-latency mode active",
    },
  ]);

  // Advanced algorithmic strategies[12][13]
  const [activeStrategies, setActiveStrategies] = useState([
    {
      id: "momentum_scalper",
      name: "Momentum Scalper",
      status: "running",
      pnl: "+₹45,200",
      trades: 156,
      winRate: "78.2%",
      riskScore: "Medium",
      lastSignal: "2 min ago",
      automation: "Full Auto",
      description: "High-frequency momentum-based scalping",
    },
    {
      id: "options_straddle",
      name: "Options Straddle Bot",
      status: "running",
      pnl: "+₹32,800",
      trades: 89,
      winRate: "71.9%",
      riskScore: "Low",
      lastSignal: "5 min ago",
      automation: "Semi-Auto",
      description: "Volatility-based straddle strategies",
    },
    {
      id: "mean_reversion",
      name: "Mean Reversion AI",
      status: "paused",
      pnl: "+₹18,600",
      trades: 67,
      winRate: "69.4%",
      riskScore: "High",
      lastSignal: "15 min ago",
      automation: "Manual Override",
      description: "ML-powered mean reversion detection",
    },
    {
      id: "arbitrage_hunter",
      name: "Arbitrage Hunter",
      status: "running",
      pnl: "+₹8,950",
      trades: 234,
      winRate: "94.1%",
      riskScore: "Very Low",
      lastSignal: "30 sec ago",
      automation: "Full Auto",
      description: "Cross-exchange arbitrage opportunities",
    },
  ]);

  // Real-time market signals and automation[15]
  const [marketSignals, setMarketSignals] = useState([
    {
      symbol: "NIFTY 50",
      signal: "BUY",
      strength: "Strong",
      price: "19,850.25",
      target: "20,100",
      stopLoss: "19,650",
      confidence: "87%",
      timeframe: "15m",
      strategy: "Breakout + Volume Surge",
      autoExecuted: true,
    },
    {
      symbol: "BANK NIFTY",
      signal: "SELL",
      strength: "Medium",
      price: "44,200.80",
      target: "43,800",
      stopLoss: "44,500",
      confidence: "72%",
      timeframe: "5m",
      strategy: "RSI Divergence",
      autoExecuted: false,
    },
    {
      symbol: "RELIANCE 2500 CE",
      signal: "BUY",
      strength: "Very Strong",
      price: "125.50",
      target: "180",
      stopLoss: "95",
      confidence: "91%",
      timeframe: "1h",
      strategy: "Gamma Squeeze Setup",
      autoExecuted: true,
    },
  ]);

  // Risk management automation[7]
  const [riskMetrics, setRiskMetrics] = useState({
    portfolioVaR: "2.3%",
    maxDrawdown: "5.8%",
    sharpeRatio: "2.14",
    betaToMarket: "0.87",
    correlationRisk: "Low",
    concentrationRisk: "Medium",
    liquidityRisk: "Low",
    autoStopLoss: "Active",
    positionSizing: "Auto-Kelly",
    hedgeRatio: "0.65",
  });

  // Advanced tab configuration for algorithmic trading[3][4]
  const tabs = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: ChartBarIcon,
        color: "from-blue-500 to-blue-600",
        description: "Portfolio summary and automation status",
      },
      {
        id: "strategies",
        label: "Algo Strategies",
        icon: CpuChipIcon,
        color: "from-purple-500 to-purple-600",
        description: "Manage algorithmic trading strategies",
      },
      {
        id: "signals",
        label: "Live Signals",
        icon: SignalIcon,
        color: "from-green-500 to-green-600",
        description: "Real-time trading signals and automation",
      },
      {
        id: "risk",
        label: "Risk Management",
        icon: ShieldCheckIcon,
        color: "from-red-500 to-red-600",
        description: "Automated risk controls and monitoring",
      },
      {
        id: "backtesting",
        label: "Backtesting",
        icon: BeakerIcon,
        color: "from-indigo-500 to-indigo-600",
        description: "Strategy testing and optimization",
      },
      {
        id: "automation",
        label: "Automation Hub",
        icon: RocketLaunchIcon,
        color: "from-orange-500 to-orange-600",
        description: "Configure trading automation settings",
      },
    ],
    []
  );

  // Automation controls
  const handleToggleAutoTrading = useCallback(() => {
    setAutoTradingEnabled(!autoTradingEnabled);
    toast.success(
      autoTradingEnabled ? "Auto-trading disabled" : "Auto-trading enabled"
    );
  }, [autoTradingEnabled]);

  const handleStrategyControl = useCallback((strategyId, action) => {
    setActiveStrategies((prev) =>
      prev.map((strategy) =>
        strategy.id === strategyId ? { ...strategy, status: action } : strategy
      )
    );
    toast.success(`Strategy ${action} successfully`);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Render strategy management
  const renderStrategies = () => (
    <motion.div
      key="strategies"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Strategy Controls Header */}
      <div className="flex items-center justify-between">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Algorithmic Strategies
        </h2>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleAutoTrading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              autoTradingEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            {autoTradingEnabled ? (
              <PlayIcon className="w-5 h-5" />
            ) : (
              <PauseIcon className="w-5 h-5" />
            )}
            <span>
              {autoTradingEnabled ? "Auto-Trading ON" : "Auto-Trading OFF"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Active Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeStrategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`p-6 rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/50 border-gray-200/50"
            } backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    strategy.status === "running"
                      ? "bg-green-500 animate-pulse"
                      : strategy.status === "paused"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <h3
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {strategy.name}
                </h3>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStrategyControl(strategy.id, "running")}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlayIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStrategyControl(strategy.id, "paused")}
                  className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <PauseIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStrategyControl(strategy.id, "stopped")}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <StopIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <p
              className={`text-sm mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {strategy.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div
                  className={`text-2xl font-bold ${
                    strategy.pnl.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {strategy.pnl}
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  P&L
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {strategy.winRate}
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Win Rate
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={`px-3 py-1 rounded-full ${
                  strategy.automation === "Full Auto"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : strategy.automation === "Semi-Auto"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {strategy.automation}
              </span>
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {strategy.trades} trades
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Render live signals
  const renderSignals = () => (
    <motion.div
      key="signals"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Live Trading Signals
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time AI Analysis
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {marketSignals.map((signal, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`p-6 rounded-2xl border ${
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/50 border-gray-200/50"
            } backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`px-3 py-1 rounded-full font-bold text-sm ${
                    signal.signal === "BUY"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {signal.signal}
                </div>
                <h3
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {signal.symbol}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    signal.strength === "Very Strong"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      : signal.strength === "Strong"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                  }`}
                >
                  {signal.strength}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {signal.autoExecuted && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                    Auto-Executed
                  </span>
                )}
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {signal.confidence} confidence
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Current Price
                </div>
                <div
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹{signal.price}
                </div>
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Target
                </div>
                <div className="text-lg font-bold text-green-500">
                  ₹{signal.target}
                </div>
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Stop Loss
                </div>
                <div className="text-lg font-bold text-red-500">
                  ₹{signal.stopLoss}
                </div>
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Timeframe
                </div>
                <div
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {signal.timeframe}
                </div>
              </div>
            </div>

            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <strong>Strategy:</strong> {signal.strategy}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Render risk management
  const renderRiskManagement = () => (
    <motion.div
      key="risk"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Automated Risk Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRiskManagementActive(!riskManagementActive)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
            riskManagementActive
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <ShieldCheckIcon className="w-5 h-5" />
          <span>
            {riskManagementActive ? "Risk Controls ON" : "Risk Controls OFF"}
          </span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(riskMetrics).map(([key, value], index) => {
          const riskConfig = {
            portfolioVaR: {
              label: "Portfolio VaR",
              color: "text-red-500",
              icon: ExclamationTriangleIcon,
            },
            maxDrawdown: {
              label: "Max Drawdown",
              color: "text-orange-500",
              icon: ArrowTrendingUpIcon,
            },
            sharpeRatio: {
              label: "Sharpe Ratio",
              color: "text-green-500",
              icon: TrophyIcon,
            },
            betaToMarket: {
              label: "Beta to Market",
              color: "text-blue-500",
              icon: ChartBarIcon,
            },
            correlationRisk: {
              label: "Correlation Risk",
              color: "text-purple-500",
              icon: CircleStackIcon,
            },
            concentrationRisk: {
              label: "Concentration Risk",
              color: "text-yellow-500",
              icon: FireIcon,
            },
            liquidityRisk: {
              label: "Liquidity Risk",
              color: "text-indigo-500",
              icon: GlobeAltIcon,
            },
            autoStopLoss: {
              label: "Auto Stop Loss",
              color: "text-green-500",
              icon: ShieldCheckIcon,
            },
            positionSizing: {
              label: "Position Sizing",
              color: "text-blue-500",
              icon: AdjustmentsHorizontalIcon,
            },
            hedgeRatio: {
              label: "Hedge Ratio",
              color: "text-purple-500",
              icon: BoltIcon,
            },
          };

          const config = riskConfig[key] || {
            label: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            color: "text-gray-500",
            icon: ChartBarIcon,
          };
          const Icon = config.icon;

          return (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`p-6 rounded-2xl border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/50 border-gray-200/50"
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${config.color}`} />
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {value}
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {config.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-50"
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-40 h-40 border border-blue-500/5 rounded-2xl backdrop-blur-3xl" />
        <div className="absolute bottom-32 right-16 w-32 h-32 border border-green-500/5 rounded-full backdrop-blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Enhanced Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1
              className={`text-4xl md:text-5xl font-black mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Algorithmic Trading Engine
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              AI-powered options analysis and automated profit
              maximization[10][12]
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
              } backdrop-blur-xl border ${
                theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <ClockIcon className="w-5 h-5 text-green-500" />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <BoltIcon className="w-5 h-5" />
              <span>Optimize All</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl`
                    : theme === "dark"
                    ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50"
                    : "bg-white/50 text-gray-700 hover:bg-gray-50 border border-gray-200/50"
                } backdrop-blur-xl`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">{tab.label}</div>
                  <div
                    className={`text-xs opacity-80 ${
                      activeTab === tab.id ? "text-white" : ""
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {algoStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.id}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-3xl shadow-2xl border ${
                        theme === "dark"
                          ? "bg-gray-800/50 border-gray-700/50"
                          : "bg-white/50 border-gray-200/50"
                      } backdrop-blur-xl relative overflow-hidden`}
                    >
                      {/* Background Gradient */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-16 translate-x-16`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div
                            className={`text-right ${
                              stat.positive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            <div className="text-sm font-bold">
                              {stat.change}
                            </div>
                            <div className="text-xs opacity-80">
                              {stat.changeValue}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`text-sm mb-2 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {stat.label}
                        </div>

                        <div
                          className={`text-3xl font-black mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stat.value}
                        </div>

                        <div
                          className={`text-xs mb-2 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {stat.description}
                        </div>

                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span
                            className={`text-xs font-medium ${
                              theme === "dark"
                                ? "text-green-400"
                                : "text-green-600"
                            }`}
                          >
                            {stat.automation}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Deploy New Strategy",
                    icon: RocketLaunchIcon,
                    color: "bg-blue-600",
                  },
                  {
                    label: "Optimize Portfolio",
                    icon: AdjustmentsHorizontalIcon,
                    color: "bg-green-600",
                  },
                  {
                    label: "Run Backtest",
                    icon: BeakerIcon,
                    color: "bg-purple-600",
                  },
                  {
                    label: "Risk Analysis",
                    icon: ShieldCheckIcon,
                    color: "bg-red-600",
                  },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 p-4 rounded-xl text-white font-semibold hover:opacity-90 transition-all ${action.color}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : activeTab === "strategies" ? (
            renderStrategies()
          ) : activeTab === "signals" ? (
            renderSignals()
          ) : activeTab === "risk" ? (
            renderRiskManagement()
          ) : (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`text-center py-16 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="space-y-4">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <CommandLineIcon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold">
                  Advanced Feature Coming Soon
                </h3>
                <p>
                  This algorithmic trading feature is under development and will
                  be available soon.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Risk Disclosure */}
        <motion.div variants={itemVariants} className="mt-8">
          <div
            className={`flex items-start space-x-4 p-6 rounded-2xl border ${
              theme === "dark"
                ? "bg-amber-900/20 border-amber-500/30 text-amber-200"
                : "bg-amber-50 border-amber-200 text-amber-800"
            } backdrop-blur-xl`}
          >
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">
                  Algorithmic Trading Risk Disclosure:
                </span>{" "}
                Automated trading systems involve substantial risk of loss. Past
                performance of algorithms is not indicative of future results.
                Please ensure you understand the risks before enabling
                automation[7].
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedTradingDashboard;
