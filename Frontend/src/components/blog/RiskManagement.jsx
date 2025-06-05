import React from 'react';
import { useSelector } from 'react-redux';

const RiskManagement = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
      <h1 className="text-4xl font-bold text-center my-10">Risk Management Strategies</h1>
      
      {/* Overview of Risk Management Strategies */}
      <section className="max-w-7xl mx-auto p-4">
        <p className="text-center mb-8">
          Effective risk management strategies are essential for protecting your investments. 
          Techniques include diversification, asset allocation, and the use of stop-loss orders.
        </p>
        <h2 className="text-3xl font-semibold mb-4">Key Risk Management Strategies</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Diversification:</strong> Spreading investments across various assets to reduce exposure to any single asset.</li>
          <li><strong>Asset Allocation:</strong> Distributing investments among different asset classes (stocks, bonds, cash) based on risk tolerance.</li>
          <li><strong>Stop-Loss Orders:</strong> Setting predefined sell orders to limit losses on investments.</li>
        </ul>
      </section>

      {/* Page 1: Diversification */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">1. Diversification</h2>
        <p className="mb-4">
          Diversification involves investing in a variety of assets to reduce the overall risk of your portfolio. 
          By holding different types of investments, the poor performance of one asset may be offset by the strong performance of others.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Diversify</h3>
        <p className="mb-4">
          Investors can diversify by:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Investing in different sectors (e.g., technology, healthcare, finance).</li>
          <li>Including various asset classes (stocks, bonds, real estate).</li>
          <li>Considering international investments to reduce country-specific risks.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Pros and Cons of Diversification</h3>
        <h4 className="font-semibold">Pros:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Reduces overall risk by spreading exposure.</li>
          <li>Can lead to more stable returns over time.</li>
        </ul>
        <h4 className="font-semibold">Cons:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Diminishes the potential for high returns if too diversified.</li>
          <li>Requires ongoing management and monitoring of multiple assets.</li>
        </ul>
      </section>

      {/* Page 2: Asset Allocation */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">2. Asset Allocation</h2>
        <p className="mb-4">
          Asset allocation involves dividing your investment portfolio among different asset categories to balance risk and reward based on your financial goals and risk tolerance.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Types of Asset Classes</h3>
        <p className="mb-4">
          The main asset classes include:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Stocks:</strong> Represent ownership in companies and offer potential for high returns but come with higher risk.</li>
          <li><strong>Bonds:</strong> Loans to governments or corporations that provide fixed interest payments, typically with lower risk than stocks.</li>
          <li><strong>Cash or Cash Equivalents:</strong> Includes savings accounts and money market funds, providing liquidity and safety but lower returns.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Developing an Asset Allocation Strategy</h3>
        <p className="mb-4">
          To create an effective asset allocation strategy, consider:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Your investment goals (e.g., retirement, education).</li>
          <li>Your time horizon (how long you plan to invest).</li>
          <li>Your risk tolerance (how much risk you can comfortably take).</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Pros and Cons of Asset Allocation</h3>
        <h4 className="font-semibold">Pros:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Helps to achieve a desired balance between risk and return.</li>
          <li>Can improve the risk-return profile of a portfolio over time.</li>
        </ul>
        <h4 className="font-semibold">Cons:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Requires continuous monitoring and adjustment.</li>
          <li>May lead to losses if market conditions shift dramatically.</li>
        </ul>
      </section>

      {/* Page 3: Stop-Loss Orders */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">3. Stop-Loss Orders</h2>
        <p className="mb-4">
          A stop-loss order is a predetermined price at which an investor will sell a security to prevent further losses. It helps protect investments from significant downturns.
        </p>
        <h3 className="text-2xl font-semibold mb-2">How to Use Stop-Loss Orders</h3>
        <p className="mb-4">
          To implement stop-loss orders:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Set a stop-loss price based on your risk tolerance (e.g., 10% below purchase price).</li>
          <li>Monitor your investments regularly to adjust stop-loss levels as needed.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Pros and Cons of Stop-Loss Orders</h3>
        <h4 className="font-semibold">Pros:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Helps minimize potential losses by automatically selling at a set price.</li>
          <li>Reduces the emotional stress of managing investments during market downturns.</li>
        </ul>
        <h4 className="font-semibold">Cons:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Market volatility can trigger stop-loss orders during temporary dips, resulting in selling at a loss.</li>
          <li>May limit potential gains if the stock price rebounds after hitting the stop-loss level.</li>
        </ul>
      </section>

      {/* Page 4: Additional Risk Management Techniques */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">4. Additional Risk Management Techniques</h2>
        <p className="mb-4">
          Beyond diversification, asset allocation, and stop-loss orders, consider these additional techniques:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Hedging:</strong> Use financial instruments like options and futures to offset potential losses in investments.</li>
          <li><strong>Rebalancing:</strong> Regularly adjust your portfolio to maintain your desired asset allocation as market values fluctuate.</li>
          <li><strong>Risk Assessment:</strong> Continuously evaluate your investments and overall portfolio to identify and mitigate risks.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Pros and Cons of Additional Techniques</h3>
        <h4 className="font-semibold">Pros:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Provides more options for managing risk beyond basic strategies.</li>
          <li>Can enhance overall portfolio performance when implemented effectively.</li>
        </ul>
        <h4 className="font-semibold">Cons:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Complex strategies can require more knowledge and experience.</li>
          <li>May incur additional costs (e.g., fees for options trading).</li>
        </ul>
      </section>
    </div>
  );
};

export default RiskManagement;
