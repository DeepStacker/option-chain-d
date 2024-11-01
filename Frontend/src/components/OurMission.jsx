// src/components/OurMission.jsx
import React from 'react';
import { useSelector } from "react-redux";

const OurMission = () => {
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <section
      className={`max-w-4xl mx-auto rounded-lg p-6 mb-10 shadow-md transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
    >
      <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
      <p>
        Our mission at Stockify is to empower traders by providing the most accurate and actionable derivative data available. We aim
        to make trading more accessible and informed for everyone by continuously innovating and improving our platform.
      </p>
      <p className="mt-4">
        Join us on our journey to revolutionize the trading experience and help traders manage their risks effectively.
      </p>
    </section>
  );
};

export default OurMission;
