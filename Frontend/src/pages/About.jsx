// src/components/AboutPage.jsx
import React, { useEffect } from 'react';
import CompanyOverview from '../components/CompanyOverview';
import RiskManagement from '../components/RiskManagement';
import OurMission from '../components/OurMission';
import { useSelector } from 'react-redux';

const AboutPage = () => {
  // const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  useEffect(() => {
    document.title = 'About Stockify';
  } , []);
  return (
    <div className={`min-h-screen transition ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} py-10`}>
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Stockify</h1>
      <CompanyOverview />
      <RiskManagement />
      <OurMission />
    </div>
  );
};

export default AboutPage;
