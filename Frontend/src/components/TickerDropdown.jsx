import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidAndFetchData } from "../context/dataSlice";

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const sid = useSelector((state) => state.data.sid);
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

  const handleSymbolSelect = (symbol) => {
    dispatch(setSidAndFetchData(symbol));
    setIsPopupOpen(false);
    setSearchTerm('');
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
        if (highlightedIndex >= 0) handleSymbolSelect(filteredOptions[highlightedIndex]);
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
      <div className="flex items-center">
        <button
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className={`flex items-center justify-between w-32 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${
            theme === "dark"
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {sid}
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${
              isPopupOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isPopupOpen && (
        <div
          className={`absolute z-50 w-full mt-2 rounded-md shadow-lg ${
            theme === "dark" ? "bg-gray-700" : "bg-white"
          }`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className={`w-full px-4 py-2 text-sm border-b focus:outline-none ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 border-gray-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
            autoFocus
          />
          <ul
            className={`max-h-60 overflow-auto ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option}
                onClick={() => handleSymbolSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  index === highlightedIndex
                    ? theme === "dark"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-900"
                    : theme === "dark"
                    ? "text-gray-200 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TickerDropdown;
