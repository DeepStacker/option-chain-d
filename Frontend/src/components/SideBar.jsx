import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, ChartBarIcon, CalculatorIcon, 
  NewspaperIcon, UserCircleIcon, InformationCircleIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import { TbCalculator } from 'react-icons/tb';

const SideBar = ({ isExpanded, setIsExpanded }) => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Option Chain', path: '/option-chain', icon: ChartBarIcon },
    { name: 'Position Sizing', path: '/position-sizing', icon: TbCalculator },
    { name: 'TCA', path: '/tca', icon: CalculatorIcon },
    { name: 'Blog', path: '/blog', icon: NewspaperIcon },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
  ];

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <motion.li
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Link
          to={item.path}
          className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200
            ${isActive
              ? theme === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <div className="flex items-center">
            <Icon className="h-6 w-6 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </motion.li>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      className={`h-full py-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute -right-3 top-6 p-1.5 rounded-full shadow-lg
          ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'}
        `}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default SideBar;
