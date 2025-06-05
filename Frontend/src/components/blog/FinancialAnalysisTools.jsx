import React from 'react';
import { useSelector } from 'react-redux';

const FinancialAnalysisTools = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white p-4' : 'bg-white text-gray-800 p-4' }>
      <h1 className="text-4xl font-bold text-center my-10">Financial Analysis Tools</h1>
      
      {/* First Page: Overview of Financial Analysis Tools */}
      <section className="max-w-7xl mx-auto mb-10">
        <h2 className="text-3xl font-semibold mb-4">Overview of Financial Analysis Tools</h2>
        <p className="mb-4">
          Financial analysis tools are essential for assessing the performance and potential of investments.
          These tools can help investors make informed decisions based on quantitative and qualitative data.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Common Financial Analysis Tools:</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Ratios:</strong> Use financial ratios like the Price-to-Earnings (P/E) ratio, Return on Equity (ROE), and Debt-to-Equity (D/E) to evaluate a company's performance.</li>
          <li><strong>Trend Analysis:</strong> Analyze historical data to identify patterns and trends in a company’s financial performance over time.</li>
          <li><strong>Forecasting:</strong> Use statistical methods to predict future financial performance based on historical data and market conditions.</li>
        </ul>
      </section>

      {/* Second Page: Practical Examples */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Practical Examples of Financial Analysis Tools</h2>
        <p className="mb-4">
          Let's look at how to apply these tools in real-world scenarios:
        </p>
        <h3 className="text-2xl font-semibold mb-2">Example 1: Analyzing a Company using Ratios</h3>
        <p className="mb-4">
          Consider a company with a P/E ratio of 15. This means investors are willing to pay ₹15 for every ₹1 of earnings. 
          A lower P/E compared to industry peers might indicate the stock is undervalued.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Example 2: Conducting Trend Analysis</h3>
        <p className="mb-4">
          If a company’s revenue has grown consistently by 10% over the last five years, investors may forecast similar growth 
          in the future. By analyzing quarterly earnings reports, investors can track trends and adjust their strategies accordingly.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Example 3: Forecasting Future Performance</h3>
        <p className="mb-4">
          Investors can use historical sales data and market conditions to forecast future revenues. 
          For instance, if a retail company experienced a sales increase of 20% during the holiday season, 
          analysts might project a 15% increase for the next holiday season, adjusting for economic conditions.
        </p>
      </section>
    </div>
  );
};

export default FinancialAnalysisTools;
