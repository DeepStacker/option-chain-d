import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CompanyOverview from '../components/about/CompanyOverview';
import RiskManagement from '../components/about/RiskManagement';
import OurMission from '../components/about/OurMission';
import TeamSection from '../components/about/TeamSection';
import Statistics from '../components/about/Statistics';
import { useSelector } from 'react-redux';

const AboutPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  
  useEffect(() => {
    document.title = 'About DeepStrike';
  }, []);
  
  return (
    <div className={`w-full transition ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-center mb-16 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            About DeepStrike
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering traders with cutting-edge technology and real-time market insights
          </p>
        </motion.div>

        {/* Statistics Section */}
        <Statistics />

        {/* Company Overview Section */}
        <CompanyOverview />

        {/* Our Mission Section */}
        <OurMission />

        {/* Risk Management Section */}
        <RiskManagement />

        {/* Team Section */}
        <TeamSection />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mt-16 p-8 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Ready to Start Trading?
          </h2>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join our community of successful traders and take your trading to the next level.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-lg text-white font-semibold ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
