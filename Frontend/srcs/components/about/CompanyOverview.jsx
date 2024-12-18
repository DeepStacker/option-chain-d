// src/components/CompanyOverview.jsx
import React from 'react';
import { useSelector } from "react-redux";

const CompanyOverview = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <section
      className={`max-w-4xl mx-auto rounded-lg p-6 mb-10 shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
    >
      <h2 className="text-3xl font-semibold mb-4">Company Overview</h2>
      <p>
        Stockify provides detailed option chain data and analysis on derivative instruments. Our platform is designed to help traders
        manage their risks effectively by offering real-time data and insights. With Stockify, traders can make informed decisions and
        optimize their trading strategies.
      </p>
    </section>
  );
};

export default CompanyOverview;
