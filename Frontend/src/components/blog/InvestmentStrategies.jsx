import React from 'react';
import { useSelector } from 'react-redux';

const InvestmentStrategies = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
      <h1 className="text-4xl font-bold text-center my-10">Investment Strategies</h1>
      
      {/* First Page: Overview of Investment Strategies */}
      <section className="max-w-7xl mx-auto p-4">
        <p className="text-center mb-8">
          There are various investment strategies you can adopt, including value investing, growth investing, and income investing.
        </p>
        <h2 className="text-3xl font-semibold mb-4">Types of Investment Strategies</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Value Investing:</strong> Focuses on finding undervalued stocks that have strong fundamentals.</li>
          <li><strong>Growth Investing:</strong> Invests in companies that are expected to grow at an above-average rate compared to their industry.</li>
          <li><strong>Income Investing:</strong> Aims to generate regular income from investments, often through dividends or interest payments.</li>
        </ul>
      </section>

      {/* Second Page: Detailed Breakdown of Each Strategy */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">1. Value Investing</h2>
        <p className="mb-4">
          Value investing involves picking stocks that appear to be trading for less than their intrinsic or book value. 
          Investors use fundamental analysis to identify undervalued stocks, often looking for companies with solid earnings, low debt, and a history of consistent dividends.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Pros:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Potential for significant returns if the stock’s price rises to its intrinsic value.</li>
          <li>Lower risk compared to growth investing, as value stocks tend to be more established companies.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Cons:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Value investing requires patience, as it can take time for the market to recognize a stock’s true value.</li>
          <li>Potential for value traps, where a stock appears undervalued but is declining due to fundamental issues.</li>
        </ul>
        
        <h2 className="text-3xl font-semibold mb-4">2. Growth Investing</h2>
        <p className="mb-4">
          Growth investing focuses on companies that are expected to grow at an above-average rate compared to their industry. 
          Growth investors often look for companies with strong revenue and earnings growth, even if their current stock prices are high.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Pros:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>High potential for capital appreciation as the company grows.</li>
          <li>Often invest in innovative companies with strong competitive advantages.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Cons:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Higher volatility and risk, as growth stocks can be more sensitive to market changes.</li>
          <li>Valuation can be challenging, leading to overpaying for stocks.</li>
        </ul>
      </section>

      {/* Third Page: Additional Strategies */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">3. Income Investing</h2>
        <p className="mb-4">
          Income investing focuses on generating regular income from investments. This can be achieved through dividend-paying stocks, bonds, or real estate investment trusts (REITs).
        </p>
        <h3 className="text-2xl font-semibold mb-2">Pros:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Provides a steady stream of income, which can be appealing for retirees or those needing regular cash flow.</li>
          <li>Often lower volatility than growth stocks.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Cons:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Dividend-paying stocks may offer less capital appreciation compared to growth stocks.</li>
          <li>Reliance on dividends can be risky if companies cut their payouts during economic downturns.</li>
        </ul>
      </section>
    </div>
  );
};

export default InvestmentStrategies;
