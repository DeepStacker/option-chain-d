import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  StarIcon,
  BoltIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  SparklesIcon,
  RocketLaunchIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  LockClosedIcon, // Add this line
} from "@heroicons/react/24/outline";

const Home = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const title = "DeepStrike";

  useEffect(() => {
    document.title = `${title} | Professional Options Trading Platform`;
  }, []);

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Professional trading features
  const tradingFeatures = [
    {
      icon: ChartBarIcon,
      title: "Real-Time Options Analytics",
      description:
        "Advanced options chain analysis with live Greeks, volatility surfaces, and institutional-grade risk metrics for informed trading decisions.",
      benefits: [
        "Live Market Data",
        "Greeks Calculation",
        "Volatility Analysis",
        "Risk Assessment",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BoltIcon,
      title: "Algorithmic Trading Engine",
      description:
        "Sophisticated trading algorithms with backtesting capabilities, strategy optimization, and automated execution for Indian markets.[1]",
      benefits: [
        "Strategy Backtesting",
        "Performance Analytics",
        "Auto Execution",
        "Risk Controls",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ShieldCheckIcon,
      title: "Risk Management Suite",
      description:
        "Comprehensive portfolio risk analysis with stress testing, VaR calculations, and real-time position monitoring.",
      benefits: [
        "Portfolio Analysis",
        "Stress Testing",
        "VaR Calculation",
        "Position Monitoring",
      ],
      color: "from-green-500 to-emerald-500",
    },
  ];

  const performanceStats = [
    {
      number: "₹50Cr+",
      label: "Daily Trading Volume",
      icon: CurrencyDollarIcon,
    },
    { number: "99.9%", label: "System Uptime", icon: BoltIcon },
    { number: "500+", label: "Professional Traders", icon: UserGroupIcon },
    { number: "5ms", label: "Order Execution", icon: ClockIcon },
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Senior Options Trader",
      company: "Institutional Trading Desk",
      content:
        "DeepStrike has transformed our options trading operations. The real-time analytics and risk management tools are unparalleled in the Indian market.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      pnl: "+35% Annual Returns",
    },
    {
      name: "Priya Mehta",
      role: "Portfolio Manager",
      company: "Hedge Fund Alpha",
      content:
        "The algorithmic trading capabilities and backtesting features have significantly improved our strategy performance and risk-adjusted returns.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      pnl: "+42% Strategy Performance",
    },
    {
      name: "Amit Patel",
      role: "Quantitative Analyst",
      company: "Investment Management Firm",
      content:
        "Best options trading platform for institutional use. The data accuracy, speed, and analytical depth are exactly what we need for our strategies.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      pnl: "+28% Risk-Adjusted Returns",
    },
  ];

  const pricingPlans = [
    {
      name: "Professional",
      price: "₹25,000",
      period: "/month",
      description: "For individual professional traders",
      features: [
        "Real-time Options Chain",
        "Advanced Analytics",
        "Risk Management Tools",
        "5 Trading Strategies",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Institutional",
      price: "₹75,000",
      period: "/month",
      description: "For trading desks and institutions",
      features: [
        "Everything in Professional",
        "Unlimited Strategies",
        "API Access",
        "Custom Indicators",
        "Priority Support",
        "Dedicated Account Manager",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large institutions and funds",
      features: [
        "Everything in Institutional",
        "White-label Solutions",
        "Custom Development",
        "On-premise Deployment",
        "24/7 Support",
        "Compliance Tools",
      ],
      popular: false,
    },
  ];

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } overflow-hidden`}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Professional Background */}
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900"
                : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
            }`}
          />

          {/* Subtle Market-themed Elements */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-20 w-32 h-32 border border-blue-500/10 rounded-full"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "1s" }}
            className="absolute bottom-20 right-20 w-24 h-24 border border-green-500/10 rounded-lg"
          />

          {/* Professional Grid Pattern */}
          <div
            className={`absolute inset-0 opacity-[0.01] ${
              theme === "dark" ? "bg-white" : "bg-gray-900"
            }`}
            style={{
              backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          {/* Enhanced Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div
              className={`inline-flex items-center px-6 py-3 rounded-full border mb-8 ${
                theme === "dark"
                  ? "bg-gray-800/80 border-gray-700 text-gray-300"
                  : "bg-white/80 border-gray-200 text-gray-600"
              } backdrop-blur-sm shadow-lg`}
            >
              <ShieldCheckIcon className="w-5 h-5 mr-3 text-green-500" />
              <span className="font-semibold">
                SEBI Registered • Trusted by 500+ Professional Traders
              </span>
            </div>
          </motion.div>

          {/* Professional Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Professional{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
              Options Trading
            </span>{" "}
            Platform
          </motion.h1>

          {/* Conservative Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Real-time options analytics, risk management tools, and portfolio
            monitoring designed for professional traders and institutional
            clients. Built with enterprise-grade security and regulatory
            compliance.
          </motion.p>

          {/* Professional CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/option-chain">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 35px -5px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg flex items-center space-x-3 shadow-xl"
              >
                <span>View Platform Demo</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-10 py-5 border-2 rounded-xl font-semibold text-lg flex items-center space-x-3 transition-all ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <PhoneIcon className="w-5 h-5" />
                <span>Contact Sales</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm"
          >
            <div
              className={`flex items-center space-x-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <span>SEBI Compliant</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <BoltIcon className="w-5 h-5 text-blue-500" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <LockClosedIcon className="w-5 h-5 text-purple-500" />
              <span>Bank-Grade Security</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <ClockIcon className="w-5 h-5 text-orange-500" />
              <span>Real-time Data</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Performance Stats */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {performanceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                      theme === "dark" ? "bg-blue-600" : "bg-blue-500"
                    } shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className={`text-4xl font-bold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trading Features */}
      <section
        className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className={`text-4xl md:text-5xl font-bold mb-8 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Professional Trading Solutions
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl max-w-3xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Comprehensive suite of tools designed for serious options traders
              and institutional clients
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-10"
          >
            {tradingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative p-8 rounded-2xl shadow-2xl border overflow-hidden group ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 bg-gradient-to-br ${feature.color} shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3
                      className={`text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className={`text-lg mb-8 leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>

                    <ul className="space-y-4">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                          <span
                            className={`text-base ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className={`py-24 ${
          theme === "dark" ? "bg-gray-900/50" : "bg-slate-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center px-6 py-3 rounded-full border mb-8 ${
                theme === "dark"
                  ? "bg-gray-800/60 border-gray-700/50 text-gray-300"
                  : "bg-white/60 border-gray-200/50 text-gray-600"
              } backdrop-blur-xl`}
            >
              <TrophyIcon className="w-5 h-5 mr-3 text-amber-500" />
              <span className="font-semibold text-sm">
                Proven Results • Real Performance
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className={`text-5xl md:text-6xl font-black mb-6 tracking-tight ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="block">Trusted by</span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Elite Traders
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className={`text-xl max-w-3xl mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Professional traders and institutions rely on our platform for
              algorithmic trading and real-time market analysis
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            {/* Modern Card-based Layout */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`p-8 rounded-3xl border ${
                    theme === "dark"
                      ? "bg-gray-800/40 border-gray-700/50"
                      : "bg-white/60 border-gray-200/50"
                  } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500`}
                >
                  {/* Performance Metrics Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">
                        {testimonial.pnl}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        6-month P&L
                      </div>
                    </div>
                  </div>

                  {/* Trading Strategy Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                      testimonial.strategy === "Algorithmic"
                        ? "bg-blue-500/20 text-blue-400"
                        : testimonial.strategy === "Options"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {testimonial.strategy} Trading
                  </div>

                  <blockquote
                    className={`text-lg font-medium mb-6 leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    "{testimonial.content}"
                  </blockquote>

                  {/* Enhanced Profile Section */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-2xl shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div
                        className={`text-lg font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {testimonial.role}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {testimonial.company} • {testimonial.experience}
                      </div>
                    </div>
                  </div>

                  {/* Trading Metrics */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div
                      className={`text-center p-3 rounded-xl ${
                        theme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {testimonial.winRate}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Win Rate
                      </div>
                    </div>
                    <div
                      className={`text-center p-3 rounded-xl ${
                        theme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {testimonial.trades}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Trades/Month
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Real-time Performance Dashboard Preview */}
            <motion.div
              variants={itemVariants}
              className={`p-8 rounded-3xl border ${
                theme === "dark"
                  ? "bg-gray-800/40 border-gray-700/50"
                  : "bg-white/60 border-gray-200/50"
              } backdrop-blur-xl`}
            >
              <div className="text-center mb-8">
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Live Platform Performance
                </h3>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Real-time metrics from our trading infrastructure
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Active Traders",
                    value: "1,247",
                    change: "+12%",
                    icon: UserGroupIcon,
                  },
                  {
                    label: "Daily Volume",
                    value: "₹45.2Cr",
                    change: "+8.5%",
                    icon: ChartBarIcon,
                  },
                  {
                    label: "Avg Latency",
                    value: "2.3ms",
                    change: "-15%",
                    icon: BoltIcon,
                  },
                  {
                    label: "Success Rate",
                    value: "99.97%",
                    change: "+0.02%",
                    icon: CheckCircleIcon,
                  },
                ].map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-center p-6 rounded-2xl ${
                        theme === "dark" ? "bg-gray-700/30" : "bg-gray-100/50"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mx-auto mb-3 ${
                          index === 0
                            ? "text-blue-500"
                            : index === 1
                            ? "text-green-500"
                            : index === 2
                            ? "text-purple-500"
                            : "text-orange-500"
                        }`}
                      />
                      <div
                        className={`text-2xl font-bold mb-1 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {metric.value}
                      </div>
                      <div
                        className={`text-sm mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {metric.label}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          metric.change.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {metric.change} vs last month
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Technology Stack Showcase */}
            <motion.div variants={itemVariants} className="mt-16 text-center">
              <h4
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Powered by Modern Technology Stack
              </h4>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {[
                  { name: "Python", icon: "🐍", desc: "Algorithmic Trading" },
                  { name: "React", icon: "⚛️", desc: "Real-time UI" },
                  { name: "WebSocket", icon: "🔌", desc: "Live Data" },
                  { name: "Redis", icon: "🔴", desc: "Performance" },
                  { name: "Docker", icon: "🐳", desc: "Scalability" },
                  { name: "FastAPI", icon: "⚡", desc: "High-Speed API" },
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                    } backdrop-blur-sm`}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <div className="text-left">
                      <div
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {tech.name}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {tech.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className={`py-24 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className={`text-4xl md:text-5xl font-bold mb-8 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Professional Trading Plans
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl max-w-3xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Choose the plan that fits your trading requirements and scale
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? "border-blue-500 shadow-2xl"
                    : theme === "dark"
                    ? "border-gray-700 shadow-xl"
                    : "border-gray-200 shadow-xl"
                } ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span
                      className={`text-5xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-lg ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <p
                    className={`text-base mb-8 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span
                          className={`text-base ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      plan.popular
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : theme === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-32 relative overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-blue-900/90 to-indigo-900"
            : "bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-800"
        }`}
      >
        {/* Advanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
          linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)
        `,
              backgroundSize: "400px 400px, 300px 300px, 200px 200px",
            }}
          />
        </div>

        {/* Floating Elements for Trading Theme */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-32 h-32 border border-blue-400/20 rounded-3xl backdrop-blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-20 w-24 h-24 border border-indigo-400/20 rounded-full backdrop-blur-3xl"
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Professional Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-6 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl mb-12"
            >
              <ChartBarIcon className="w-5 h-5 mr-3 text-blue-300" />
              <span className="font-semibold text-white text-sm">
                Algorithmic Trading • Real-time Analytics • Risk Management
              </span>
            </motion.div>

            {/* Modern Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight"
            >
              <span className="block">Ready to</span>
              <span className="block bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Transform
              </span>
              <span className="block">Your Trading?</span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Join elite traders using our{" "}
              <span className="font-semibold text-white">
                Python-powered algorithmic systems
              </span>{" "}
              and{" "}
              <span className="font-semibold text-white">
                real-time WebSocket infrastructure
              </span>{" "}
              for professional options trading in Indian markets[2][4]
            </motion.p>

            {/* Performance Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
            >
              {[
                { value: "2.3ms", label: "Execution Speed", icon: BoltIcon },
                {
                  value: "99.97%",
                  label: "System Uptime",
                  icon: ShieldCheckIcon,
                },
                {
                  value: "₹50Cr+",
                  label: "Daily Volume",
                  icon: CurrencyDollarIcon,
                },
                {
                  value: "1,200+",
                  label: "Active Traders",
                  icon: UserGroupIcon,
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                  >
                    <Icon className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Premium CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/option-chain">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-12 py-6 bg-white text-slate-800 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl flex items-center space-x-3"
                >
                  <span>Launch Trading Platform</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-12 py-6 border-2 border-white/50 text-white rounded-2xl font-bold text-lg hover:border-white transition-all duration-300 flex items-center space-x-3 backdrop-blur-xl"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span>Schedule Demo</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Technology Stack Highlight */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex flex-wrap justify-center items-center gap-8"
            >
              <div className="text-blue-200/80 text-sm font-medium">
                POWERED BY:
              </div>
              {[
                { name: "Python", icon: "🐍" },
                { name: "React", icon: "⚛️" },
                { name: "WebSocket", icon: "🔌" },
                { name: "Redis", icon: "🔴" },
                { name: "FastAPI", icon: "⚡" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <span className="text-lg">{tech.icon}</span>
                  <span className="text-white text-sm font-medium">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
