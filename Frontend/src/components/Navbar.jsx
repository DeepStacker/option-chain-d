import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../context/authSlice";
import { toggleTheme } from "../context/themeSlice";
import { auth } from "../firebase/init";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  HomeIcon,
  CalculatorIcon,
  NewspaperIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import LabelSight from "./LabelSight";
import DateList from "./DateList";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);

  const navRef = useRef(null);

  // Navigation structure
  const navigationItems = useMemo(
    () => [
      {
        category: "Main",
        items: [
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: HomeIcon,
            description: "Trading overview and analytics",
          },
          {
            name: "Option Chain",
            path: "/option-chain",
            icon: ChartBarIcon,
            description: "Real-time options data and analysis",
            badge: "Live",
          },
          {
            name: "TCA",
            path: "/tca",
            icon: CalculatorIcon,
            description: "Portfolio risk analysis tools",
          },
          {
            name: "Blog",
            path: "/blog",
            icon: NewspaperIcon,
            description: "Insights and updates on trading strategies",
          },
        ],
      },
      {
        category: "Resources",
        items: [
          {
            name: "About",
            path: "/about",
            icon: InformationCircleIcon,
            description: "Learn about our platform",
          },
          {
            name: "Contact",
            path: "/contact",
            icon: PhoneIcon,
            description: "Get in touch with us",
          },
        ],
      },
    ],
    []
  );

  // Flatten navigation items for easier rendering
  const allNavItems = useMemo(
    () => navigationItems.flatMap((category) => category.items),
    [navigationItems]
  );

  // Handle logout with retry logic
  const handleLogout = useCallback(async () => {
    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        await signOut(auth);
        dispatch(clearUser());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsOpen(false);
        navigate("/");
        toast.success("Logged out successfully");
        return;
      } catch (error) {
        console.error(`Logout attempt ${attempt + 1} failed:`, error);
        attempt++;
        if (attempt > MAX_RETRIES) {
          toast.error("Failed to logout. Please try again.");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }, [dispatch, navigate]);

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // Close mobile menu on navigation
  const handleNavClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // MarketStatus component
  const MarketStatus = () => {
    const isMarketOpen =
      new Date().getHours() >= 9 && new Date().getHours() < 16;

    return (
      <div
        className={`flex items-center px-2 py-1 rounded-lg text-xs font-semibold shadow-sm transition-all duration-300
    ${
      isMarketOpen
        ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white"
        : "bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white"
    }
  `}
        title={isMarketOpen ? "Market is open" : "Market is closed"}
        aria-label={isMarketOpen ? "Market open" : "Market closed"}
      >
        <span
          className={`w-2 h-2 rounded-full mr-2 shadow-sm ${
            isMarketOpen ? "bg-green-200" : "bg-red-200"
          }`}
        />
        {isMarketOpen ? "Market Open" : "Market Closed"}
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900/95 backdrop-blur-md border-gray-700"
            : "bg-white/95 backdrop-blur-md border-gray-200"
        } border-b shadow-lg`}
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Fixed width to prevent overflow */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0 max-w-[200px] lg:max-w-none">
              <Link
                to="/"
                className="flex items-center space-x-2 lg:space-x-3 group transition-all duration-300"
              >
                {/* Professional Logo */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-8 h-8 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"
                      : "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"
                  }`}
                >
                  {/* Trading Chart Icon */}
                  <svg
                    className="w-4 h-4 lg:w-7 lg:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>

                  {/* Pulse effect for live trading */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-xl bg-blue-400/30"
                  />
                </motion.div>

                {/* Brand Text - Hide on very small screens */}
                <div className="hidden sm:flex flex-col min-w-0">
                  <span
                    className={`text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 truncate`}
                  >
                    TradePro
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    } group-hover:text-blue-500 transition-colors duration-300 truncate`}
                  >
                    Options Trading
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            {isAuthenticated && (
              <div className="hidden xl:flex items-center space-x-1">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? theme === "dark"
                            ? "text-blue-400 bg-blue-900/30"
                            : "text-blue-600 bg-blue-50"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden 2xl:block">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              {/* Market Status */}
              <MarketStatus />

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {/* Desktop Auth Buttons */}
              {!isAuthenticated && (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* User Menu for Desktop */}
              {isAuthenticated && (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === "/profile"
                        ? theme === "dark"
                          ? "text-blue-400 bg-blue-900/30"
                          : "text-blue-600 bg-blue-50"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Profile"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`xl:hidden p-2 rounded-lg transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] z-50 xl:hidden ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              } border-l shadow-2xl overflow-y-auto`}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Items */}
                {isAuthenticated && (
                  <div className="space-y-2">
                    <h3
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Navigation
                    </h3>
                    {allNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                              isActive
                                ? theme === "dark"
                                  ? "text-blue-400 bg-blue-900/30"
                                  : "text-blue-600 bg-blue-50"
                                : theme === "dark"
                                ? "text-gray-300 hover:bg-gray-800"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={handleNavClick}
                            role="menuitem"
                            aria-current={isActive ? "page" : undefined}
                          >
                            <Icon
                              className="w-5 h-5 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {item.description}
                              </div>
                            </div>
                            {item.badge && (
                              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Account Section */}
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Account
                  </h3>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                          location.pathname === "/profile"
                            ? theme === "dark"
                              ? "text-blue-400 bg-blue-900/30"
                              : "text-blue-600 bg-blue-50"
                            : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={handleNavClick}
                        role="menuitem"
                      >
                        <UserCircleIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Logout"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className={`block w-full px-4 py-3 rounded-lg text-center font-medium transition-colors duration-200 ${
                          theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={handleNavClick}
                        role="menuitem"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className={`block w-full px-4 py-3 rounded-lg text-center font-medium border transition-colors duration-200 ${
                          theme === "dark"
                            ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={handleNavClick}
                        role="menuitem"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
