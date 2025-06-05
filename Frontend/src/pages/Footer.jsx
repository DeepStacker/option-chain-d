import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa";
import {
  SiPython,
  SiReact,
  SiTailwindcss,
  SiRedux,
  SiDocker,
  SiFastapi,
} from "react-icons/si";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  HeartIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for footer animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("footer");
    if (footerElement) observer.observe(footerElement);

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const techStack = [
    { icon: SiPython, name: "Python", color: "text-yellow-400" },
    { icon: SiReact, name: "React", color: "text-blue-400" },
    { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-400" },
    { icon: SiRedux, name: "Redux", color: "text-purple-400" },
    { icon: SiFastapi, name: "FastAPI", color: "text-green-400" },
    { icon: SiDocker, name: "Docker", color: "text-blue-500" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/SHIVAM9771",
      color: "hover:text-gray-400",
      label: "GitHub",
    },
    {
      icon: FaLinkedin,
      href: "https://linkedin.com",
      color: "hover:text-blue-500",
      label: "LinkedIn",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
      label: "Twitter",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      color: "hover:text-pink-500",
      label: "Instagram",
    },
    {
      icon: FaTelegram,
      href: "https://t.me",
      color: "hover:text-blue-400",
      label: "Telegram",
    },
    {
      icon: FaDiscord,
      href: "https://discord.com",
      color: "hover:text-indigo-400",
      label: "Discord",
    },
  ];

  return (
    <>
      <footer
        id="footer"
        className={`relative overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-32 h-32 border border-blue-500/20 rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/20 rounded-lg"
          />

          {/* Gradient orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" />

          {/* Grid pattern */}
          <div
            className={`absolute inset-0 opacity-[0.02] ${
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
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative z-10 container mx-auto px-6 py-16"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`p-4 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                } shadow-2xl`}
              >
                <ArrowTrendingUpIcon  className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TradePro
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Advanced algorithmic trading platform built for the next
              generation of traders
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h3
                className={`text-xl font-bold mb-6 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
                About TradePro
              </h3>
              <p
                className={`text-sm leading-relaxed mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Empowering traders with cutting-edge analytics, real-time data
                visualization, and intelligent trading algorithms. Built by
                traders, for traders.
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <p
                  className={`text-xs font-semibold mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  BUILT WITH
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => {
                    const Icon = tech.icon;
                    return (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        } shadow-sm border ${
                          theme === "dark"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <Icon className={`w-3 h-3 ${tech.color}`} />
                        <span className="text-xs font-medium">{tech.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3
                className={`text-xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Navigation
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/", label: "Dashboard" },
                  { to: "/option-chain", label: "Option Chain" },
                  { to: "/risk-analysis", label: "Risk Analysis" },
                  { to: "/blog", label: "Trading Blog" },
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`text-sm transition-all duration-200 hover:translate-x-1 inline-block ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social & Community */}
            <motion.div variants={itemVariants}>
              <h3
                className={`text-xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Community
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                          : "bg-white hover:bg-gray-50 text-gray-600"
                      } ${social.color} shadow-sm border ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <p className="mb-2">#AlgorithmicTrading #OptionsTrading</p>
                <p>#FinTech #DataScience #Python #React</p>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants}>
              <h3
                className={`text-xl font-bold mb-6 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <EnvelopeIcon className="w-5 h-5 mr-2 text-purple-500" />
                Stay Updated
              </h3>
              <p
                className={`text-sm mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Get weekly insights on market trends, trading strategies, and
                platform updates.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={subscribed}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </motion.button>
              </form>

              <AnimatePresence>
                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 flex items-center text-green-500 text-sm"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Welcome to the community!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className={`border-t pt-8 ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <p className="flex items-center">
                  &copy; {new Date().getFullYear()} TradePro. All rights
                  reserved.
                </p>
                <p className="flex items-center mt-1">
                  Crafted with{" "}
                  <HeartIcon className="w-4 h-4 mx-1 text-red-500" /> by
                  <span className="ml-1 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Shivam Kumar
                  </span>
                </p>
              </div>

              <div
                className={`flex items-center space-x-6 mt-4 md:mt-0 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Link to="/privacy" className="hover:text-blue-500 transition">
                  Privacy
                </Link>
                <Link to="/terms" className="hover:text-blue-500 transition">
                  Terms
                </Link>
                <Link to="/cookies" className="hover:text-blue-500 transition">
                  Cookies
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 rounded-full shadow-2xl z-50 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            }`}
          >
            <ArrowUpIcon className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
