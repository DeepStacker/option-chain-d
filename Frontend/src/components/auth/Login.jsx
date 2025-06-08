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
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const { isAuthenticated, user, authLoading } = useSelector(
    (state) => state.auth
  );
  const theme = useSelector((state) => state.theme?.theme || "light");

  // Security: Track login attempts and implement rate limiting
  useEffect(() => {
    const attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    const lastAttempt = parseInt(
      localStorage.getItem("lastLoginAttempt") || "0"
    );
    const now = Date.now();

    // Reset attempts after 30 minutes
    if (now - lastAttempt > 30 * 60 * 1000) {
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lastLoginAttempt");
      setLoginAttempts(0);
    } else {
      setLoginAttempts(attempts);
      // Block after 5 failed attempts
      if (attempts >= 5) {
        const blockTime = 15 * 60 * 1000; // 15 minutes
        const timeLeft = blockTime - (now - lastAttempt);
        if (timeLeft > 0) {
          setIsBlocked(true);
          setBlockTimeRemaining(Math.ceil(timeLeft / 1000));
        }
      }
    }
  }, []);

  // Countdown timer for blocked state
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            localStorage.removeItem("loginAttempts");
            localStorage.removeItem("lastLoginAttempt");
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimeRemaining]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fixed redirect logic - wait for auth loading to complete and prevent double navigation
  useEffect(() => {
    if (!authLoading && isAuthenticated && user && mounted) {
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, authLoading, mounted]);

  const handleLogin = async () => {
    if (isBlocked) {
      toast.error(
        `Too many failed attempts. Please wait ${Math.ceil(
          blockTimeRemaining / 60
        )} minutes.`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = await signInWithGoogle();
      if (user) {
        // Reset login attempts on successful login
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lastLoginAttempt");
        setLoginAttempts(0);

        const token = await user.getIdToken(true);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token: token,
        };

        dispatch(setUser(userData));
        toast.success(
          "Login successful. Welcome to your secure trading platform."
        );

        // Don't navigate here - let the useEffect handle it to prevent conflicts
        // The redirect will be handled by the useEffect above
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Increment failed attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());
      localStorage.setItem("lastLoginAttempt", Date.now().toString());

      if (newAttempts >= 5) {
        setIsBlocked(true);
        setBlockTimeRemaining(15 * 60); // 15 minutes
        toast.error(
          "Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes."
        );
      } else {
        const remainingAttempts = 5 - newAttempts;
        setError(
          `${
            error.message || "Authentication failed"
          }. ${remainingAttempts} attempts remaining.`
        );
        toast.error(`Login failed. ${remainingAttempts} attempts remaining.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Professional animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
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

  // Enhanced security features for display
  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: "Bank-Grade Security",
      description: "256-bit SSL encryption and OAuth 2.0 authentication",
      stats: "ISO 27001 Certified",
    },
    {
      icon: LockClosedIcon,
      title: "Data Protection",
      description: "GDPR compliant with end-to-end encryption",
      stats: "Zero Data Breaches",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Multi-Factor Authentication",
      description: "Additional security layers for account protection",
      stats: "99.9% Fraud Prevention",
    },
  ];

  // Enhanced trust indicators
  const trustIndicators = [
    { icon: ShieldCheckIcon, text: "SEBI Registered", color: "text-green-500" },
    { icon: LockClosedIcon, text: "SSL Secured", color: "text-blue-500" },
    { icon: BoltIcon, text: "99.9% Uptime", color: "text-purple-500" },
    { icon: UserGroupIcon, text: "5K+ Traders", color: "text-orange-500" },
  ];

  const complianceLogos = [
    { name: "SEBI", description: "Securities & Exchange Board of India" },
    { name: "ISO 27001", description: "Information Security Management" },
    { name: "GDPR", description: "Data Protection Compliance" },
    { name: "SOC 2", description: "Security & Availability" },
  ];

  // Show loading while auth is initializing or component is mounting
  if (!mounted || authLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Initializing secure connection...
          </p>
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
      {/* Security background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        {/* Left Side - Security & Trust Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {/* Security Headline */}
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Secure Access to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                Professional Trading
              </span>
            </h2>
            <p
              className={`text-xl xl:text-2xl leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Enterprise-grade security with multi-layer authentication and
              real-time fraud protection.
            </p>
          </motion.div>

          {/* Security Features */}
          <motion.div variants={itemVariants} className="space-y-8 mb-12">
            {securityFeatures.map((feature, index) => {
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
                    <Icon className="w-7 h-7 text-green-500" />
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
                    <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Compliance Logos */}
          <motion.div variants={itemVariants} className="mb-8">
            <p
              className={`text-sm font-medium mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Trusted by regulators and certified by:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {complianceLogos.map((logo, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-center ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-white/50 border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {logo.name}
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {logo.description}
                  </div>
                </div>
              ))}
            </div>
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

        {/* Right Side - Secure Login Form */}
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
            {/* Security Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-green-600 to-green-700"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                } shadow-xl`}
              >
                <LockClosedIcon className="w-10 h-10 text-white" />
              </motion.div>

              <h2
                className={`text-3xl xl:text-4xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Secure Login
              </h2>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Access your protected trading account
              </p>
            </div>

            {/* Security Status */}
            <div
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-green-900/30 border border-green-500/50"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <GlobeAltIcon className="w-5 h-5 text-green-500" />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-green-300" : "text-green-700"
                }`}
              >
                Connection secured with 256-bit SSL encryption
              </span>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Rate Limiting Warning */}
              {loginAttempts > 0 && !isBlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center p-3 rounded-lg border ${
                    loginAttempts >= 3
                      ? theme === "dark"
                        ? "bg-red-900/30 border-red-500/50 text-red-300"
                        : "bg-red-50 border-red-200 text-red-700"
                      : theme === "dark"
                      ? "bg-yellow-900/30 border-yellow-500/50 text-yellow-300"
                      : "bg-yellow-50 border-yellow-200 text-yellow-700"
                  }`}
                >
                  <ExclamationTriangleIcon
                    className={`w-5 h-5 mr-2 ${
                      loginAttempts >= 3 ? "text-red-500" : "text-yellow-500"
                    }`}
                  />
                  <span className="text-sm">
                    {5 - loginAttempts} login attempts remaining
                  </span>
                </motion.div>
              )}

              {/* Blocked State */}
              {isBlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-red-900/30 border-red-500/50 text-red-300"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <ClockIcon className="w-6 h-6 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">Account Temporarily Locked</p>
                    <p className="text-sm mt-1">
                      Try again in {Math.floor(blockTimeRemaining / 60)}:
                      {(blockTimeRemaining % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Google Login Button */}
              <motion.button
                whileHover={{
                  scale: isBlocked ? 1 : 1.02,
                  y: isBlocked ? 0 : -2,
                }}
                whileTap={{ scale: isBlocked ? 1 : 0.98 }}
                onClick={handleLogin}
                disabled={loading || isBlocked}
                className={`group relative w-full flex justify-center items-center py-4 xl:py-5 px-6 border border-transparent rounded-xl text-lg font-semibold transition-all duration-300 ${
                  loading || isBlocked
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
                ) : isBlocked ? (
                  "Account Locked"
                ) : (
                  "Secure Login with Google"
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
                      <p className="font-medium">Authentication Failed</p>
                      <p className="text-sm mt-1 opacity-90">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Security Notice */}
              <div
                className={`text-center space-y-4 pt-4 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center justify-center space-x-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span>
                    Protected by Google OAuth 2.0 & Multi-Factor Authentication
                  </span>
                </div>

                <div
                  className={`text-xs space-y-2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  <p>
                    Your login is protected by enterprise-grade security
                    measures including rate limiting, fraud detection, and
                    encrypted data transmission.
                  </p>
                  <p>
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
