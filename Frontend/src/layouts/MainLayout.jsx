import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import Navbar from '../components/Navbar';
import Toast from '../components/common/Toast';
import Footer from '../pages/Footer';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 right-0 left-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-16"> {/* Add padding top for navbar */}
        {/* Sidebar - only show when authenticated */}
        {isAuthenticated && (
          <motion.div
            initial={false}
            animate={{
              width: isSidebarExpanded ? '256px' : '80px',
              transition: {
                duration: 0.2,
                ease: 'easeInOut'
              }
            }}
            className="fixed left-0 top-16 bottom-0 z-40 bg-inherit"
          >
            <SideBar 
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
            />
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={false}
          animate={{
            marginLeft: isAuthenticated ? (isSidebarExpanded ? '256px' : '80px') : '0px',
            transition: {
              duration: 0.2,
              ease: 'easeInOut'
            }
          }}
          className="flex-1 min-h-[calc(100vh-4rem)]"
        >
          {/* Content Area */}
          <main className="p-6">
            <Toast />
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default MainLayout;
