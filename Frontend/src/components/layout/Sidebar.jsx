import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "../../context/themeSlice";
import { useSidebar } from "../../context/SidebarContext";
import {
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  HomeIcon,
  CalculatorIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const spotData = useSelector((state) => state.data.data?.spot?.data);

  // Use shared sidebar context
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState(3);
  
  const profileRef = useRef(null);

  // Navigation items
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: HomeIcon,
      badge: null,
    },
    {
      name: "Option Chain",
      path: "/option-chain",
      icon: ChartBarIcon,
      badge: "Live",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: ChartBarIcon,
      badge: "New",
    },
    {
      name: "Risk Simulator",
      path: "/risk-analysis",
      icon: CalculatorIcon,
      badge: null,
    },
    {
      name: "About",
      path: "/about",
      icon: InformationCircleIcon,
      badge: null,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: PhoneIcon,
      badge: null,
    },
  ];

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Market status
  const isMarketOpen = new Date().getHours() >= 9 && new Date().getHours() < 16;

  return (
    <motion.aside
      initial={{ width: sidebarWidth }}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      } border-r shadow-xl`}
    >
      {/* Logo Section */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                  Deep
                </span>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight -mt-1">
                  Strike
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Market Status */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-2 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isMarketOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-gray-500 dark:text-gray-400">
              {isMarketOpen ? "Market Open" : "Market Closed"}
            </span>
          </div>
          {spotData && (
            <div className={`text-xs mt-1 font-medium ${spotData.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              NIFTY: {spotData.Ltp?.toFixed(2)}
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
              title={isCollapsed ? item.name : ""}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : ""}`} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isCollapsed && item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-green-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        {/* Notifications */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <div className="relative">
            {notifications > 0 ? (
              <BellIconSolid className="w-5 h-5 text-blue-500" />
            ) : (
              <BellIcon className="w-5 h-5" />
            )}
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-sm font-medium">Notifications</span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-800 text-yellow-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* Profile (if authenticated) */}
        {isAuthenticated && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || "S"}
                </span>
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">
                  {user?.name || "Shivam"}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-xl border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-2">
                    {[
                      { icon: UserCircleIcon, label: "Profile", action: () => navigate("/profile") },
                      { icon: CogIcon, label: "Settings", action: () => navigate("/settings") },
                      { icon: ArrowRightOnRectangleIcon, label: "Logout", action: () => console.log("Logout") },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm ${
                          theme === "dark"
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
