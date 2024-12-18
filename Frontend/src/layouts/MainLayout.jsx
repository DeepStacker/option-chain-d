import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import Navbar from '../components/Navbar';
import Toast from '../components/common/Toast';
import Footer from '../pages/Footer';

const MainLayout = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-20">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-20">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Toast />
          <main className="flex-1 p-4 pt-16">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
