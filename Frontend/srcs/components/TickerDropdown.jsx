import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSymbol } from "../context/dataSlice";

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const symbol = useSelector((state) => state.data.symbol);
  const theme = useSelector((state) => state.theme.theme);
  const tickerOptions = useSelector((state) => state.optionChain.tickerOptions);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Filter options, ignoring extra spaces
  const filteredOptions = useMemo(
    () =>
      tickerOptions.filter((option) =>
        option.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [tickerOptions, searchTerm]
  );

  const handleSelect = (option) => {
    dispatch(setSymbol(option));
    setIsPopupOpen(false);
    setSearchTerm(""); // Reset search term
    setHighlightedIndex(-1); // Reset highlighted index
  };

  const handleKeyDown = (e) => {
    if (!isPopupOpen) return;

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        if (highlightedIndex >= 0) handleSelect(filteredOptions[highlightedIndex]);
        break;
      case "Escape":
        setIsPopupOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        className={`block w-full rounded-md border px-2 py-2 text-left transition-all focus:outline-none focus:ring-2 ${theme === "dark"
          ? "bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500"
          : "bg-white text-gray-900 border-gray-300 focus:ring-blue-300"
          }`}
        onClick={() => setIsPopupOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isPopupOpen}
      >
        {symbol || "Select a ticker"}
      </button>

      {isPopupOpen && (
        <div
          className={`fixed inset-0 z-50 bg-opacity-50 transition-all ${theme === "dark" ? "bg-black" : "bg-gray-500"
            }`}
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className={`relative w-96 h-[35rem] max-h-full mx-auto mt-20 p-2 rounded-md shadow-lg overflow-hidden transition-all ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"
              }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="dialog"
          >
            {/* Search Bar */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search tickers..."
                className={`w-full px-3 py-2 rounded-md border transition-all focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500"
                  : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-300"
                  }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search tickers"
              />
            </div>

            {/* Options List */}
            <ul
              className={`max-h-full overflow-y-auto relative -mx-2 px-2 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              style={{
                scrollbarWidth: "none", // For Firefox
                msOverflowStyle: "none", // For IE 10+
              }}
              role="listbox"
            >
              {/* Hide scrollbar for Webkit browsers */}
              <style>
                {`
                  ul::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>

              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className={`p-2 cursor-pointer text-center rounded-md transition-all ${highlightedIndex === index
                      ? "bg-blue-500 text-white"
                      : theme === "dark"
                        ? "hover:bg-blue-600 hover:text-white"
                        : "hover:bg-blue-200 hover:text-black"
                      }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500" role="option">
                  No options found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TickerDropdown;
