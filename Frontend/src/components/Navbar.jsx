import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { toggleTheme } from "../context/themeSlice";
import { logout } from "../context/authSlice";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to Stockify  Trading Platform!" },
    { id: 2, message: "New feature: Position Sizing Calculator" },
  ]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  const NavButton = ({ icon: Icon, onClick, className = "", children }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg 
        ${
          theme === "dark"
            ? "bg-gray-800/80 hover:bg-gray-700/90 text-gray-200"
            : "bg-white/90 hover:bg-gray-50/95 text-gray-700"
        } 
        transform transition-all duration-200 ${className}
        shadow-lg hover:shadow-xl
        before:absolute before:inset-0 before:rounded-lg 
        before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20 
        before:opacity-0 hover:before:opacity-100 before:transition-opacity
        backdrop-blur-sm`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {children}
    </motion.button>
  );

  const MenuTransition = ({ children }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <nav
      className={`fixed top-0 right-0 left-20 z-30 border-b ${
        theme === "dark"
          ? "bg-gray-900/85 border-gray-700/50"
          : "bg-white/85 border-gray-200/50"
      } backdrop-blur-md shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <motion.h1
              className={`text-2xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-blue-500 to-purple-600`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Stockify 
            </motion.h1>
          </motion.div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {/* GitHub Link */}
            <NavButton
              icon={FaGithub}
              onClick={() =>
                window.open(
                  "https://github.com/yourusername/dhan-api",
                  "_blank"
                )
              }
            />

            {/* Theme Toggle */}
            <NavButton
              icon={theme === "dark" ? SunIcon : MoonIcon}
              onClick={() => dispatch(toggleTheme())}
            />

            {/* Notifications */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-800/90"
                        : "hover:bg-gray-100/90"
                    } shadow-lg hover:shadow-xl backdrop-blur-sm`}
                  >
                    <BellIcon className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs 
                          bg-red-500 text-white rounded-full flex items-center justify-center
                          shadow-lg"
                      >
                        {notifications.length}
                      </motion.span>
                    )}
                  </Menu.Button>

                  <MenuTransition>
                    {open && (
                      <Menu.Items
                        static
                        className={`absolute right-0 mt-2 w-72 rounded-xl 
                          ${
                            theme === "dark"
                              ? "bg-gray-800/95 border border-gray-700/50"
                              : "bg-white/95 border border-gray-200/50"
                          } divide-y ${
                          theme === "dark"
                            ? "divide-gray-700/50"
                            : "divide-gray-200/50"
                        } shadow-xl backdrop-blur-sm overflow-hidden`}
                      >
                        {notifications.map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <motion.div
                                whileHover={{ x: 4 }}
                                className={`px-4 py-3 ${
                                  active &&
                                  (theme === "dark"
                                    ? "bg-gray-700/50"
                                    : "bg-gray-50/50")
                                }`}
                              >
                                <p className="text-sm">
                                  {notification.message}
                                </p>
                              </motion.div>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    )}
                  </MenuTransition>
                </>
              )}
            </Menu>

            {/* User Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                  ${theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                    : "bg-white hover:bg-gray-50 text-gray-700"
                  } 
                  transform transition-all duration-200`}
              >
                <UserCircleIcon className="h-6 w-6" />
              </Menu.Button>

              <MenuTransition>
                <Menu.Items
                  className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg 
                    ${theme === "dark"
                      ? "bg-gray-800 ring-1 ring-gray-700"
                      : "bg-white ring-1 ring-black ring-opacity-5"
                    } shadow-lg focus:outline-none`}
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSettings}
                          className={`${active
                            ? theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-100 text-gray-900"
                            : theme === "dark"
                              ? "text-gray-200"
                              : "text-gray-700"
                          } flex items-center w-full px-4 py-2 text-sm`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active
                            ? theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-100 text-gray-900"
                            : theme === "dark"
                              ? "text-gray-200"
                              : "text-gray-700"
                          } flex items-center w-full px-4 py-2 text-sm`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </MenuTransition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
