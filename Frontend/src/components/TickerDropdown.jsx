import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSymbol } from "../context/dataSlice";
import { FaTimes } from "react-icons/fa"; // Import close icon

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const symbol = useSelector((state) => state.data.symbol);
  const theme = useSelector((state) => state.theme.theme);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const tickerOptions = [
    "NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "NIFTYNXT50", "SENSEX",
    "BANKEX", "SHRIRAMFIN", "MM", "HDFCLIFE", "DIVISLAB", "TITAN", "LT",
    "CRUDEOIL", "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
    "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BEL", "BPCL", "BHARTIARTL",
    "BRITANNIA", "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "GRASIM",
    "HCLTECH", "HDFCBANK", "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK",
    "ITC", "INDUSINDBK", "INFY", "JSWSTEEL", "KOTAKBANK", "MARUTI", "NTPC",
    "NESTLEIND", "ONGC", "POWERGRID", "RELIANCE", "SBILIFE", "SBIN", "SUNPHARMA",
    "TCS", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TECHM", "TRENT",
    "ULTRACEMCO", "WIPRO"
  ];

  const filteredOptions = tickerOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    dispatch(setSymbol(option));
    setIsPopupOpen(false);
  };

  return (
    <div className="relative">
      {/* <label
        htmlFor="ticker"
        className={`block text-md text-center font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
      >
        Ticker
      </label> */}
      <button
        className={`block w-full rounded-md border px-2 py-2 text-left ${theme === "dark"
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-white text-gray-900 border-gray-300"
          }`}
        onClick={() => setIsPopupOpen(true)}
      >
        {symbol || "Select a ticker"}
      </button>

      {isPopupOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 ${theme === "dark" ? "bg-black" : "bg-gray-500"
            }`}
          onClick={() => setIsPopupOpen(false)} // Close popup on background click
        >
          <div
            className={`relative w-80 max-h-[90vh] p-1 rounded-md shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"
              }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Icon */}
            {/* <div className="absolute top-2 right-2">
              <FaTimes
                className={`cursor-pointer text-xl ${theme === "dark" ? "text-gray-300 hover:text-red-500" : "text-gray-600 hover:text-red-500"
                  }`}
                onClick={() => setIsPopupOpen(false)}
              />
            </div> */}

            {/* Search Bar */}
            <div className="mb-1">
              <input
                type="text"
                placeholder="Search tickers..."
                className={`w-full p-1 border rounded-md focus:outline-none ${theme === "dark"
                  ? "bg-gray-700 text-gray-300 border-gray-600"
                  : "bg-gray-200 text-gray-900 border-gray-300"
                  }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options List */}
            <ul
              className={`max-h-48 overflow-y-auto custom-scrollbar ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className={`p-1 cursor-pointer justify-center text-center items-center rounded-md hover:bg-blue-500 hover:text-white ${theme === "dark" ? "hover:bg-blue-600" : "hover:bg-blue-200"
                      }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TickerDropdown;
