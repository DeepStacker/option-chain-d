import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "../../firebase/init";
import { setUser } from "../../context/authSlice";
import { toast } from "react-toastify";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme?.theme || "light");

  // Ensure component is mounted for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const { authLoading } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate, authLoading]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await signInWithGoogle();
      if (user) {
        const token = await user.getIdToken(true);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token: token,
        };
        dispatch(setUser(userData));
        toast.success("Welcome to DeepStrike! Login successful.");
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "Failed to sign in with Google");
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Professional animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Professional trading features
  const tradingFeatures = [
    {
      icon: ChartBarIcon,
      title: "Real-time Options Analytics",
      description:
        "Advanced options chain analysis with live Greeks and volatility data",
      stats: "₹50Cr+ Daily Volume",
    },
    {
      icon: ShieldCheckIcon,
      title: "Institutional Risk Management",
      description:
        "Portfolio protection with stress testing and VaR calculations",
      stats: "99.9% Risk Accuracy",
    },
    {
      icon: BoltIcon,
      title: "Lightning-Fast Execution",
      description: "Sub-5ms order execution with direct market access",
      stats: "5ms Avg Latency",
    },
  ];

  const trustIndicators = [
    { icon: ShieldCheckIcon, text: "SEBI Compliant", color: "text-green-500" },
    { icon: BoltIcon, text: "99.9% Uptime", color: "text-blue-500" },
    { icon: UserGroupIcon, text: "500+ Pro Traders", color: "text-purple-500" },
    { icon: CurrencyDollarIcon, text: "₹100Cr+ AUM", color: "text-yellow-500" },
  ];

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      } relative overflow-hidden`}
    >
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle floating elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-20 w-24 h-24 border border-blue-500/10 rounded-full"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute bottom-20 right-20 w-20 h-20 border border-green-500/10 rounded-lg"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute top-1/2 left-10 w-16 h-16 border border-purple-500/10 rounded-full"
        />

        {/* Professional grid pattern */}
        <div
          className={`absolute inset-0 opacity-[0.015] ${
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

      <div className="flex-1 flex relative z-10">
        {/* Left Side - Professional Features Showcase */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {/* Brand Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center mb-8">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className={`p-4 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                } shadow-2xl mr-4`}
              >
                <ArrowTrendingUpIcon className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  DeepStrike
                </h1>
                <p
                  className={`text-xl font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Professional Options Trading Platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Institutional-Grade{" "}
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                Options Trading
              </span>{" "}
              Platform
            </h2>
            <p
              className={`text-xl xl:text-2xl leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Advanced analytics, risk management, and algorithmic trading
              solutions trusted by professional traders and institutions.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="space-y-8 mb-12">
            {tradingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ x: 8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start space-x-6"
                >
                  <div
                    className={`p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
                    } shadow-lg backdrop-blur-sm border ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <Icon className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p
                      className={`text-base leading-relaxed mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                  } backdrop-blur-sm`}
                >
                  <Icon className={`w-5 h-5 ${indicator.color}`} />
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {indicator.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex items-center justify-center px-6 py-12"
        >
          <motion.div
            variants={itemVariants}
            className={`max-w-md w-full space-y-8 p-8 xl:p-10 rounded-2xl shadow-2xl border backdrop-blur-sm ${
              theme === "dark"
                ? "bg-gray-800/90 border-gray-700"
                : "bg-white/90 border-gray-200"
            }`}
          >
            {/* Login Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                } shadow-xl`}
              >
                <ChartBarIcon className="w-10 h-10 text-white" />
              </motion.div>

              <h2
                className={`text-3xl xl:text-4xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome Back
              </h2>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Access your professional trading dashboard
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Google Login Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={loading}
                className={`group relative w-full flex justify-center items-center py-4 xl:py-5 px-6 border border-transparent rounded-xl text-lg font-semibold transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl"
                } focus:outline-none focus:ring-4 focus:ring-blue-500/50`}
              >
                <motion.img
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{
                    duration: 1,
                    repeat: loading ? Infinity : 0,
                    ease: "linear",
                  }}
                  className="h-6 w-6 mr-4"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                {loading ? (
                  <span className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Authenticating...
                  </span>
                ) : (
                  "Continue with Google"
                )}
              </motion.button>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start p-4 rounded-xl border ${
                      theme === "dark"
                        ? "bg-red-900/30 border-red-500/50 text-red-300"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Authentication Error</p>
                      <p className="text-sm mt-1 opacity-90">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Notice */}
              <div
                className={`text-center space-y-3 pt-4 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center justify-center space-x-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span>Enterprise-grade security with Google OAuth</span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  By signing in, you agree to our{" "}
                  <a
                    href="/terms"
                    className="text-blue-500 hover:text-blue-600 underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-blue-500 hover:text-blue-600 underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
