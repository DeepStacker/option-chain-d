import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaRocket,
  FaEye,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaBullseye,
  FaLightbulb,
  FaHeart,
  FaTrophy,
  FaGlobe,
  FaCog,
} from "react-icons/fa";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";

// Enhanced mission data structure for trading platform
const MISSION_DATA = {
  mission: {
    id: "mission",
    icon: FaRocket,
    iconColor: "text-blue-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    title: "Our Mission",
    subtitle: "Empowering Intelligent Trading Decisions",
    content:
      "To democratize professional-grade options trading by providing cutting-edge analytical tools, real-time market data, and intelligent insights that enable traders to make data-driven decisions with confidence.",
    keyPoints: [
      "Real-time options chain analysis with advanced Greeks calculations",
      "AI-powered trading signals and risk management tools",
      "Professional-grade interface designed for serious traders",
      "Comprehensive market data and technical indicators",
    ],
    metrics: {
      label: "Active Traders",
      value: "10,000+",
      description: "Trust our platform daily",
    },
  },
  vision: {
    id: "vision",
    icon: FaEye,
    iconColor: "text-purple-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/20",
    title: "Our Vision",
    subtitle: "The Future of Options Trading",
    content:
      "To become the global standard for options trading analysis, recognized for our innovative technology, comprehensive market insights, and unwavering commitment to trader success in the evolving financial landscape.",
    keyPoints: [
      "Leading platform for institutional-grade options analysis",
      "Pioneer in AI-driven trading intelligence and automation",
      "Global expansion with localized market expertise",
      "Setting industry standards for trading technology",
    ],
    metrics: {
      label: "Market Coverage",
      value: "99.9%",
      description: "Uptime guarantee",
    },
  },
  values: {
    id: "values",
    icon: FaHandshake,
    iconColor: "text-green-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/20",
    title: "Our Values",
    subtitle: "Principles That Drive Excellence",
    content:
      "Built on a foundation of integrity, innovation, and trader-first mentality. We believe in transparent operations, continuous technological advancement, and delivering exceptional value to our trading community.",
    keyPoints: [
      "Transparency in all trading data and platform operations",
      "Continuous innovation in trading technology and analytics",
      "Trader-centric design and feature development",
      "Ethical practices and regulatory compliance",
    ],
    metrics: {
      label: "Satisfaction Rate",
      value: "98%",
      description: "User satisfaction score",
    },
  },
  approach: {
    id: "approach",
    icon: FaChartLine,
    iconColor: "text-orange-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/20",
    title: "Our Approach",
    subtitle: "Data-Driven Trading Excellence",
    content:
      "We combine advanced mathematical models, real-time market data, and intuitive design to create a comprehensive trading ecosystem that serves both novice and professional traders.",
    keyPoints: [
      "Advanced algorithms for options pricing and Greeks calculation",
      "Real-time WebSocket connections for instant market updates",
      "Machine learning models for pattern recognition and signals",
      "Responsive design optimized for all trading environments",
    ],
    metrics: {
      label: "Data Points",
      value: "1M+",
      description: "Processed per second",
    },
  },
};

// Enhanced Error Boundary Fallback
const MissionErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div
    className={`p-8 text-center rounded-lg border ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-gray-300"
        : "bg-gray-50 border-gray-200 text-gray-600"
    }`}
  >
    <div className="max-w-md mx-auto">
      <FaCog className="mx-auto text-4xl mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">
        Unable to load mission content
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
        Try Again
      </button>
    </div>
  </div>
));

MissionErrorFallback.displayName = "MissionErrorFallback";

// Enhanced Tab Button Component
const TabButton = memo(({ tabKey, tab, isActive, onClick, theme, index }) => {
  const Icon = tab.icon;

  const handleClick = useCallback(() => {
    onClick(tabKey);
  }, [tabKey, onClick]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={`
        group relative flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        ${
          isActive
            ? `${
                theme === "dark"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
              } transform scale-105`
            : `${
                theme === "dark"
                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              } hover:shadow-md`
        }
      `}
      aria-pressed={isActive}
      role="tab"
      tabIndex={0}
    >
      <div
        className={`
        p-3 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-white/20 backdrop-blur-sm"
            : theme === "dark"
            ? "bg-gray-600/50 group-hover:bg-gray-600"
            : "bg-white group-hover:bg-gray-50"
        }
      `}
      >
        <Icon
          className={`text-2xl ${isActive ? "text-white" : tab.iconColor}`}
        />
      </div>

      <div className="text-center">
        <span className="font-semibold text-sm">{tab.title}</span>
        <div
          className={`text-xs mt-1 ${
            isActive
              ? "text-blue-100"
              : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {tab.subtitle}
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-400/50"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
});

TabButton.displayName = "TabButton";

TabButton.propTypes = {
  tabKey: PropTypes.string.isRequired,
  tab: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

// Enhanced Content Panel Component
const ContentPanel = memo(({ tab, theme }) => {
  const Icon = tab.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-sm
        ${
          theme === "dark"
            ? `bg-gradient-to-br ${tab.bgGradient} border-gray-700/50`
            : `bg-gradient-to-br ${tab.bgGradient} border-gray-200/50`
        }
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>

      <div className="relative p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`
              inline-flex p-4 rounded-2xl mb-6 shadow-lg
              ${
                theme === "dark"
                  ? "bg-gray-800/80 backdrop-blur-sm"
                  : "bg-white/80 backdrop-blur-sm"
              }
            `}
          >
            <Icon className={`text-4xl ${tab.iconColor}`} />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {tab.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`text-lg font-medium ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {tab.subtitle}
          </motion.p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          {/* Description */}
          <div className="lg:col-span-2">
            <p
              className={`text-lg leading-relaxed mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {tab.content}
            </p>

            {/* Key Points */}
            <div className="space-y-3">
              <h4
                className={`font-semibold text-lg mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Key Highlights
              </h4>
              {tab.keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800/50 backdrop-blur-sm"
                      : "bg-white/50 backdrop-blur-sm"
                  }`}
                >
                  <div
                    className={`
                    flex-shrink-0 w-2 h-2 rounded-full mt-2.5 ${tab.iconColor.replace(
                      "text-",
                      "bg-"
                    )}
                  `}
                  />
                  <span
                    className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Metrics Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className={`
              p-6 rounded-xl text-center shadow-lg border
              ${
                theme === "dark"
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700/50"
                  : "bg-white/80 backdrop-blur-sm border-gray-200/50"
              }
            `}
          >
            <div className={`text-4xl font-bold mb-2 ${tab.iconColor}`}>
              {tab.metrics.value}
            </div>
            <div
              className={`font-semibold mb-1 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {tab.metrics.label}
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {tab.metrics.description}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

ContentPanel.displayName = "ContentPanel";

ContentPanel.propTypes = {
  tab: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

// Main OurMission Component
const OurMission = memo(
  ({ className = "", showMetrics = true, customTabs = null }) => {
    const theme = useSelector((state) => state.theme?.theme || "light");
    const [activeTab, setActiveTab] = useState("mission");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Use custom tabs or default mission data
    const tabs = useMemo(() => customTabs || MISSION_DATA, [customTabs]);

    // Handle tab change with analytics tracking
    const handleTabChange = useCallback(
      (tabKey) => {
        setActiveTab(tabKey);

        // Analytics tracking
        if (typeof gtag !== "undefined") {
          gtag("event", "mission_tab_view", {
            tab_name: tabKey,
            tab_title: tabs[tabKey]?.title,
          });
        }
      },
      [tabs]
    );

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event) => {
        const tabKeys = Object.keys(tabs);
        const currentIndex = tabKeys.indexOf(activeTab);

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : tabKeys.length - 1;
            handleTabChange(tabKeys[prevIndex]);
            break;
          case "ArrowRight":
            event.preventDefault();
            const nextIndex =
              currentIndex < tabKeys.length - 1 ? currentIndex + 1 : 0;
            handleTabChange(tabKeys[nextIndex]);
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeTab, tabs, handleTabChange]);

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

    return (
      <ErrorBoundary
        FallbackComponent={(props) => (
          <MissionErrorFallback {...props} theme={theme} />
        )}
        onError={(error) => {
          console.error("OurMission Error:", error);
        }}
      >
        <motion.section
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`py-16 ${className}`}
          aria-labelledby="mission-section-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                id="mission-section-title"
                className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Our Foundation
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Built on principles that drive innovation in options trading
                technology[1][7]
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-4 mb-12"
              role="tablist"
              aria-label="Mission sections"
            >
              {Object.entries(tabs).map(([key, tab], index) => (
                <TabButton
                  key={key}
                  tabKey={key}
                  tab={tab}
                  isActive={activeTab === key}
                  onClick={handleTabChange}
                  theme={theme}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Content Panel */}
            <AnimatePresence mode="wait">
              <ContentPanel
                key={activeTab}
                tab={tabs[activeTab]}
                theme={theme}
              />
            </AnimatePresence>

            {/* Navigation Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className={`text-center mt-8 text-sm ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              💡 Use arrow keys to navigate between sections
            </motion.div>
          </div>
        </motion.section>
      </ErrorBoundary>
    );
  }
);

OurMission.displayName = "OurMission";

OurMission.propTypes = {
  className: PropTypes.string,
  showMetrics: PropTypes.bool,
  customTabs: PropTypes.object,
};

export default OurMission;
