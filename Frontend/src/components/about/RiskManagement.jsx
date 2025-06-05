// src/components/RiskManagement.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaChartBar, FaShieldAlt, FaClock, FaBalanceScale } from 'react-icons/fa';

const RiskManagement = () => {
  const theme = useSelector((state) => state.theme.theme);

  const features = [
    {
      icon: <FaChartBar />,
      title: 'Real-time Analysis',
      description: 'Monitor market movements and analyze trends as they happen',
      color: 'text-blue-500'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Risk Protection',
      description: 'Advanced algorithms to help protect your investments',
      color: 'text-green-500'
    },
    {
      icon: <FaClock />,
      title: 'Timely Alerts',
      description: 'Get instant notifications about market changes',
      color: 'text-yellow-500'
    },
    {
      icon: <FaBalanceScale />,
      title: 'Portfolio Balance',
      description: 'Maintain optimal risk-reward ratio in your portfolio',
      color: 'text-purple-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className={`mb-16 rounded-lg shadow-lg p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h2 className={`text-3xl font-bold mb-8 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        Risk Management Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`flex items-start p-6 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}
          >
            <div className={`text-2xl mr-4 mt-1 ${feature.color}`}>
              {feature.icon}
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {feature.title}
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mt-8 p-6 rounded-lg text-center ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}
      >
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Our comprehensive risk management tools help you stay in control of your investments.
          With real-time monitoring and smart alerts, you'll never miss an important market movement.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default RiskManagement;
