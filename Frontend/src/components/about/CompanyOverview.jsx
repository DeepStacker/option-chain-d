import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaRocket,
  FaBrain,
  FaNetworkWired,
  FaCog,
  FaDatabase,
  FaChartBar,
  FaCalculator,
  FaBell,
  FaMobile,
  FaCloud,
  FaGraduationCap,
  FaHandshake,
  FaAward,
  FaGlobe,
  FaCode,
  FaExclamationTriangle,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// // Lazy load demo components
// const LiveDemo = lazy(() => import("./LiveDemo"));
// const TechnologyShowcase = lazy(() => import("./TechnologyShowcase"));

// Comprehensive platform features based on your expertise[1][2][3][4][5][6][7]
const PLATFORM_FEATURES = {
  // Core Trading Features
  advancedAnalytics: {
    id: "advanced-analytics",
    category: "trading",
    icon: FaChartLine,
    title: "Advanced Options Analytics",
    shortDesc: "Professional-grade options chain analysis",
    description:
      "Real-time options chain analysis with advanced Greeks calculations, volatility modeling, and predictive analytics powered by machine learning algorithms.",
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    features: [
      "Real-time Delta, Gamma, Theta, Vega calculations",
      "Implied volatility surface modeling",
      "Options flow analysis and unusual activity detection",
      "Multi-timeframe technical analysis integration",
      "Custom screeners and alerts for trading opportunities",
    ],
    technologies: ["Python", "React", "WebSocket", "Machine Learning"],
    metrics: {
      updateSpeed: "< 100ms",
      accuracy: "99.9%",
      dataPoints: "1M+/sec",
    },
  },

  // Real-time Infrastructure
  realTimeData: {
    id: "real-time-data",
    category: "infrastructure",
    icon: FaNetworkWired,
    title: "Real-Time Trading Infrastructure",
    shortDesc: "WebSocket-powered live market data",
    description:
      "High-performance WebSocket connections delivering real-time market data with sub-100ms latency, optimized for professional trading requirements.",
    color: "text-green-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    features: [
      "WebSocket-based real-time data streaming",
      "Optimized API calls for reduced latency",
      "Redundant data feeds for 99.99% uptime",
      "Smart caching and data compression",
      "Real-time order book and trade data",
    ],
    technologies: ["WebSocket", "Redis", "Kafka", "Docker"],
    metrics: {
      latency: "< 50ms",
      uptime: "99.99%",
      throughput: "10K req/sec",
    },
  },

  // AI-Powered Insights
  aiInsights: {
    id: "ai-insights",
    category: "intelligence",
    icon: FaBrain,
    title: "AI-Powered Trading Intelligence",
    shortDesc: "Machine learning for market predictions",
    description:
      "Advanced algorithmic trading systems for Indian markets using Python, with AI-powered insights and recommendations for portfolio optimization.",
    color: "text-purple-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    features: [
      "Machine learning pattern recognition",
      "Sentiment analysis from news and social media",
      "Predictive modeling for price movements",
      "Risk assessment algorithms",
      "Automated trading signal generation",
    ],
    technologies: ["Python", "TensorFlow", "Scikit-learn", "NLP"],
    metrics: {
      accuracy: "84.3%",
      signals: "500+/day",
      models: "15+ active",
    },
  },

  // Professional Interface
  userInterface: {
    id: "user-interface",
    category: "design",
    icon: FaMobile,
    title: "Professional Trading Interface",
    shortDesc: "User-friendly responsive design",
    description:
      "Modern, responsive web interface built with React and Vite, focusing on efficient data display and professional options analysis presentation.",
    color: "text-orange-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    features: [
      "Responsive design for all devices",
      "Customizable dashboard layouts",
      "Advanced charting and visualization",
      "Dark/light theme support",
      "Professional trading workspace",
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    metrics: {
      loadTime: "< 2s",
      responsive: "100%",
      accessibility: "WCAG 2.1",
    },
  },

  // State Management
  stateManagement: {
    id: "state-management",
    category: "architecture",
    icon: FaCog,
    title: "Advanced State Management",
    shortDesc: "React Redux with real-time updates",
    description:
      "Sophisticated state management using React Redux with toast notifications, environment toggles, and optimized performance for real-time trading data.",
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    features: [
      "Redux Toolkit for efficient state management",
      "Real-time state synchronization",
      "Optimistic updates for better UX",
      "Persistent state with localStorage",
      "Advanced middleware for async operations",
    ],
    technologies: ["Redux Toolkit", "React", "WebSocket", "LocalStorage"],
    metrics: {
      performance: "60 FPS",
      memory: "Optimized",
      scalability: "Enterprise",
    },
  },

  // Security & Reliability
  security: {
    id: "security",
    category: "security",
    icon: FaShieldAlt,
    title: "Enterprise-Grade Security",
    shortDesc: "Bank-level security measures",
    description:
      "Comprehensive security framework with encryption, authentication, and monitoring to protect trading data and user investments.",
    color: "text-red-500",
    bgGradient: "from-red-500/10 to-pink-500/10",
    features: [
      "End-to-end encryption for all data",
      "Multi-factor authentication",
      "Real-time security monitoring",
      "Compliance with financial regulations",
      "Regular security audits and updates",
    ],
    technologies: ["JWT", "OAuth 2.0", "SSL/TLS", "Firebase Auth"],
    metrics: {
      encryption: "AES-256",
      compliance: "SOC 2",
      monitoring: "24/7",
    },
  },

  // Support & Education
  support: {
    id: "support",
    category: "service",
    icon: FaUsers,
    title: "Expert Support & Education",
    shortDesc: "24/7 professional trading support",
    description:
      "Dedicated team of financial experts and developers providing comprehensive support, education, and guidance for traders at all levels.",
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    features: [
      "24/7 technical and trading support",
      "Comprehensive trading education resources",
      "Regular webinars and market analysis",
      "Community forums and knowledge base",
      "Personal trading consultations",
    ],
    technologies: ["Live Chat", "Video Conferencing", "Knowledge Base"],
    metrics: {
      responseTime: "< 5 min",
      satisfaction: "98%",
      availability: "24/7",
    },
  },

  // Analytics & Reporting
  reporting: {
    id: "reporting",
    category: "analytics",
    icon: FaChartBar,
    title: "Advanced Analytics & Reporting",
    shortDesc: "Comprehensive trading analytics",
    description:
      "Detailed performance analytics, risk assessment, and comprehensive reporting tools for professional portfolio management and analysis.",
    color: "text-yellow-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    features: [
      "Real-time P&L tracking and analysis",
      "Risk metrics and exposure analysis",
      "Performance attribution reporting",
      "Tax optimization and reporting",
      "Custom analytics dashboards",
    ],
    technologies: ["Python", "Pandas", "Chart.js", "PDF Generation"],
    metrics: {
      reports: "50+ types",
      automation: "100%",
      accuracy: "99.9%",
    },
  },
};

// Enhanced Error Boundary Fallback
const OverviewErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div
    className={`p-8 text-center rounded-lg border ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-gray-300"
        : "bg-gray-50 border-gray-200 text-gray-600"
    }`}
  >
    <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-500" />
    <h3 className="text-lg font-semibold mb-2">
      Platform overview unavailable
    </h3>
    <p className="text-sm mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
        theme === "dark"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      Reload Overview
    </button>
  </div>
));

OverviewErrorFallback.displayName = "OverviewErrorFallback";

// Loading Skeleton Component
const FeatureSkeleton = memo(({ theme }) => (
  <div
    className={`p-6 rounded-xl border animate-pulse ${
      theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-gray-100 border-gray-200"
    }`}
  >
    <div
      className={`w-16 h-16 rounded-lg mx-auto mb-4 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-6 rounded w-32 mx-auto mb-2 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-4 rounded w-full mb-2 ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
    <div
      className={`h-4 rounded w-3/4 mx-auto ${
        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
      }`}
    />
  </div>
));

FeatureSkeleton.displayName = "FeatureSkeleton";

// Enhanced Feature Card Component
const FeatureCard = memo(
  ({ feature, index, theme, onLearnMore, isExpanded, onToggleExpand }) => {
    const Icon = feature.icon;
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true });

    const handleLearnMore = useCallback(() => {
      onLearnMore(feature);
    }, [feature, onLearnMore]);

    const handleToggleExpand = useCallback(() => {
      onToggleExpand(feature.id);
    }, [feature.id, onToggleExpand]);

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
      `}
      >
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`}
        />

        {/* Content */}
        <div className="relative p-6">
          {/* Icon */}
          <div
            className={`
          inline-flex p-4 rounded-2xl mb-4 shadow-lg transition-all duration-300 group-hover:scale-110
          ${theme === "dark" ? "bg-gray-700/80" : "bg-white/80"}
        `}
          >
            <Icon className={`text-3xl ${feature.color}`} />
          </div>

          {/* Title & Description */}
          <h3
            className={`text-xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {feature.title}
          </h3>

          <p
            className={`text-sm font-medium mb-3 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {feature.shortDesc}
          </p>

          <p
            className={`text-sm leading-relaxed mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {feature.description}
          </p>

          {/* Expandable Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <h4
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Key Features:
                </h4>
                <ul className="space-y-1 mb-4">
                  {feature.features.map((item, idx) => (
                    <li
                      key={idx}
                      className={`text-xs flex items-start ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0 ${feature.color.replace(
                          "text-",
                          "bg-"
                        )}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
                <div className="mb-4">
                  <h4
                    className={`text-sm font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {feature.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics */}
          <div
            className={`grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            {Object.entries(feature.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className={`text-sm font-bold ${feature.color}`}>
                  {value}
                </div>
                <div
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggleExpand}
              className={`text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {isExpanded ? "Show Less" : "Learn More"}
            </button>

            <button
              onClick={handleLearnMore}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Try Feature
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                feature.category === "trading"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : feature.category === "infrastructure"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : feature.category === "intelligence"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300"
              }`}
            >
              {feature.category}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

FeatureCard.propTypes = {
  feature: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  onLearnMore: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

// Main Company Overview Component
const CompanyOverview = memo(
  ({ className = "", showDemo = true, customFeatures = null }) => {
    const theme = useSelector((state) => state.theme?.theme || "light")[2];

    const [expandedFeatures, setExpandedFeatures] = useState(new Set());
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLiveDemo, setShowLiveDemo] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Use custom features or default platform features
    const features = useMemo(
      () => customFeatures || PLATFORM_FEATURES,
      [customFeatures]
    );

    // Filter features by category
    const filteredFeatures = useMemo(() => {
      const featuresArray = Object.values(features);
      if (selectedCategory === "all") return featuresArray;
      return featuresArray.filter(
        (feature) => feature.category === selectedCategory
      );
    }, [features, selectedCategory]);

    // Get unique categories
    const categories = useMemo(() => {
      const cats = [
        ...new Set(Object.values(features).map((feature) => feature.category)),
      ];
      return ["all", ...cats];
    }, [features]);

    // Simulate loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    // Handle feature expansion
    const handleToggleExpand = useCallback((featureId) => {
      setExpandedFeatures((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(featureId)) {
          newSet.delete(featureId);
        } else {
          newSet.add(featureId);
        }
        return newSet;
      });
    }, []);

    // Handle learn more
    const handleLearnMore = useCallback((feature) => {
      setSelectedFeature(feature);
      toast.info(`Exploring ${feature.title} feature`);

      // Analytics tracking
      if (typeof gtag !== "undefined") {
        gtag("event", "feature_interest", {
          feature_id: feature.id,
          feature_name: feature.title,
          category: feature.category,
        });
      }
    }, []);

    // Handle category change
    const handleCategoryChange = useCallback((category) => {
      setSelectedCategory(category);
    }, []);

    // Handle demo toggle
    const handleDemoToggle = useCallback(() => {
      setShowLiveDemo(!showLiveDemo);
    }, [showLiveDemo]);

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
          <OverviewErrorFallback {...props} theme={theme} />
        )}
        onError={(error) => {
          console.error("CompanyOverview Error:", error);
          toast.error("Failed to load platform overview");
        }}
      >
        <motion.section
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`py-16 ${className}`}
          aria-labelledby="company-overview-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div variants={headerVariants} className="text-center mb-12">
              <h2
                id="company-overview-title"
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose DeepStrike
              </h2>
              <p
                className={`text-xl max-w-4xl mx-auto leading-relaxed mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Professional-grade options trading platform built with
                cutting-edge technology, real-time analytics, and AI-powered
                insights for serious traders
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
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

              {/* Live Demo Button */}
              {showDemo && (
                <button
                  onClick={handleDemoToggle}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  } shadow-lg hover:shadow-xl`}
                >
                  <FaPlay className="inline mr-2" />
                  Experience Live Demo
                </button>
              )}
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 8 }, (_, index) => (
                  <FeatureSkeleton key={index} theme={theme} />
                ))
              ) : (
                // Feature cards
                <AnimatePresence mode="wait">
                  {filteredFeatures.map((feature, index) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      index={index}
                      theme={theme}
                      onLearnMore={handleLearnMore}
                      isExpanded={expandedFeatures.has(feature.id)}
                      onToggleExpand={handleToggleExpand}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Platform Highlights */}
            <motion.div
              variants={headerVariants}
              className={`p-8 rounded-2xl border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
                  : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
              }`}
            >
              <div className="text-center mb-8">
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Built by Traders, for Traders
                </h3>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Developed by Shivam Kumar, a passionate full-stack developer
                  and trader with expertise in building intelligent trading
                  systems that combine market data, technical indicators, and
                  real-time signals[1][7]
                </p>
              </div>

              {/* Technology Stack */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <FaCode
                    className={`text-3xl mx-auto mb-3 ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <h4
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Modern Tech Stack
                  </h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    React, Python, WebSocket, Redux[2][5][6]
                  </p>
                </div>

                <div className="text-center">
                  <FaRocket
                    className={`text-3xl mx-auto mb-3 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <h4
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    High Performance
                  </h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Optimized for real-time trading[3]
                  </p>
                </div>

                <div className="text-center">
                  <FaAward
                    className={`text-3xl mx-auto mb-3 ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <h4
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Professional Grade
                  </h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Enterprise-level reliability
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={headerVariants}
              className={`mt-12 text-center p-8 rounded-2xl ${
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
                Ready to Transform Your Trading?
              </h3>
              <p
                className={`text-lg mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Join thousands of professional traders who trust DeepStrike for
                their options analysis and trading decisions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  } shadow-lg hover:shadow-xl`}
                >
                  Start Free Trial
                </button>

                <button
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 border ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* Live Demo Modal */}
          <AnimatePresence>
            {showLiveDemo && (
              <Suspense
                fallback={
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div
                      className={`p-6 rounded-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
                      <p
                        className={`mt-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Loading demo...
                      </p>
                    </div>
                  </div>
                }
              >
                <LiveDemo
                  onClose={() => setShowLiveDemo(false)}
                  theme={theme}
                />
              </Suspense>
            )}
          </AnimatePresence>
        </motion.section>
      </ErrorBoundary>
    );
  }
);

CompanyOverview.displayName = "CompanyOverview";

CompanyOverview.propTypes = {
  className: PropTypes.string,
  showDemo: PropTypes.bool,
  customFeatures: PropTypes.object,
};

export default CompanyOverview;
