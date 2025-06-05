import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Toast from "../components/common/Toast";
import Footer from "../pages/Footer";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Enhanced scroll tracking for dynamic effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Dynamic background patterns
  const BackgroundPattern = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div
        className={`absolute inset-0 opacity-[0.02] ${
          theme === "dark" ? "bg-white" : "bg-black"
        }`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );

  // Floating action elements for trading context
  const FloatingElements = () => (
    <AnimatePresence>
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-4 rounded-full shadow-2xl backdrop-blur-sm border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-600 text-white"
                : "bg-white/80 border-gray-200 text-gray-800"
            } cursor-pointer group`}
          >
            <svg
              className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Dynamic Background */}
      <BackgroundPattern />

      {/* Enhanced Navbar with scroll effects */}
      <motion.div
        initial={{ y: -100 }}
        animate={{
          y: isScrollingUp ? 0 : -100,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className="fixed top-0 right-0 left-0 z-50"
      >
        <motion.div
          animate={{
            backdropFilter: scrollY > 50 ? "blur(20px)" : "blur(0px)",
            backgroundColor:
              scrollY > 50
                ? theme === "dark"
                  ? "rgba(17, 24, 39, 0.8)"
                  : "rgba(255, 255, 255, 0.8)"
                : "transparent",
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Navbar />

          {/* Gradient border at bottom of navbar */}
          <motion.div
            animate={{
              opacity: scrollY > 50 ? 1 : 0,
              scaleX: scrollY > 50 ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="relative z-10"
        style={{ paddingTop: "4rem" }} // Space for navbar
      >
        {/* Content Area with enhanced styling */}
        <main className="relative">
          {/* Toast notifications */}
          <Toast />

          {/* Content wrapper with subtle animations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative mt-20"
        >
          <Footer />
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform-gpu z-50"
        style={{
          scaleX:
            scrollY /
            (document.documentElement.scrollHeight - window.innerHeight),
          transformOrigin: "0%",
        }}
        initial={{ scaleX: 0 }}
        animate={{
          scaleX:
            scrollY /
            (document.documentElement.scrollHeight - window.innerHeight),
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Ambient lighting effect */}
      <div
        className={`fixed inset-0 pointer-events-none ${
          theme === "dark"
            ? "bg-gradient-to-t from-blue-900/5 via-transparent to-purple-900/5"
            : "bg-gradient-to-t from-blue-50/30 via-transparent to-purple-50/30"
        }`}
      />
    </div>
  );
};

export default MainLayout;
