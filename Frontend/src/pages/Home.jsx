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
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
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
              <BoltIcon className="w-5 h-5 mr-3 text-green-500" />
              <span className="font-semibold">
                Trusted by 500+ Professional Traders
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Institutional-Grade{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
              Options Trading
            </span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Advanced options analytics, risk management, and algorithmic trading
            solutions designed for professional traders and institutional
            clients in Indian markets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/option-chain">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 35px -5px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg flex items-center space-x-3 shadow-xl"
              >
                <span>Start Trading Now</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-5 border-2 rounded-xl font-semibold text-lg flex items-center space-x-3 transition-all ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <PhoneIcon className="w-5 h-5" />
                <span>Schedule Demo</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
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
              <span>99.9% Uptime</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <ClockIcon className="w-5 h-5 text-purple-500" />
              <span>5ms Execution</span>
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
          theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className={`text-4xl md:text-5xl font-bold mb-8 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Trusted by Trading Professionals
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`${
                    index === activeTestimonial ? "block" : "hidden"
                  } text-center`}
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-7 h-7 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote
                    className={`text-2xl md:text-3xl font-medium mb-8 leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    "{testimonial.content}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full shadow-lg"
                    />
                    <div className="text-left">
                      <div
                        className={`text-xl font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        className={`text-base ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {testimonial.role}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {testimonial.company}
                      </div>
                      <div className="text-green-600 font-semibold mt-2">
                        {testimonial.pnl}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-center space-x-3 mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? "bg-blue-500 scale-125"
                        : theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
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
        className={`py-24 ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-8"
            >
              Ready to Elevate Your Trading?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
            >
              Join hundreds of professional traders and institutions who trust
              DeepStrike for their options trading and risk management needs
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link to="/option-chain">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Start Trading Now
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-3"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>Contact Sales Team</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
