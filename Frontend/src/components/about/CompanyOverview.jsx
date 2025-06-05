// src/components/CompanyOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from "react-redux";
import { FaChartLine, FaUsers, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

const CompanyOverview = () => {
  const theme = useSelector((state) => state.theme.theme);

  const features = [
    {
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      title: 'Advanced Analytics',
      description: 'Real-time market analysis and predictive modeling for informed trading decisions.'
    },
    {
      icon: <FaUsers className="text-4xl text-green-500" />,
      title: 'Expert Support',
      description: 'Dedicated team of financial experts providing 24/7 customer support.'
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-500" />,
      title: 'Smart Insights',
      description: 'AI-powered insights and recommendations for portfolio optimization.'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
      title: 'Secure Trading',
      description: 'Bank-grade security measures to protect your investments and data.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
        Why Choose Stockify
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-lg text-center transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
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
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CompanyOverview;
