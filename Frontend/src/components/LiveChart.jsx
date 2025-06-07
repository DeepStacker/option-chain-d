// src/components/LiveChart.jsx
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  XMarkIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { Line, Bar } from "react-chartjs-2";
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
  Filler,
} from "chart.js";

// Register Chart.js components
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

// Professional Live Chart Component[1][2]
const LiveChart = memo(({ onClose, theme, symbol = "NIFTY" }) => {
  const [chartData, setChartData] = useState({});
  const [timeframe, setTimeframe] = useState("1D");
  const [chartType, setChartType] = useState("line");
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const wsRef = useRef(null);

  // Generate realistic options price data[2]
  const generatePriceData = useCallback(() => {
    const labels = [];
    const prices = [];
    const volumes = [];
    const basePrice = 18500;

    for (let i = 0; i < 50; i++) {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (50 - i));
      labels.push(
        time.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      const price = i === 0 ? basePrice : prices[i - 1] * (1 + change);
      prices.push(Math.round(price * 100) / 100);
      volumes.push(Math.floor(Math.random() * 1000000) + 500000);
    }

    return { labels, prices, volumes };
  }, []);

  // WebSocket connection for real-time data[1]
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(
        `wss://api.deepstrike.com/live-data/${symbol}`
      );

      wsRef.current.onopen = () => {
        console.log("Live chart WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Update chart with real-time data
        setChartData((prev) => ({
          ...prev,
          datasets: prev.datasets?.map((dataset) => ({
            ...dataset,
            data: [...dataset.data.slice(1), data.price],
          })),
        }));
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    // Initialize chart data
    const { labels, prices, volumes } = generatePriceData();

    setChartData({
      labels,
      datasets: [
        {
          label: `${symbol} Price`,
          data: prices,
          borderColor: theme === "dark" ? "#3B82F6" : "#2563EB",
          backgroundColor:
            theme === "dark"
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(37, 99, 235, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    });

    setIsLoading(false);
    connectWebSocket();

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newPrice =
        prices[prices.length - 1] * (1 + (Math.random() - 0.5) * 0.01);
      setChartData((prev) => ({
        ...prev,
        datasets: prev.datasets?.map((dataset) => ({
          ...dataset,
          data: [...dataset.data.slice(1), Math.round(newPrice * 100) / 100],
        })),
      }));
    }, 2000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(interval);
    };
  }, [symbol, theme, generatePriceData]);

  // Chart options with professional styling[4]
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: theme === "dark" ? "#374151" : "#F9FAFB",
        titleColor: theme === "dark" ? "#F9FAFB" : "#111827",
        bodyColor: theme === "dark" ? "#D1D5DB" : "#374151",
        borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: theme === "dark" ? "#374151" : "#E5E7EB",
          drawBorder: false,
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        position: "right",
        grid: {
          color: theme === "dark" ? "#374151" : "#E5E7EB",
          drawBorder: false,
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const timeframes = ["1M", "5M", "15M", "1H", "1D", "1W"];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div
          className={`p-8 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-center">Loading Live Chart...</p>
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-4">
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
            <div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Live Chart - {symbol}
              </h2>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Real-time price movements and analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timeframe Selector */}
            <div className="flex space-x-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tf}
                </button>
              ))}
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
        </div>

        {/* Chart Container */}
        <div className="p-6 h-full">
          <div className="h-full">
            {chartData.datasets && (
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

LiveChart.displayName = "LiveChart";

export default LiveChart;
