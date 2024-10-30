// src/components/RiskManagement.jsx
import React from 'react';

const RiskManagement = () => {
  return (
    <section className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-10">
      <h2 className="text-3xl font-semibold mb-4">Risk Management</h2>
      <p className="text-gray-700">
        At Stockify, we emphasize the importance of risk management. Our platform offers various tools and features that help traders
        assess their risks effectively. Users can access detailed analytics, historical data, and risk assessment models that provide
        a comprehensive view of their positions.
      </p>
      <p className="text-gray-700 mt-4">
        Our risk management tools include:
      </p>
      <ul className="list-disc list-inside mt-2 text-gray-700">
        <li>Real-time market data analysis</li>
        <li>Risk assessment tools</li>
        <li>Portfolio optimization strategies</li>
      </ul>
    </section>
  );
};

export default RiskManagement;
