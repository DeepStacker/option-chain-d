import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, ChartBarIcon, CalculatorIcon, 
  NewspaperIcon, UserCircleIcon, InformationCircleIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import { TbCalculator } from 'react-icons/tb';

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Option Chain', path: '/option-chain', icon: ChartBarIcon },
    { name: 'Risk Analysis', path: '/risk-analysis', icon: CalculatorIcon },
    { name: 'Position Sizing', path: '/position-sizing', icon: TbCalculator },
    { name: 'Blog', path: '/blog', icon: NewspaperIcon },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
  ];

  const sidebarVariants = {
    expanded: {
      width: "256px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: "80px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <motion.li
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Link
          to={item.path}
          className={`flex items-center px-3 py-2 rounded-xl transition-all duration-200
            ${isActive
              ? theme === 'dark'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                : 'bg-blue-500 text-white shadow-lg'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
            }
            group relative overflow-hidden
          `}
        >
          {/* Background gradient effect */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r 
            ${isActive
              ? 'from-blue-600/50 to-purple-600/50'
              : 'from-blue-500/0 to-purple-500/0'
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          />

          {/* Icon with 3D effect */}
          <div className={`relative z-10 transform transition-transform duration-200 
            ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Text with animation */}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ 
                  opacity: 1, 
                  width: "auto",
                  transition: { duration: 0.2, delay: 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  width: 0,
                  transition: { duration: 0.2 }
                }}
                className="ml-3 whitespace-nowrap overflow-hidden relative z-10"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-blue-400"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Link>
      </motion.li>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <motion.aside
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className={`fixed left-0 top-16 h-screen z-20
        ${theme === 'dark' 
          ? 'bg-gray-800/95 text-white' 
          : 'bg-white/95 text-gray-900'
        } backdrop-blur-md shadow-xl
        border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className={`h-16 flex items-center justify-center
        ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50'}
        border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <motion.div
          animate={{ scale: isExpanded ? 1.2 : 1 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
        >
          {isExpanded ? 'Stockify ' : 'S'}
        </motion.div>
      </div>

      {/* Navigation Section */}
      <nav className="p-3 flex flex-col h-[calc(100vh-4rem)]">
        <ul className="space-y-2 flex-1">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mx-auto p-2 rounded-xl transition-colors duration-200
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
            }
            group
          `}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeftIcon className="h-6 w-6 transform transition-transform group-hover:scale-110" />
          </motion.div>
        </motion.button>
      </nav>
    </motion.aside>
  );
};

export default SideBar;
