import React, { useEffect } from 'react';
import CompanyOverview from '../components/about/CompanyOverview';
import RiskManagement from '../components/about/RiskManagement';
import OurMission from '../components/about/OurMission';
import { useSelector } from 'react-redux';

const AboutPage = () => {
  // const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  useEffect(() => {
    document.title = 'About Stockify';
  }, []);
  return (
    <div className={`min-h-screen transition ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} py-10 max-w-full overflow-x-hidden`}>
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Stockify</h1>
      <CompanyOverview />
      <RiskManagement />
      <OurMission />
    </div>
  );
};

export default AboutPage;
