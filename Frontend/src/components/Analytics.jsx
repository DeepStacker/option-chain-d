import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
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
  Filler,
} from "chart.js";
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

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
  const theme = useSelector((state) => state.theme?.theme || "light");
  const [timeframe, setTimeframe] = useState("6M");
  const [selectedMetric, setSelectedMetric] = useState("returns");
  const [loading, setLoading] = useState(false);

  // Enhanced chart options with professional styling
  const commonOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: theme === "dark" ? "#E5E7EB" : "#4B5563",
            font: {
              size: 12,
              weight: "500",
            },
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor:
            theme === "dark"
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          titleColor: theme === "dark" ? "#F9FAFB" : "#111827",
          bodyColor: theme === "dark" ? "#D1D5DB" : "#374151",
          borderColor: theme === "dark" ? "#374151" : "#D1D5DB",
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: theme === "dark" ? "#9CA3AF" : "#6B7280",
            font: {
              size: 11,
            },
            padding: 8,
          },
          border: {
            display: false,
          },
        },
        x: {
          grid: {
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: theme === "dark" ? "#9CA3AF" : "#6B7280",
            font: {
              size: 11,
            },
            padding: 8,
          },
          border: {
            display: false,
          },
        },
      },
    }),
    [theme]
  );

  // Enhanced data with more realistic trading metrics
  const returnsData = useMemo(
    () => ({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Portfolio Returns (%)",
          data: [
            5.2, 8.1, 6.8, 12.3, 9.7, 15.2, 11.8, 14.5, 10.2, 16.8, 13.4, 18.9,
          ],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
        },
        {
          label: "Benchmark (NIFTY 50)",
          data: [
            4.1, 6.2, 8.3, 10.1, 8.9, 12.4, 9.8, 11.2, 8.7, 13.1, 10.5, 14.2,
          ],
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#EF4444",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
        },
      ],
    }),
    []
  );

  const volumeData = useMemo(
    () => ({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Trading Volume (₹ Lakhs)",
          data: [120, 190, 150, 220, 180, 250, 210, 280, 195, 320, 245, 380],
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "#3B82F6",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    []
  );

  const allocationData = useMemo(
    () => ({
      labels: [
        "Equity Options",
        "Index Futures",
        "Stock Futures",
        "Cash",
        "Others",
      ],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#EF4444",
          ],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    []
  );

  const performanceData = useMemo(
    () => ({
      labels: [
        "Risk Management",
        "Entry Timing",
        "Exit Strategy",
        "Position Sizing",
        "Discipline",
        "Market Analysis",
      ],
      datasets: [
        {
          label: "Performance Score",
          data: [85, 78, 82, 75, 90, 88],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "#3B82F6",
          borderWidth: 3,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    }),
    []
  );

  // Enhanced performance metrics
  const performanceMetrics = useMemo(
    () => [
      {
        label: "Total Trades",
        value: "1,247",
        change: "+156 this month",
        icon: ChartBarIcon,
        color: "text-blue-500",
      },
      {
        label: "Win Rate",
        value: "73.2%",
        change: "+2.1% vs last month",
        icon: TrophyIcon,
        color: "text-green-500",
      },
      {
        label: "Avg Return",
        value: "18.5%",
        change: "+3.2% vs benchmark",
        icon: ArrowTrendingUpIcon,
        color: "text-purple-500",
      },
      {
        label: "Sharpe Ratio",
        value: "2.14",
        change: "Excellent risk-adj return",
        icon: CurrencyDollarIcon,
        color: "text-orange-500",
      },
    ],
    []
  );

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Controls Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 items-center justify-between"
      >
        <div className="flex flex-wrap gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className={`px-6 py-3 rounded-xl border font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-700 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="ALL">All Time</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className={`px-6 py-3 rounded-xl border font-medium transition-all ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-700 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="returns">Returns Analysis</option>
            <option value="volume">Volume Analysis</option>
            <option value="allocation">Asset Allocation</option>
            <option value="performance">Performance Metrics</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Live Data
          </span>
        </div>
      </motion.div>

      {/* Performance Metrics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`p-6 rounded-2xl shadow-lg border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/50 border-gray-200/50"
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {metric.value}
                </div>
              </div>
              <div
                className={`text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {metric.label}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {metric.change}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Portfolio Returns Chart */}
        <motion.div
          variants={itemVariants}
          className={`p-8 rounded-3xl shadow-2xl border ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          } backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Portfolio vs Benchmark Returns
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-500">Portfolio</span>
              <div className="w-3 h-3 bg-red-500 rounded-full ml-4" />
              <span className="text-xs text-gray-500">Benchmark</span>
            </div>
          </div>
          <div className="h-[350px]">
            <Line data={returnsData} options={commonOptions} />
          </div>
        </motion.div>

        {/* Trading Volume Chart */}
        <motion.div
          variants={itemVariants}
          className={`p-8 rounded-3xl shadow-2xl border ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          } backdrop-blur-xl`}
        >
          <h3
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Monthly Trading Volume
          </h3>
          <div className="h-[350px]">
            <Bar data={volumeData} options={commonOptions} />
          </div>
        </motion.div>

        {/* Asset Allocation Chart */}
        <motion.div
          variants={itemVariants}
          className={`p-8 rounded-3xl shadow-2xl border ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          } backdrop-blur-xl`}
        >
          <h3
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Portfolio Allocation
          </h3>
          <div className="h-[350px] flex items-center justify-center">
            <div className="w-[300px] h-[300px]">
              <Doughnut
                data={allocationData}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: {
                      ...commonOptions.plugins.legend,
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Performance Radar Chart */}
        <motion.div
          variants={itemVariants}
          className={`p-8 rounded-3xl shadow-2xl border ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          } backdrop-blur-xl`}
        >
          <h3
            className={`text-xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Trading Performance Analysis
          </h3>
          <div className="h-[350px] flex items-center justify-center">
            <div className="w-[300px] h-[300px]">
              <Radar
                data={performanceData}
                options={{
                  ...commonOptions,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      angleLines: {
                        color:
                          theme === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                      },
                      grid: {
                        color:
                          theme === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                      },
                      ticks: {
                        color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                        backdropColor: "transparent",
                        font: {
                          size: 10,
                        },
                      },
                      pointLabels: {
                        color: theme === "dark" ? "#E5E7EB" : "#4B5563",
                        font: {
                          size: 11,
                          weight: "500",
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Disclosure */}
      <motion.div
        variants={itemVariants}
        className={`flex items-start space-x-4 p-6 rounded-2xl border ${
          theme === "dark"
            ? "bg-amber-900/20 border-amber-500/30 text-amber-200"
            : "bg-amber-50 border-amber-200 text-amber-800"
        } backdrop-blur-xl`}
      >
        <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Analytics Disclaimer:</span> The
            performance metrics and analytics shown are based on historical data
            and should not be considered as investment advice. Past performance
            does not guarantee future results.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
