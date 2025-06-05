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
        className={`flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
          isMarketOpen
            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
        }`}
        title={isMarketOpen ? "Market is open" : "Market is closed"}
        aria-label={isMarketOpen ? "Market open" : "Market closed"}
      >
        <span
          className={`w-2 h-2 rounded-full mr-2 ${
            isMarketOpen ? "bg-green-500" : "bg-red-500"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 min-w-0">
            {/* Left side - Logo/Brand and DateList */}
            <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
              <Link
                to="/"
                className={`text-lg lg:text-xl font-bold whitespace-nowrap flex-shrink-0 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                TradingApp
              </Link>
              {/* <div className="min-w-0 flex-1 max-w-md lg:max-w-lg">
                <DateList />
              </div> */}
            </div>

            {/* Center - Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  {allNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ y: -2 }}
                        className="relative"
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? theme === "dark"
                                ? "text-blue-400 bg-blue-900/30"
                                : "text-blue-600 bg-blue-50"
                              : theme === "dark"
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          onClick={handleNavClick}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span className="hidden 2xl:inline">{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </>
              ) : null}
            </div>

            {/* Right side - Market Status, Profile, Theme Toggle, Mobile Menu */}
            <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
              <MarketStatus />

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        location.pathname === "/profile"
                          ? theme === "dark"
                            ? "text-blue-400 bg-blue-900/30"
                            : "text-blue-600 bg-blue-50"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={handleNavClick}
                      aria-label="Profile"
                    >
                      <UserCircleIcon className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden xl:inline">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      aria-label="Logout"
                    >
                      <ArrowRightOnRectangleIcon
                        className="w-4 h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden xl:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={handleNavClick}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 whitespace-nowrap ${
                        theme === "dark"
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={handleNavClick}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleThemeToggle}
                className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <SunIcon
                    className="w-5 h-5 text-yellow-400"
                    aria-hidden="true"
                  />
                ) : (
                  <MoonIcon
                    className="w-5 h-5 text-gray-600"
                    aria-hidden="true"
                  />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`xl:hidden p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
