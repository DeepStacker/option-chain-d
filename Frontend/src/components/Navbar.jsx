import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../context/authSlice";
import { toggleTheme } from "../context/themeSlice";
import { auth } from "../firebase/init";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import {
  FiHome,
  FiBarChart2,
  FiTrendingUp,
  FiBook,
  FiInfo,
  FiPhone,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items with icons
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Option Chain", path: "/option-chain", icon: <FiBarChart2 /> },
    // { name: "TCA", path: "/tca", icon: <FiCalculator /> },
    { name: "Blog", path: "/blog", icon: <FiBook /> },
    { name: "About", path: "/about", icon: <FiInfo /> },
    { name: "Contact", path: "/contact", icon: <FiPhone /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Market status
  const isMarketOpen = new Date().getHours() >= 9 && new Date().getHours() < 16;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        } border-b shadow-sm transition-colors duration-200`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-600 to-purple-700"
                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                  } transition-all duration-200`}
                >
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span
                  className={`font-semibold text-xl tracking-tight ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  DeepStrike
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? theme === "dark"
                            ? "bg-gray-800 text-blue-400"
                            : "bg-gray-100 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="mr-2 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })
              ) : (
                <>
                  {navItems.slice(3).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      <span className="mr-2 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-2">
              {/* Market Status */}
              <div
                className={`hidden sm:flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                  isMarketOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                } transition-colors duration-200`}
                aria-label={`Market is ${isMarketOpen ? "open" : "closed"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-1.5 ${
                    isMarketOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {isMarketOpen ? "Open" : "Closed"}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`p-2 rounded-lg text-lg ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                } transition-all duration-200`}
                aria-label={`Switch to ${
                  theme === "dark" ? "light" : "dark"
                } theme`}
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>

              {/* Desktop Auth Buttons */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    } transition-all duration-200`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Desktop User Menu */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className={`p-2 rounded-lg text-lg ${
                      location.pathname === "/profile"
                        ? theme === "dark"
                          ? "bg-gray-800 text-blue-400"
                          : "bg-gray-100 text-blue-600"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    } transition-all duration-200`}
                    aria-label="User profile"
                  >
                    <FiUser />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg text-lg ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800 hover:text-red-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-red-600"
                    } transition-all duration-200`}
                    aria-label="Logout"
                  >
                    <FiLogOut />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className={`p-2 rounded-lg text-lg ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-all duration-200`}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } transition-colors duration-200`}
            >
              {/* Mobile Market Status */}
              <div
                className={`flex items-center justify-center px-3 py-2 mb-3 rounded-lg text-sm font-medium ${
                  isMarketOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
                aria-label={`Market is ${isMarketOpen ? "open" : "closed"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isMarketOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {isMarketOpen ? "Market Open" : "Market Closed"}
              </div>

              {/* Mobile Navigation Items */}
              {isAuthenticated ? (
                navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                        isActive
                          ? theme === "dark"
                            ? "bg-gray-800 text-blue-400"
                            : "bg-gray-100 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      } transition-all duration-200`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })
              ) : (
                <>
                  {navItems.slice(3).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      } transition-all duration-200`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile Auth Section */}
              <div
                className={`pt-4 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                        location.pathname === "/profile"
                          ? theme === "dark"
                            ? "bg-gray-800 text-blue-400"
                            : "bg-gray-100 text-blue-600"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      } transition-all duration-200`}
                    >
                      <FiUser className="mr-3 text-lg" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-left ${
                        theme === "dark"
                          ? "text-red-400 hover:bg-gray-800"
                          : "text-red-600 hover:bg-gray-100"
                      } transition-all duration-200`}
                    >
                      <FiLogOut className="mr-3 text-lg" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full px-3 py-2 rounded-lg text-center text-base font-medium ${
                        theme === "dark"
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      } transition-all duration-200`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-center text-base font-medium hover:bg-blue-700 transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
