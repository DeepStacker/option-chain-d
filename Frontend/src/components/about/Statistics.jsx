import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaStar,
  FaRocket,
  FaShieldAlt,
  FaClock,
  FaDollarSign,
  FaDatabase,
  FaNetworkWired,
  FaTrophy,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// Professional trading statistics data with real-time capabilities
const TRADING_STATISTICS = {
  users: {
    id: "active-users",
    icon: FaUsers,
    value: 15247,
    displayValue: "15K+",
    label: "Active Traders",
    description: "Professional traders using our platform daily",
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    trend: "+12%",
    trendDirection: "up",
    category: "engagement",
  },
  trades: {
    id: "trades-analyzed",
    icon: FaChartLine,
    value: 2847392,
    displayValue: "2.8M+",
    label: "Options Analyzed",
    description: "Real-time options chain analysis performed",
    color: "text-green-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    trend: "+8%",
    trendDirection: "up",
    category: "performance",
  },
  dataPoints: {
    id: "data-points",
    icon: FaDatabase,
    value: 847392847,
    displayValue: "847M+",
    label: "Data Points",
    description: "Market data points processed per day",
    color: "text-purple-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    trend: "+25%",
    trendDirection: "up",
    category: "performance",
  },
  uptime: {
    id: "system-uptime",
    icon: FaShieldAlt,
    value: 99.97,
    displayValue: "99.97%",
    label: "System Uptime",
    description: "Reliable trading infrastructure guarantee",
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/10 to-green-500/10",
    trend: "+0.02%",
    trendDirection: "up",
    category: "reliability",
  },
  responseTime: {
    id: "response-time",
    icon: FaClock,
    value: 47,
    displayValue: "<50ms",
    label: "Response Time",
    description: "Average API response time for real-time data",
    color: "text-orange-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    trend: "-15ms",
    trendDirection: "up",
    category: "performance",
  },
  satisfaction: {
    id: "user-satisfaction",
    icon: FaStar,
    value: 4.87,
    displayValue: "4.87★",
    label: "User Rating",
    description: "Average satisfaction from verified traders",
    color: "text-yellow-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    trend: "+0.12",
    trendDirection: "up",
    category: "engagement",
  },
  countries: {
    id: "global-reach",
    icon: FaGlobe,
    value: 73,
    displayValue: "73+",
    label: "Countries",
    description: "Global trading community reach",
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    trend: "+5",
    trendDirection: "up",
    category: "engagement",
  },
  accuracy: {
    id: "prediction-accuracy",
    icon: FaTrophy,
    value: 84.3,
    displayValue: "84.3%",
    label: "Signal Accuracy",
    description: "ML-powered trading signal accuracy rate",
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    trend: "+2.1%",
    trendDirection: "up",
    category: "performance",
  },
};

// Enhanced Error Boundary Fallback
const StatisticsErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div
    className={`p-8 text-center rounded-lg border ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-gray-300"
        : "bg-gray-50 border-gray-200 text-gray-600"
    }`}
  >
    <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-500" />
    <h3 className="text-lg font-semibold mb-2">Statistics unavailable</h3>
    <p className="text-sm mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
        theme === "dark"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      Reload Statistics
    </button>
  </div>
));

StatisticsErrorFallback.displayName = "StatisticsErrorFallback";

// Loading Skeleton Component
const StatisticSkeleton = memo(({ theme }) => (
  <div
    className={`p-6 rounded-xl border animate-pulse ${
      theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-gray-100 border-gray-200"
    }`}
  >
    <div
      className={`w-12 h-12 rounded-lg mx-auto mb-4 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-8 rounded w-20 mx-auto mb-2 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-4 rounded w-24 mx-auto mb-2 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-3 rounded w-32 mx-auto ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
  </div>
));

StatisticSkeleton.displayName = "StatisticSkeleton";

// Enhanced Statistic Card Component
const StatisticCard = memo(({ stat, index, theme, isRealTime = false }) => {
  const [currentValue, setCurrentValue] = useState(stat.value);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  const Icon = stat.icon;

  // Simulate real-time updates for demonstration[3]
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const variation = stat.value * 0.001; // 0.1% variation
      const newValue = stat.value + (Math.random() - 0.5) * variation;

      setIsAnimating(true);
      setCurrentValue(Math.max(0, newValue));

      setTimeout(() => setIsAnimating(false), 300);
    }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, [stat.value, isRealTime]);

  // Format display value based on current value
  const formatValue = useCallback(
    (value) => {
      if (stat.id === "response-time") return `<${Math.round(value)}ms`;
      if (stat.id === "system-uptime" || stat.id === "prediction-accuracy")
        return `${value.toFixed(2)}%`;
      if (stat.id === "user-satisfaction") return `${value.toFixed(2)}★`;
      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B+`;
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M+`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K+`;
      return value.toString();
    },
    [stat.id]
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: index * 0.1 + 0.3,
      },
    },
  };

  const valueVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1 + 0.5,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={`
        group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300
        ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700 hover:border-gray-600"
            : "bg-white/80 border-gray-200 hover:border-gray-300"
        }
        hover:shadow-xl hover:shadow-black/10
        ${isAnimating ? "ring-2 ring-blue-500/50" : ""}
      `}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
      />

      {/* Real-time indicator */}
      {isRealTime && (
        <div className="absolute top-3 right-3">
          <div
            className={`w-2 h-2 rounded-full bg-green-500 ${
              isAnimating ? "animate-ping" : "animate-pulse"
            }`}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 text-center">
        {/* Icon */}
        <motion.div
          variants={iconVariants}
          className={`
            inline-flex p-4 rounded-2xl mb-4 shadow-lg transition-all duration-300 group-hover:scale-110
            ${theme === "dark" ? "bg-gray-700/80" : "bg-white/80"}
          `}
        >
          <Icon className={`text-3xl ${stat.color}`} />
        </motion.div>

        {/* Value */}
        <motion.div variants={valueVariants}>
          <h3
            className={`
            text-4xl font-bold mb-2 transition-all duration-300
            ${theme === "dark" ? "text-white" : "text-gray-900"}
            ${isAnimating ? "scale-110 text-blue-500" : ""}
          `}
          >
            {formatValue(currentValue)}
          </h3>

          {/* Trend indicator */}
          <div className="flex items-center justify-center mb-2">
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.trendDirection === "up"
                  ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                  : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
              }`}
            >
              {stat.trendDirection === "up" ? "↗" : "↘"} {stat.trend}
            </span>
          </div>
        </motion.div>

        {/* Label */}
        <h4
          className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {stat.label}
        </h4>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {stat.description}
        </p>

        {/* Category badge */}
        <div className="mt-4">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              stat.category === "performance"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : stat.category === "engagement"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {stat.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

StatisticCard.displayName = "StatisticCard";

StatisticCard.propTypes = {
  stat: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  isRealTime: PropTypes.bool,
};

// Main Statistics Component
const Statistics = memo(
  ({
    className = "",
    showRealTime = true,
    customStats = null,
    title = "Platform Performance",
    subtitle = "Real-time analytics powering professional options trading",
  }) => {
    const theme = useSelector((state) => state.theme?.theme || "light")[1];
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"],
    });

    // Use custom stats or default trading statistics
    const statistics = useMemo(
      () => customStats || TRADING_STATISTICS,
      [customStats]
    );

    // Filter statistics by category
    const filteredStats = useMemo(() => {
      const statsArray = Object.values(statistics);
      if (selectedCategory === "all") return statsArray;
      return statsArray.filter((stat) => stat.category === selectedCategory);
    }, [statistics, selectedCategory]);

    // Get unique categories
    const categories = useMemo(() => {
      const cats = [
        ...new Set(Object.values(statistics).map((stat) => stat.category)),
      ];
      return ["all", ...cats];
    }, [statistics]);

    // Simulate loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    }, []);

    // Scroll-based animations
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    // Handle category change
    const handleCategoryChange = useCallback(
      (category) => {
        setSelectedCategory(category);

        // Analytics tracking
        if (typeof gtag !== "undefined") {
          gtag("event", "statistics_filter", {
            category: category,
            total_stats: filteredStats.length,
          });
        }
      },
      [filteredStats.length]
    );

    // Animation variants
    const containerVariants = useMemo(
      () => ({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }),
      []
    );

    const headerVariants = useMemo(
      () => ({
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 },
        },
      }),
      []
    );

    return (
      <ErrorBoundary
        FallbackComponent={(props) => (
          <StatisticsErrorFallback {...props} theme={theme} />
        )}
        onError={(error) => {
          console.error("Statistics Error:", error);
          toast.error("Failed to load statistics");
        }}
      >
        <motion.section
          ref={sectionRef}
          style={{ scale, opacity }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={`py-16 ${className}`}
          aria-labelledby="statistics-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div variants={headerVariants} className="text-center mb-12">
              <h2
                id="statistics-title"
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {subtitle}[2][5]
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Statistics Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 8 }, (_, index) => (
                  <StatisticSkeleton key={index} theme={theme} />
                ))
              ) : (
                // Statistics cards
                <AnimatePresence mode="wait">
                  {filteredStats.map((stat, index) => (
                    <StatisticCard
                      key={stat.id}
                      stat={stat}
                      index={index}
                      theme={theme}
                      isRealTime={showRealTime}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={headerVariants}
              className={`text-center p-8 rounded-2xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50"
                  : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Join the Trading Revolution
              </h3>
              <p
                className={`text-lg mb-6 max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Experience the power of professional-grade options analysis with
                real-time data processing and advanced trading algorithms[4][6]
              </p>
              <button
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                Start Trading Today
              </button>
            </motion.div>
          </div>
        </motion.section>
      </ErrorBoundary>
    );
  }
);

Statistics.displayName = "Statistics";

Statistics.propTypes = {
  className: PropTypes.string,
  showRealTime: PropTypes.bool,
  customStats: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Statistics;
