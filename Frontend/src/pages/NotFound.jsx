import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  CommandLineIcon,
  SparklesIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  SignalIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowPathIcon,
  EyeIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const RobustNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [errorReported, setErrorReported] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("online");
  const [pageLoadTime] = useState(performance.now());
  const [visitHistory, setVisitHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Enhanced route mapping for your trading platform[1][3]
  const routeMap = useMemo(
    () => ({
      "/dashboard": {
        title: "Trading Dashboard",
        description: "Real-time portfolio monitoring and analytics",
        component: "TradingDashboard",
        category: "trading",
      },
      "/option-chain": {
        title: "Options Chain Analysis",
        description: "Live options data with Greeks calculation",
        component: "OptionChain",
        category: "options",
      },
      "/algorithms": {
        title: "Algorithmic Trading",
        description: "Automated trading strategies and backtesting",
        component: "AlgorithmicTrading",
        category: "automation",
      },
      "/portfolio": {
        title: "Portfolio Management",
        description: "Portfolio analysis and risk management",
        component: "Portfolio",
        category: "management",
      },
      "/analytics": {
        title: "Advanced Analytics",
        description: "Performance metrics and trading insights",
        component: "Analytics",
        category: "analytics",
      },
      "/market-data": {
        title: "Live Market Data",
        description: "Real-time market feeds and WebSocket connections",
        component: "MarketData",
        category: "data",
      },
      "/risk-management": {
        title: "Risk Management",
        description: "Automated risk controls and monitoring",
        component: "RiskManagement",
        category: "risk",
      },
      "/backtesting": {
        title: "Strategy Backtesting",
        description: "Historical strategy performance testing",
        component: "Backtesting",
        category: "testing",
      },
      "/api-docs": {
        title: "API Documentation",
        description: "Trading API endpoints and integration guides",
        component: "ApiDocs",
        category: "documentation",
      },
      "/contact": {
        title: "Professional Support",
        description: "Technical assistance and customer support",
        component: "Contact",
        category: "support",
      },
      "/profile": {
        title: "User Profile",
        description: "Account settings and preferences",
        component: "Profile",
        category: "account",
      },
      "/login": {
        title: "Secure Login",
        description: "Authentication and account access",
        component: "Login",
        category: "auth",
      },
    }),
    []
  );

  // Performance monitoring and error tracking[1]
  useEffect(() => {
    // Track 404 errors for analytics
    const errorData = {
      timestamp: new Date().toISOString(),
      path: location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      loadTime: pageLoadTime,
      sessionId: sessionStorage.getItem("sessionId") || "anonymous",
    };

    // Store error for debugging (in production, send to analytics service)
    console.warn("404 Error Tracked:", errorData);

    // Update visit history
    const history = JSON.parse(localStorage.getItem("visitHistory") || "[]");
    history.unshift({
      path: location.pathname,
      timestamp: new Date().toISOString(),
      type: "404-error",
    });
    localStorage.setItem("visitHistory", JSON.stringify(history.slice(0, 10)));
    setVisitHistory(history);
  }, [location.pathname, pageLoadTime]);

  // Real-time clock with performance optimization[1]
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Connection status monitoring for WebSocket trading data[3]
  useEffect(() => {
    const handleOnline = () => setConnectionStatus("online");
    const handleOffline = () => setConnectionStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Enhanced glitch effect with performance optimization
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 4000);
    return () => clearInterval(glitchTimer);
  }, []);

  // Optimized mouse tracking[2]
  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafId = null;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smart search with fuzzy matching and suggestions[4]
  const performSearch = useCallback(
    (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSuggestions([]);
        return;
      }

      const searchTerms = query.toLowerCase().split(" ");
      const results = [];
      const suggestionSet = new Set();

      Object.entries(routeMap).forEach(([path, info]) => {
        const searchText =
          `${info.title} ${info.description} ${info.category}`.toLowerCase();
        const matchScore = searchTerms.reduce((score, term) => {
          if (searchText.includes(term)) {
            return score + (searchText.indexOf(term) === 0 ? 2 : 1);
          }
          return score;
        }, 0);

        if (matchScore > 0) {
          results.push({ ...info, path, matchScore });
          suggestionSet.add(info.category);
        }
      });

      results.sort((a, b) => b.matchScore - a.matchScore);
      setSearchResults(results.slice(0, 6));
      setSuggestions(Array.from(suggestionSet).slice(0, 4));
    },
    [routeMap]
  );

  // Debounced search for performance[1]
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, performSearch]);

  // Enhanced error reporting functionality
  const reportError = useCallback(async () => {
    if (errorReported) return;

    const errorReport = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: navigator.connection?.effectiveType || "unknown",
      visitHistory: visitHistory.slice(0, 5),
    };

    try {
      // In production, send to your error tracking service
      console.log("Error Report:", errorReport);
      setErrorReported(true);
      toast.success(
        "Error reported successfully. Thank you for helping us improve!"
      );
    } catch (error) {
      toast.error("Failed to report error. Please try again later.");
    }
  }, [location.pathname, visitHistory, errorReported]);

  // Smart route suggestions based on current path
  const getSmartSuggestions = useCallback(() => {
    const currentPath = location.pathname.toLowerCase();
    const suggestions = [];

    // Analyze path segments for intelligent suggestions
    if (currentPath.includes("trade") || currentPath.includes("trading")) {
      suggestions.push("/dashboard", "/option-chain", "/algorithms");
    } else if (
      currentPath.includes("option") ||
      currentPath.includes("chain")
    ) {
      suggestions.push("/option-chain", "/analytics", "/risk-management");
    } else if (currentPath.includes("algo") || currentPath.includes("bot")) {
      suggestions.push("/algorithms", "/backtesting", "/analytics");
    } else if (currentPath.includes("api") || currentPath.includes("doc")) {
      suggestions.push("/api-docs", "/contact", "/profile");
    } else {
      // Default suggestions for unknown paths
      suggestions.push("/dashboard", "/option-chain", "/contact");
    }

    return suggestions.slice(0, 3).map((path) => ({
      path,
      ...routeMap[path],
    }));
  }, [location.pathname, routeMap]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        if (searchResults.length > 0) {
          navigate(searchResults[0].path);
        } else {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
      }
    },
    [searchQuery, searchResults, navigate]
  );

  // Enhanced quick actions with performance categories[5]
  const quickActions = useMemo(
    () => [
      {
        icon: ChartBarIcon,
        label: "Trading Dashboard",
        path: "/dashboard",
        description: "Real-time portfolio and analytics",
        color: "from-blue-500 to-blue-600",
        category: "primary",
      },
      {
        icon: CpuChipIcon,
        label: "Options Chain",
        path: "/option-chain",
        description: "Live options analysis with Greeks",
        color: "from-green-500 to-green-600",
        category: "primary",
      },
      {
        icon: RocketLaunchIcon,
        label: "Algo Trading",
        path: "/algorithms",
        description: "Automated Python strategies",
        color: "from-purple-500 to-purple-600",
        category: "advanced",
      },
      {
        icon: SignalIcon,
        label: "Market Data",
        path: "/market-data",
        description: "WebSocket real-time feeds",
        color: "from-orange-500 to-orange-600",
        category: "data",
      },
      {
        icon: ShieldCheckIcon,
        label: "Risk Management",
        path: "/risk-management",
        description: "Automated risk controls",
        color: "from-red-500 to-red-600",
        category: "risk",
      },
      {
        icon: DocumentTextIcon,
        label: "API Documentation",
        path: "/api-docs",
        description: "Integration guides and endpoints",
        color: "from-indigo-500 to-indigo-600",
        category: "docs",
      },
    ],
    []
  );

  // Animation variants with performance optimization
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const glitchVariants = {
    normal: { x: 0, textShadow: "none" },
    glitch: {
      x: [-1, 1, -1, 1, 0],
      textShadow: [
        "1px 0 #ff0000, -1px 0 #00ffff",
        "-1px 0 #ff0000, 1px 0 #00ffff",
        "1px 0 #ff0000, -1px 0 #00ffff",
        "-1px 0 #ff0000, 1px 0 #00ffff",
        "none",
      ],
      transition: { duration: 0.15 },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-50"
      }`}
    >
      {/* Performance-optimized background elements[1] */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-blue-500/5 rounded-3xl backdrop-blur-3xl"
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/5 rounded-full backdrop-blur-3xl"
          animate={{
            y: [5, -5, 5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Optimized cursor follower[2] */}
        <motion.div
          className="absolute w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            background:
              theme === "dark"
                ? "rgba(59, 130, 246, 0.6)"
                : "rgba(59, 130, 246, 0.4)",
            left: mousePosition.x - 8,
            top: mousePosition.y - 8,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Status indicators */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            connectionStatus === "online"
              ? "bg-green-500/20 text-green-600 border border-green-500/30"
              : "bg-red-500/20 text-red-600 border border-red-500/30"
          } backdrop-blur-xl`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "online" ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          />
          <span>
            {connectionStatus === "online"
              ? "Trading Data Connected"
              : "Connection Lost"}
          </span>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced 404 with glitch effect */}
          <motion.div className="relative mb-8" variants={itemVariants}>
            <motion.div
              className="relative inline-block"
              variants={glitchVariants}
              animate={glitchEffect ? "glitch" : "normal"}
            >
              <span
                className={`text-[8rem] md:text-[12rem] font-black leading-none ${
                  theme === "dark" ? "text-gray-800/20" : "text-gray-200/40"
                }`}
              >
                404
              </span>
              <motion.span
                className="absolute top-0 left-0 text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                404
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Enhanced error message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1
              className={`text-3xl md:text-4xl font-black mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Trading Route Not Found
            </h1>
            <p
              className={`text-lg md:text-xl mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              This algorithmic path doesn't exist in our trading infrastructure
            </p>
            <div
              className={`flex flex-wrap items-center justify-center gap-4 text-sm ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>Path: {location.pathname}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BoltIcon className="w-4 h-4" />
                <span>Load: {Math.round(pageLoadTime)}ms</span>
              </div>
            </div>
          </motion.div>

          {/* Enhanced search with real-time results */}
          <motion.div variants={itemVariants} className="mb-12">
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trading features, APIs, documentation..."
                  className={`w-full px-6 py-4 pl-12 rounded-2xl border-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } backdrop-blur-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20`}
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                {/* Real-time search results dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full left-0 right-0 mt-2 rounded-xl border ${
                        theme === "dark"
                          ? "bg-gray-800/90 border-gray-700"
                          : "bg-white/90 border-gray-200"
                      } backdrop-blur-xl shadow-2xl z-50 max-h-64 overflow-y-auto`}
                    >
                      {searchResults.map((result, index) => (
                        <motion.button
                          key={result.path}
                          onClick={() => navigate(result.path)}
                          whileHover={{
                            backgroundColor:
                              theme === "dark"
                                ? "rgba(55, 65, 81, 0.5)"
                                : "rgba(243, 244, 246, 0.5)",
                          }}
                          className="w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          <div
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {result.title}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {result.description}
                          </div>
                          <div className="text-xs text-blue-500 mt-1">
                            {result.path}
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Suggestions:
                </span>
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 rounded-full text-xs ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Smart suggestions based on current path */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              You might be looking for:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getSmartSuggestions().map((suggestion, index) => (
                <motion.button
                  key={suggestion.path}
                  onClick={() => navigate(suggestion.path)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                      : "bg-white/50 border-gray-200/50 hover:bg-white/80"
                  } backdrop-blur-xl`}
                >
                  <div
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {suggestion.title}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {suggestion.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced quick actions grid with categories */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2
              className={`text-2xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Trading Platform Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={() => navigate(action.path)}
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      boxShadow:
                        theme === "dark"
                          ? "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                          : "0 20px 40px -10px rgba(59, 130, 246, 0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                        : "bg-white/50 border-gray-200/50 hover:bg-white/80"
                    } backdrop-blur-xl group text-left`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          action.category === "primary"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : action.category === "advanced"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            : action.category === "risk"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        }`}
                      >
                        {action.category}
                      </span>
                    </div>
                    <h3
                      className={`font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {action.label}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {action.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced navigation buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50"
                  : "bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-200/50"
              } backdrop-blur-xl shadow-lg hover:shadow-xl`}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Trading Dashboard</span>
            </motion.button>

            <motion.button
              onClick={reportError}
              disabled={errorReported}
              whileHover={{ scale: errorReported ? 1 : 1.05 }}
              whileTap={{ scale: errorReported ? 1 : 0.95 }}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                errorReported
                  ? "bg-green-600/50 text-green-200 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              } shadow-lg hover:shadow-xl`}
            >
              <BugAntIcon className="w-5 h-5" />
              <span>{errorReported ? "Reported" : "Report Issue"}</span>
            </motion.button>
          </motion.div>

          {/* Enhanced technical details with performance metrics */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-2xl border ${
              theme === "dark"
                ? "bg-amber-900/20 border-amber-500/30"
                : "bg-amber-50 border-amber-200"
            } backdrop-blur-xl`}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
              <h3
                className={`font-semibold ${
                  theme === "dark" ? "text-amber-300" : "text-amber-800"
                }`}
              >
                Technical Analysis
              </h3>
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${
                theme === "dark" ? "text-amber-200/80" : "text-amber-700"
              }`}
            >
              <div>
                <p>
                  <strong>Error Code:</strong> HTTP 404 - Resource Not Found
                </p>
                <p>
                  <strong>Requested Path:</strong> {location.pathname}
                </p>
                <p>
                  <strong>Timestamp:</strong> {currentTime.toISOString()}
                </p>
                <p>
                  <strong>Load Time:</strong> {Math.round(pageLoadTime)}ms
                </p>
              </div>
              <div>
                <p>
                  <strong>Connection:</strong> {connectionStatus}
                </p>
                <p>
                  <strong>Session:</strong>{" "}
                  {sessionStorage.getItem("sessionId")?.slice(0, 8) ||
                    "Anonymous"}
                </p>
                <p>
                  <strong>Referrer:</strong> {document.referrer || "Direct"}
                </p>
                <p>
                  <strong>Viewport:</strong> {window.innerWidth}x
                  {window.innerHeight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Performance insights */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <SparklesIcon
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-500"
                }`}
              />
            </motion.div>
            <p
              className={`text-sm mt-2 ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              "In algorithmic trading and software development, every error
              teaches us to optimize better"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RobustNotFound;
