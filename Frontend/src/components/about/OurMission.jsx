// src/components/OurMission.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaRocket, FaEye, FaHandshake } from 'react-icons/fa';

const OurMission = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = {
    mission: {
      icon: <FaRocket className="text-3xl text-blue-500" />,
      title: 'Our Mission',
      content: 'To empower traders with cutting-edge tools and real-time data, enabling them to make informed decisions and achieve their financial goals.'
    },
    vision: {
      icon: <FaEye className="text-3xl text-purple-500" />,
      title: 'Our Vision',
      content: 'To become the leading platform for options trading analysis, recognized globally for our innovative solutions and commitment to trader success.'
    },
    values: {
      icon: <FaHandshake className="text-3xl text-green-500" />,
      title: 'Our Values',
      content: 'Integrity, Innovation, and Excellence. We believe in transparent operations, continuous improvement, and delivering exceptional value to our users.'
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-16 rounded-lg shadow-lg p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(tabs).map(([key, { icon, title }]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
              activeTab === key
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span className="font-semibold">{title}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className={`text-center p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}
      >
        <div className="flex justify-center mb-4">
          {tabs[activeTab].icon}
        </div>
        <h3 className={`text-2xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {tabs[activeTab].title}
        </h3>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {tabs[activeTab].content}
        </p>
      </motion.div>
    </motion.section>
  );
};

export default OurMission;
