import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "../context/themeSlice";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  HomeIcon,
  CalculatorIcon,
  NewspaperIcon,
  PhoneIcon,
  InformationCircleIcon,
  TrendingUpIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const spotData = useSelector((state) => state.data.data?.spot?.data);

  // Enhanced state management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3); // Mock notifications
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Enhanced navigation structure with categories
  const navigationItems = [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          path: "/",
          icon: HomeIcon,
          description: "Trading overview and analytics",
        },
        {
          name: "Option Chain",
          path: "/advanced-option-chain",
          icon: ChartBarIcon,
          description: "Real-time options data and analysis",
          badge: "Live",
        },
        {
          name: "Risk Simulator",
          path: "/risk-analysis",
          icon: CalculatorIcon,
          description: "Portfolio risk analysis tools",
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
  ];

  // Flatten navigation for search
  const allNavItems = navigationItems.flatMap((category) => category.items);

  // Filter navigation items based on search
  const filteredNavItems = allNavItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search navigation
  const handleSearchSelect = (item) => {
    navigate(item.path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Market status indicator
  const MarketStatus = () => {
    const isMarketOpen =
      new Date().getHours() >= 9 && new Date().getHours() < 16;

    return (
      <div className="hidden lg:flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isMarketOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {isMarketOpen ? "Market Open" : "Market Closed"}
        </span>
        {spotData && (
          <span
            className={`text-xs ${
              spotData.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            NIFTY: {spotData.Ltp?.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  // Enhanced search component
  const SearchComponent = () => (
    <div className="relative" ref={searchRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className={`p-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            } z-50`}
          >
            <div className="p-4">
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                    : "bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
                autoFocus
              />
            </div>

            {searchQuery && (
              <div className="max-h-60 overflow-y-auto">
                {filteredNavItems.length > 0 ? (
                  filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.path}
                        whileHover={{
                          backgroundColor:
                            theme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        onClick={() => handleSearchSelect(item)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left"
                      >
                        <Icon className="w-5 h-5 text-blue-500" />
                        <div>
                          <div
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </div>
                          <div
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div
                    className={`p-4 text-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No results found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Profile dropdown component
  const ProfileDropdown = () => (
    <div className="relative" ref={profileRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.name?.charAt(0) || "S"}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isProfileOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            } z-50`}
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0) || "S"}
                  </span>
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.name || "Shivam Kumar"}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Options Trader
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {[
                {
                  icon: UserCircleIcon,
                  label: "Profile",
                  action: () => navigate("/profile"),
                },
                {
                  icon: CogIcon,
                  label: "Settings",
                  action: () => navigate("/settings"),
                },
                {
                  icon: ArrowRightOnRectangleIcon,
                  label: "Logout",
                  action: () => console.log("Logout"),
                },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{
                    backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                  }}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "bg-gray-900/95 backdrop-blur-md shadow-2xl"
            : "bg-white/95 backdrop-blur-md shadow-2xl"
          : theme === "dark"
          ? "bg-gray-900 shadow-lg"
          : "bg-white shadow-lg"
      } ${theme === "dark" ? "text-white" : "text-gray-800"} border-b ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-2xl font-bold group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <TrendingUpIcon className="w-6 h-6 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              TradePro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                        : "hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Market Status */}
            <MarketStatus />

            {/* Search */}
            <SearchComponent />

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {notifications > 0 ? (
                <BellIconSolid className="w-5 h-5 text-blue-500" />
              ) : (
                <BellIcon className="w-5 h-5" />
              )}
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Profile Dropdown */}
            {isAuthenticated && <ProfileDropdown />}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-2">
                {allNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div
                            className={`text-xs ${
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
