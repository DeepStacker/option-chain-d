// src/components/RiskManagement.jsx
import React from 'react';
import { useSelector } from "react-redux";

const RiskManagement = () => {
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <section
      className={`max-w-4xl mx-auto rounded-lg p-6 mb-10 shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
    >
      <h2 className="text-3xl font-semibold mb-4">Risk Management</h2>
      <p>
        At Stockify, we emphasize the importance of risk management. Our platform offers various tools and features that help traders
        assess their risks effectively. Users can access detailed analytics, historical data, and risk assessment models that provide
        a comprehensive view of their positions.
      </p>
      <p className="mt-4">Our risk management tools include:</p>
      <ul className="list-disc list-inside mt-2">
        <li>Real-time market data analysis</li>
        <li>Risk assessment tools</li>
        <li>Portfolio optimization strategies</li>
      </ul>
    </section>
  );
};

export default RiskManagement;
