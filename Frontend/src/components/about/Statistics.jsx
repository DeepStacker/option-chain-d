import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaUsers, FaChartLine, FaGlobe, FaStar } from 'react-icons/fa';

const Statistics = () => {
  const theme = useSelector((state) => state.theme.theme);
  const { scrollYProgress } = useScroll();

  const stats = [
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      value: '10K+',
      label: 'Active Users',
      description: 'Traders trust our platform daily'
    },
    {
      icon: <FaChartLine className="text-4xl text-green-500" />,
      value: '1M+',
      label: 'Trades Analyzed',
      description: 'Data points processed daily'
    },
    {
      icon: <FaGlobe className="text-4xl text-purple-500" />,
      value: '50+',
      label: 'Countries',
      description: 'Global user base'
    },
    {
      icon: <FaStar className="text-4xl text-yellow-500" />,
      value: '4.9',
      label: 'User Rating',
      description: 'Average satisfaction score'
    }
  ];

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.section
      style={{ scale, opacity }}
      className={`mb-16 rounded-lg shadow-lg p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h2 className={`text-3xl font-bold mb-12 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        Our Impact in Numbers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-lg text-center transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.1
              }}
              className="flex justify-center mb-4"
            >
              {stat.icon}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              {stat.value}
            </motion.h3>
            <h4 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {stat.label}
            </h4>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mt-12 p-6 rounded-lg text-center ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}
      >
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Join thousands of traders who have already discovered the power of our platform.
          Experience the difference that real-time analytics and advanced trading tools can make.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default Statistics;
