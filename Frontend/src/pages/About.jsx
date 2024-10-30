// src/components/AboutPage.jsx
import React, { useEffect } from 'react';
import CompanyOverview from '../components/CompanyOverview';
import RiskManagement from '../components/RiskManagement';
import OurMission from '../components/OurMission';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Stockify';
  } , []);
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Stockify</h1>
      <CompanyOverview />
      <RiskManagement />
      <OurMission />
    </div>
  );
};

export default AboutPage;
