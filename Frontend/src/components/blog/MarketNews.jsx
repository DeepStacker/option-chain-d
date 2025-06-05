import React from 'react';
import { useSelector } from 'react-redux';

const MarketNews = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
      <h1 className="text-4xl font-bold text-center my-10">Market News and Updates</h1>
      <p className="max-w-2xl mx-auto text-center mb-8">
        Stay updated with the latest news and trends in the stock market. 
        Understand how economic indicators and corporate news can impact stock prices.
      </p>
      {/* Consider adding a dynamic news feed from an API */}
    </div>
  );
};

export default MarketNews;
