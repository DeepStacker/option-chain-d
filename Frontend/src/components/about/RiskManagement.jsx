import React, { 
  useState, 
  useCallback, 
  useMemo, 
  memo, 
  useRef,
  useEffect,
  lazy,
  Suspense 
} from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaChartBar, 
  FaShieldAlt, 
  FaClock, 
  FaBalanceScale,
  FaCalculator,
  FaBrain,
  FaExclamationTriangle,
  FaChartLine,
  FaTachometerAlt,
  FaRobot,
  FaEye,
  FaBell,
  FaPlay,
  FaPause,
  FaCog,
  FaInfoCircle
} from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// Lazy load advanced components

// Professional risk management features data
const RISK_FEATURES = {
  realTimeAnalysis: {
    id: 'real-time-analysis',
    icon: FaChartBar,
    title: 'Real-Time Greeks Analysis',
    shortDesc: 'Live options Greeks calculation and monitoring',
    description: 'Advanced real-time calculation of Delta, Gamma, Theta, Vega, and Rho with WebSocket-powered updates for instant market response.',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    features: [
      'Live Delta hedging calculations',
      'Gamma scalping opportunities',
      'Time decay (Theta) monitoring',
      'Volatility (Vega) risk assessment'
    ],
    metrics: {
      updateFrequency: '< 100ms',
      accuracy: '99.9%',
      coverage: '1000+ symbols'
    }
  },
  riskProtection: {
    id: 'risk-protection',
    icon: FaShieldAlt,
    title: 'Advanced Risk Protection',
    shortDesc: 'AI-powered portfolio protection algorithms',
    description: 'Machine learning algorithms analyze market patterns and automatically adjust position sizes to protect against adverse movements.',
    color: 'text-green-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    features: [
      'Dynamic position sizing',
      'Correlation-based hedging',
      'Black Swan event protection',
      'Automated stop-loss management'
    ],
    metrics: {
      riskReduction: '65%',
      accuracy: '87%',
      responseTime: '< 50ms'
    }
  },
  smartAlerts: {
    id: 'smart-alerts',
    icon: FaBell,
    title: 'Intelligent Alert System',
    shortDesc: 'ML-powered trading signals and notifications',
    description: 'Smart notification system that learns from your trading patterns and market conditions to deliver relevant, actionable alerts.',
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    features: [
      'Pattern recognition alerts',
      'Volatility spike notifications',
      'Earnings impact warnings',
      'Liquidity change alerts'
    ],
    metrics: {
      signalAccuracy: '78%',
      falsePositives: '< 5%',
      avgResponse: '2.3s'
    }
  },
  portfolioBalance: {
    id: 'portfolio-balance',
    icon: FaBalanceScale,
    title: 'Portfolio Optimization',
    shortDesc: 'Automated risk-reward optimization',
    description: 'Continuous portfolio rebalancing using modern portfolio theory and options-specific risk metrics for optimal performance.',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    features: [
      'Sharpe ratio optimization',
      'VaR (Value at Risk) calculation',
      'Correlation matrix analysis',
      'Sector exposure balancing'
    ],
    metrics: {
      sharpeImprovement: '34%',
      maxDrawdown: '< 8%',
      rebalanceFreq: 'Daily'
    }
  },
  riskCalculator: {
    id: 'risk-calculator',
    icon: FaCalculator,
    title: 'Professional Risk Calculator',
    shortDesc: 'Advanced position sizing and risk metrics',
    description: 'Comprehensive risk calculation tools including Kelly Criterion, position sizing, and scenario analysis for professional trading.',
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 to-blue-500/10',
    features: [
      'Kelly Criterion position sizing',
      'Monte Carlo simulations',
      'Stress testing scenarios',
      'Maximum loss calculations'
    ],
    metrics: {
      scenarios: '10,000+',
      accuracy: '95%',
      calculations: '< 1s'
    }
  },
  aiInsights: {
    id: 'ai-insights',
    icon: FaBrain,
    title: 'AI-Powered Insights',
    shortDesc: 'Machine learning market analysis',
    description: 'Advanced AI models analyze market microstructure, order flow, and historical patterns to provide actionable trading insights.',
    color: 'text-cyan-500',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
    features: [
      'Market regime detection',
      'Anomaly identification',
      'Sentiment analysis',
      'Predictive modeling'
    ],
    metrics: {
      modelAccuracy: '82%',
      dataPoints: '1M+/sec',
      predictions: 'Real-time'
    }
  }
};

// Enhanced Error Boundary Fallback
const RiskErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div className={`p-8 text-center rounded-lg border ${
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-gray-300' 
      : 'bg-gray-50 border-gray-200 text-gray-600'
  }`}>
    <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-500" />
    <h3 className="text-lg font-semibold mb-2">Risk Management System Error</h3>
    <p className="text-sm mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
        theme === 'dark'
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-red-500 hover:bg-red-600 text-white'
      }`}
    >
      Restart Risk System
    </button>
  </div>
));

RiskErrorFallback.displayName = 'RiskErrorFallback';

// Loading Skeleton Component
const FeatureSkeleton = memo(({ theme }) => (
  <div className={`p-6 rounded-xl border animate-pulse ${
    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
  }`}>
    <div className="flex items-start space-x-4">
      <div className={`w-12 h-12 rounded-lg ${
        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
      }`} />
      <div className="flex-1 space-y-3">
        <div className={`h-4 rounded w-3/4 ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`} />
        <div className={`h-3 rounded w-full ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`} />
        <div className={`h-3 rounded w-2/3 ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`} />
      </div>
    </div>
  </div>
));

FeatureSkeleton.displayName = 'FeatureSkeleton';

// Enhanced Feature Card Component
const RiskFeatureCard = memo(({ 
  feature, 
  index, 
  theme, 
  isActive, 
  onToggle,
  onLearnMore 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = feature.icon;

  const handleToggle = useCallback(() => {
    onToggle(feature.id);
  }, [feature.id, onToggle]);

  const handleLearnMore = useCallback(() => {
    onLearnMore(feature);
  }, [feature, onLearnMore]);

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
        ${isActive ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : 'hover:shadow-lg'}
      `}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`} />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`
              p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}
            `}>
              <Icon className={`text-2xl ${feature.color}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.shortDesc}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isActive ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
              `}
              aria-label={`Toggle ${feature.title}`}
            >
              <span className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isActive ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {feature.description}
        </p>

        {/* Expandable Features */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <h4 className={`text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Key Features:
              </h4>
              <ul className="space-y-1">
                {feature.features.map((item, idx) => (
                  <li key={idx} className={`text-xs flex items-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${feature.color.replace('text-', 'bg-')}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics */}
        <div className={`grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          {Object.entries(feature.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className={`text-sm font-bold ${feature.color}`}>
                {value}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleExpand}
            className={`text-xs font-medium transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          
          <button
            onClick={handleLearnMore}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Learn More
          </button>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`
            w-3 h-3 rounded-full
            ${isActive 
              ? 'bg-green-500 animate-pulse' 
              : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }
          `} />
        </div>
      </div>
    </motion.div>
  );
});

RiskFeatureCard.displayName = 'RiskFeatureCard';

RiskFeatureCard.propTypes = {
  feature: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired
};

// Main Risk Management Component
const RiskManagement = memo(({ 
  className = "",
  showAdvancedTools = true,
  customFeatures = null 
}) => {
  const theme = useSelector((state) => state.theme?.theme || 'light');
  const dispatch = useDispatch();
  
  const [activeFeatures, setActiveFeatures] = useState(new Set(['real-time-analysis', 'risk-protection']));
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use custom features or default risk features
  const features = useMemo(() => customFeatures || RISK_FEATURES, [customFeatures]);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle feature toggle
  const handleFeatureToggle = useCallback((featureId) => {
    setActiveFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
        toast.info(`${features[featureId]?.title} disabled`);
      } else {
        newSet.add(featureId);
        toast.success(`${features[featureId]?.title} enabled`);
      }
      return newSet;
    });

    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'risk_feature_toggle', {
        feature_id: featureId,
        feature_name: features[featureId]?.title,
        action: activeFeatures.has(featureId) ? 'disable' : 'enable'
      });
    }
  }, [features, activeFeatures]);

  // Handle learn more
  const handleLearnMore = useCallback((feature) => {
    setSelectedFeature(feature);
  }, []);

  // Handle calculator toggle
  const handleCalculatorToggle = useCallback(() => {
    setShowCalculator(!showCalculator);
  }, [showCalculator]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }), []);

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }), []);

  // Risk management statistics
  const riskStats = useMemo(() => ({
    activeFeatures: activeFeatures.size,
    totalFeatures: Object.keys(features).length,
    riskReduction: Math.round(Array.from(activeFeatures).reduce((acc, id) => {
      const feature = features[id];
      const reduction = parseInt(feature?.metrics?.riskReduction?.replace('%', '')) || 0;
      return acc + reduction;
    }, 0) / activeFeatures.size) || 0,
    avgAccuracy: Math.round(Array.from(activeFeatures).reduce((acc, id) => {
      const feature = features[id];
      const accuracy = parseInt(feature?.metrics?.accuracy?.replace('%', '')) || 0;
      return acc + accuracy;
    }, 0) / activeFeatures.size) || 0
  }), [activeFeatures, features]);

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <RiskErrorFallback {...props} theme={theme} />}
      onError={(error) => {
        console.error('RiskManagement Error:', error);
        toast.error('Risk management system encountered an error');
      }}
    >
      <motion.section
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className={`py-16 ${className}`}
        aria-labelledby="risk-management-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            variants={headerVariants}
            className="text-center mb-12"
          >
            <h2 
              id="risk-management-title"
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Advanced Risk Management
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Professional-grade risk management tools powered by machine learning and real-time market analysis[3][7]
            </p>

            {/* Risk Statistics Dashboard */}
            <motion.div
              variants={headerVariants}
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {riskStats.activeFeatures}/{riskStats.totalFeatures}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Active Features
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {riskStats.riskReduction}%
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Risk Reduction
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">
                  {riskStats.avgAccuracy}%
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avg Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">
                  100ms
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Response Time
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Risk Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
          >
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }, (_, index) => (
                <FeatureSkeleton key={index} theme={theme} />
              ))
            ) : (
              // Feature cards
              Object.values(features).map((feature, index) => (
                <RiskFeatureCard
                  key={feature.id}
                  feature={feature}
                  index={index}
                  theme={theme}
                  isActive={activeFeatures.has(feature.id)}
                  onToggle={handleFeatureToggle}
                  onLearnMore={handleLearnMore}
                />
              ))
            )}
          </motion.div>

          {/* Advanced Tools Section */}
          {showAdvancedTools && (
            <motion.div
              variants={headerVariants}
              className={`p-8 rounded-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Professional Trading Tools
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Access advanced calculators and analysis tools for professional options trading[2][4]
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleCalculatorToggle}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <FaCalculator className="mr-2" />
                  Risk Calculator
                </button>
                
                <button
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <FaChartLine className="mr-2" />
                  Portfolio Analyzer
                </button>
                
                <button
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  <FaBrain className="mr-2" />
                  AI Insights
                </button>
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            variants={headerVariants}
            className={`mt-12 text-center p-8 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Enhance Your Risk Management?
            </h3>
            <p className={`text-lg mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of traders who trust our advanced risk management system to protect and optimize their portfolios.
            </p>
            <button
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              } shadow-lg hover:shadow-xl`}
            >
              Get Started Today
            </button>
          </motion.div>
        </div>

        {/* Advanced Tools Modals */}
        <AnimatePresence>
          {showCalculator && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Loading calculator...
                  </p>
                </div>
              </div>
            }>
              <RiskCalculator
                onClose={() => setShowCalculator(false)}
                theme={theme}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </motion.section>
    </ErrorBoundary>
  );
});

RiskManagement.displayName = 'RiskManagement';

RiskManagement.propTypes = {
  className: PropTypes.string,
  showAdvancedTools: PropTypes.bool,
  customFeatures: PropTypes.object
};

export default RiskManagement;
