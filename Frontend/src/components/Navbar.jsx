import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../context/authSlice';
import { toggleTheme } from '../context/themeSlice';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      localStorage.removeItem('token');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-800'
    } shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.span 
                className={`text-2xl font-bold ${
                  theme === 'dark' 
                    ? 'text-blue-400' 
                    : 'text-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Stockify
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 hover:text-white'
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 hover:text-white'
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 hover:text-white'
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeToggle}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                theme === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 hover:text-white'
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 hover:text-white'
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 hover:text-white'
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`block px-3 py-2 rounded-md text-base font-medium border ${
                      theme === 'dark'
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
