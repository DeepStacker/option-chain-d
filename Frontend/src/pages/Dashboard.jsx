import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalculator, FaBlog, FaBook } from 'react-icons/fa';

const Dashboard = () => {
  const theme = useSelector((state) => state.theme.theme);
  const { user } = useSelector((state) => state.auth);

  const cards = [
    {
      title: 'Option Chain',
      description: 'View and analyze option chain data with advanced filters and real-time updates.',
      icon: <FaChartLine size={24} />,
      link: '/option-chain',
      color: 'blue'
    },
    {
      title: 'Risk Analysis',
      description: 'Calculate potential profit and loss scenarios for your trades.',
      icon: <FaCalculator size={24} />,
      link: '/risk-analysis',
      color: 'green'
    },
    {
      title: 'Blog',
      description: 'Read latest articles about trading strategies and market insights.',
      icon: <FaBlog size={24} />,
      link: '/blog',
      color: 'purple'
    },
    {
      title: 'Documentation',
      description: 'Learn how to use all features of the platform effectively.',
      icon: <FaBook size={24} />,
      link: '/about',
      color: 'orange'
    }
  ];

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {user?.username || 'Trader'}!
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Access all your trading tools and analytics from one place
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`block p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`inline-block p-3 rounded-lg bg-${card.color}-100 text-${card.color}-600 mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className={`mt-12 p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Last Login
              </h3>
              <p className="text-xl font-semibold mt-2">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Account Type
              </h3>
              <p className="text-xl font-semibold mt-2">
                {user?.subscription_type || 'Standard'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Status
              </h3>
              <p className="text-xl font-semibold mt-2 text-green-500">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
