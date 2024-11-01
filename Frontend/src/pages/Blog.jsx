import React from "react";
import {
  FinancialAnalysisTools,
  InvestmentStrategies,
  MarketNews,
  RiskManagement,
  StockMarketOverview,
} from "../components/blog";

// Importing necessary icons
import {
  FaChartLine,
  FaClipboardList,
  FaBullhorn,
  FaShieldAlt,
} from "react-icons/fa";
// import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { useSelector } from "react-redux";

// Importing images

function Blog() {
  const theme = useSelector((state) => state.theme.theme);
  const stockMarketImage =
    "https://plus.unsplash.com/premium_photo-1681487767138-ddf2d67b35c1?q=80&w=1910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const analysisImage =
    "https://images.pexels.com/photos/7172830/pexels-photo-7172830.jpeg?auto=compress&cs=tinysrgb&w=600";
  const investmentImage =
    "https://images.pexels.com/photos/6777570/pexels-photo-6777570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const riskImage =
    "https://images.pexels.com/photos/6120218/pexels-photo-6120218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <h1 className="text-5xl font-bold text-center my-8">
        Financial Insights Blog
      </h1>
      <p className="text-center text-lg mb-12">
        Explore in-depth articles on stock markets, investment strategies, risk
        management, and more.
      </p>

      <section className="mb-10">
        <div
          className={`flex flex-col items-center shadow-lg rounded-lg p-6 ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <img
            src={stockMarketImage}
            alt="Stock Market"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <StockMarketOverview />
          <h2 className="text-2xl font-semibold text-center mb-4">
            Stock Market Overview
          </h2>
          <FaChartLine
            className={`${
              theme === "dark" ? "text-blue-300" : "text-blue-500"
            } text-3xl`}
          />
        </div>
      </section>

      <section className="mb-10">
        <div
          className={`flex flex-col items-center  shadow-lg rounded-lg p-6 ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <img
            src={analysisImage}
            alt="Financial Analysis"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <FinancialAnalysisTools />
          <h2 className="text-2xl font-semibold text-center mb-4">
            Financial Analysis Tools
          </h2>
          <FaClipboardList
            className={`${
              theme === "dark" ? "text-green-300" : "text-green-500"
            } text-3xl`}
          />
        </div>
      </section>

      <section className="mb-10">
        <div
          className={`flex flex-col items-center  shadow-lg rounded-lg p-6 ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <img
            src={investmentImage}
            alt="Investment Strategies"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <InvestmentStrategies />
          <h2 className="text-2xl font-semibold text-center mb-4">
            Investment Strategies
          </h2>
          <FaBullhorn
            className={`${
              theme === "dark" ? "text-yellow-300" : "text-yellow-500"
            } text-3xl`}
          />
        </div>
      </section>

      {/* Uncomment when MarketNews component is ready */}
      {/* <section className="mb-10">
          <div className={`flex flex-col items-center bg-white shadow-lg rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <MarketNews />
            <h2 className="text-2xl font-semibold text-center mb-4">Market News</h2>
            <BsFillFileEarmarkTextFill className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-500'} text-3xl`} />
          </div>
        </section> */}

      <section className="mb-10">
        <div
          className={`flex flex-col items-center  shadow-lg rounded-lg p-6 ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <img
            src={riskImage}
            alt="Risk Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <RiskManagement />
          <h2 className="text-2xl font-semibold text-center mb-4">
            Risk Management Strategies
          </h2>
          <FaShieldAlt
            className={`${
              theme === "dark" ? "text-red-300" : "text-red-500"
            } text-3xl`}
          />
        </div>
      </section>
    </div>
  );
}

export default Blog;
