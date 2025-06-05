import React from 'react';
import { useSelector } from 'react-redux';

const StockMarketOverview = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
      <h1 className="text-4xl font-bold text-center my-10">Stock Market Overview</h1>
      <p className="max-w-2xl mx-auto text-center mb-8">
        The stock market is a collection of markets where stocks (shares of ownership in businesses) are bought and sold. 
        It plays a crucial role in the economy by providing companies with access to capital and investors with a 
        chance to share in the profits of those companies.
      </p>
      
      {/* Page 1: Understanding Stock Markets */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">1. Understanding Stock Markets</h2>
        <p className="mb-4">
          Stock markets are platforms that enable the buying and selling of stocks. They facilitate the exchange of shares 
          between buyers and sellers, providing liquidity to investors and enabling companies to raise capital for growth.
        </p>
        <p className="mb-4">
          Stock markets can be broadly categorized into two types: primary and secondary markets.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Primary Market</h3>
        <p className="mb-4">
          The primary market is where new securities are issued for the first time. Companies raise capital by offering 
          shares to the public through an Initial Public Offering (IPO). In this market, investors purchase shares directly 
          from the issuer at a specified price.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Secondary Market</h3>
        <p className="mb-4">
          The secondary market is where previously issued securities are traded among investors. The stock exchanges 
          (such as NSE and BSE in India) facilitate these trades, providing a platform for price discovery and liquidity. 
          Investors buy and sell shares at market-determined prices.
        </p>
      </section>

      {/* Page 2: Types of Markets */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">2. Types of Markets</h2>
        <p className="mb-4">
          In addition to the primary and secondary markets, there are other types of markets that play significant roles in 
          the financial ecosystem:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Equity Market:</strong> Focused on the trading of stocks and shares, providing investors with ownership stakes in companies.</li>
          <li><strong>Debt Market:</strong> Involves the trading of fixed income securities like bonds, allowing issuers to raise funds while providing investors with regular interest payments.</li>
          <li><strong>Derivatives Market:</strong> Involves contracts whose value is derived from underlying assets, such as stocks, commodities, or indices. This market includes options, futures, and swaps.</li>
          <li><strong>Commodity Market:</strong> Focuses on the trading of physical goods like oil, gold, and agricultural products. It plays a vital role in price discovery and risk management for producers and consumers.</li>
          <li><strong>Foreign Exchange (Forex) Market:</strong> The largest financial market in the world, where currencies are traded. This market allows businesses and investors to hedge against currency risk.</li>
        </ul>
      </section>

      {/* Page 3: Focus on Derivatives Market in India */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">3. Focus on Derivatives Market in India</h2>
        <p className="mb-4">
          The derivatives market in India has gained significant traction over the years, offering various instruments that 
          help investors manage risk and enhance returns. The National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) 
          are the primary exchanges for trading derivatives in India.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Types of Derivatives</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Futures:</strong> Standardized contracts to buy or sell an underlying asset at a predetermined price on a specified date in the future. Futures are traded on exchanges.</li>
          <li><strong>Options:</strong> Contracts that give the buyer the right, but not the obligation, to buy (call option) or sell (put option) an underlying asset at a predetermined price before a specified expiration date.</li>
          <li><strong>Swaps:</strong> Agreements between two parties to exchange cash flows or other financial instruments. Common types include interest rate swaps and currency swaps.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Benefits of Trading Derivatives</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Hedging:</strong> Derivatives allow investors to hedge against potential losses in their portfolios by offsetting risks with opposite positions.</li>
          <li><strong>Leverage:</strong> Traders can control larger positions with a smaller amount of capital, amplifying potential returns (but also risks).</li>
          <li><strong>Price Discovery:</strong> Derivatives markets provide valuable information about future price expectations for underlying assets.</li>
        </ul>
      </section>

      {/* Page 4: Risks Associated with Derivatives */}
      <section className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-4">4. Risks Associated with Derivatives</h2>
        <p className="mb-4">
          While derivatives offer significant advantages, they also come with risks that investors must understand:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Market Risk:</strong> The potential for losses due to adverse price movements in the underlying asset.</li>
          <li><strong>Counterparty Risk:</strong> The risk that the other party in a derivatives transaction may default on their obligations.</li>
          <li><strong>Leverage Risk:</strong> The use of leverage can amplify losses as well as gains, leading to significant risks if not managed properly.</li>
          <li><strong>Liquidity Risk:</strong> The risk of being unable to buy or sell derivatives quickly enough without affecting their price.</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Mitigating Risks</h3>
        <p className="mb-4">
          Investors can mitigate risks in derivatives trading by employing various strategies:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Using stop-loss orders to limit potential losses.</li>
          <li>Diversifying across different types of derivatives and underlying assets.</li>
          <li>Regularly reviewing and adjusting positions based on market conditions.</li>
        </ul>
      </section>
    </div>
  );
};

export default StockMarketOverview;
