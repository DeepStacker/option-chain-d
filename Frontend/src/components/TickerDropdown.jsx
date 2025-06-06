import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setSidAndFetchData } from "../context/dataSlice";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon, // ✅ Corrected
  XMarkIcon,
  BookmarkIcon,
  ChartBarIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data?.options?.data);
  const sid = useSelector((state) => state.data.sid);
  const theme = useSelector((state) => state.theme.theme);
  const tickerOptions = useSelector((state) => state.optionChain.tickerOptions);
  const spotData = useSelector((state) => state.data.data?.spot?.data);

  // Enhanced state management
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteSymbols");
    return saved ? JSON.parse(saved) : ["NIFTY", "BANKNIFTY", "FINNIFTY"];
  });
  const [recentSymbols, setRecentSymbols] = useState(() => {
    const saved = localStorage.getItem("recentSymbols");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCategories, setShowCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Mock market data for demonstration - replace with real data[1][2][3]
  const mockMarketData = useMemo(() => {
    const data = {};
    tickerOptions.forEach((symbol) => {
      data[symbol] = {
        ltp: spotData?.Ltp,
        change: spotData?.ch,
        changePercent: spotData?.p_ch,
        volume: spotData?.vol,
        oi: spotData?.oi,
        iv: data?.atmiv,
      };
    });
    return data;
  }, [tickerOptions, data, spotData]);

  // Symbol categories for better organization
  const symbolCategories = useMemo(
    () => ({
      indices: ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"],
      stocks: tickerOptions.filter(
        (symbol) =>
          !["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"].includes(symbol)
      ),
      favorites: favorites,
      recent: recentSymbols,
    }),
    [tickerOptions, favorites, recentSymbols]
  );

  // Enhanced filtering with category support
  const filteredOptions = useMemo(() => {
    let options = tickerOptions;

    if (selectedCategory !== "all") {
      options = symbolCategories[selectedCategory] || [];
    }

    if (searchTerm.trim()) {
      options = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    return options.map((symbol) => ({
      symbol,
      data: mockMarketData[symbol] || {},
      isFavorite: favorites.includes(symbol),
      isRecent: recentSymbols.includes(symbol),
    }));
  }, [
    tickerOptions,
    searchTerm,
    selectedCategory,
    symbolCategories,
    mockMarketData,
    favorites,
    recentSymbols,
  ]);

  // Handle symbol selection with recent tracking
  const handleSymbolSelect = useCallback(
    (symbol) => {
      dispatch(setSidAndFetchData(symbol));

      // Update recent symbols
      const updatedRecent = [
        symbol,
        ...recentSymbols.filter((s) => s !== symbol),
      ].slice(0, 10);
      setRecentSymbols(updatedRecent);
      localStorage.setItem("recentSymbols", JSON.stringify(updatedRecent));

      setIsPopupOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    },
    [dispatch, recentSymbols]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (symbol, e) => {
      e.stopPropagation();
      const updatedFavorites = favorites.includes(symbol)
        ? favorites.filter((s) => s !== symbol)
        : [...favorites, symbol];

      setFavorites(updatedFavorites);
      localStorage.setItem("favoriteSymbols", JSON.stringify(updatedFavorites));
    },
    [favorites]
  );

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isPopupOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSymbolSelect(filteredOptions[highlightedIndex].symbol);
          }
          break;
        case "Escape":
          setIsPopupOpen(false);
          setSearchTerm("");
          break;
        default:
          break;
      }
    },
    [isPopupOpen, filteredOptions, highlightedIndex, handleSymbolSelect]
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isPopupOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isPopupOpen]);

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.1 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Get current symbol data
  const currentSymbolData = mockMarketData[sid] || {};
  const isPositive = currentSymbolData.change >= 0;

  return (
    <div className="relative z-50 " ref={dropdownRef}>
      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className={`flex items-center justify-between min-w-[200px] px-1 py-1 text-sm font-medium rounded-xl border transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        } ${isPopupOpen ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isPositive ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          />
          <div className="flex items-center space-x-1 text-sm font-semibold">
            <span>{sid}</span>
            <span className={`text-x }`}>({data?.olot || 0})</span>
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ₹{currentSymbolData.ltp?.toFixed(2) || "0.00"}
            </span>
            <span
              className={`text-xs ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              ({isPositive ? "+" : ""}
              {currentSymbolData.changePercent?.toFixed(2) || "0.00"}%)
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isPopupOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Enhanced Dropdown */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl border overflow-hidden ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
            style={{ minWidth: "400px" }}
          >
            {/* Search Header */}
            <div
              className={`p-1 border-b ${
                theme === "dark" ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search symbols..."
                  className={`w-full pl-10 pr-10 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-400"
                      : "bg-gray-50 text-gray-700 border-gray-300 placeholder-gray-500"
                  }`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex space-x-2 mt-3">
                {[
                  { key: "all", label: "All", icon: ChartBarIcon },
                  { key: "favorites", label: "Favorites", icon: StarIcon },
                  { key: "recent", label: "Recent", icon: ClockIcon },
                  {
                    key: "indices",
                    label: "Indices",
                    icon: ArrowTrendingUpIcon,
                  },
                ].map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === category.key
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <category.icon className="w-3 h-3" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.02,
                      },
                    },
                  }}
                >
                  {filteredOptions.map((option, index) => {
                    const { symbol, data, isFavorite, isRecent } = option;
                    const isHighlighted = index === highlightedIndex;
                    const isSelected = symbol === sid;
                    const isDataPositive = data.change >= 0;

                    return (
                      <motion.div
                        key={symbol}
                        variants={itemVariants}
                        onClick={() => handleSymbolSelect(symbol)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150 ${
                          isHighlighted || isSelected
                            ? theme === "dark"
                              ? "bg-gray-700"
                              : "bg-blue-50"
                            : theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        } ${isSelected ? "border-l-4 border-blue-500" : ""}`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {/* Symbol Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-semibold ${
                                  theme === "dark"
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                }`}
                              >
                                {symbol}
                              </span>

                              {/* Badges */}
                              <div className="flex space-x-1">
                                {isRecent && (
                                  <ClockIcon
                                    className="w-3 h-3 text-blue-500"
                                    title="Recently used"
                                  />
                                )}
                                {symbolCategories.indices.includes(symbol) && (
                                  <BoltIcon
                                    className="w-3 h-3 text-yellow-500"
                                    title="Index"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Price Info */}
                            <div className="flex items-center space-x-2 text-xs mt-1">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }
                              >
                                ₹{data.ltp?.toFixed(2) || "0.00"}
                              </span>
                              <span
                                className={`${
                                  isDataPositive
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {isDataPositive ? "+" : ""}
                                {data.change?.toFixed(2) || "0.00"}(
                                {isDataPositive ? "+" : ""}
                                {data.changePercent?.toFixed(2) || "0.00"}%)
                              </span>
                            </div>
                          </div>

                          {/* Market Data */}
                          <div className="text-right text-xs">
                            <div
                              className={`${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              Vol: {(data.volume / 1000).toFixed(0)}K
                            </div>
                            <div
                              className={`${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              OI: {(data.oi / 1000).toFixed(0)}K
                            </div>
                          </div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => toggleFavorite(symbol, e)}
                            className={`p-1 rounded-full transition-colors ${
                              isFavorite
                                ? "text-yellow-500 hover:text-yellow-600"
                                : theme === "dark"
                                ? "text-gray-500 hover:text-yellow-500"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                          >
                            {isFavorite ? (
                              <StarIconSolid className="w-4 h-4" />
                            ) : (
                              <StarIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div
                  className={`p-2 text-center ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No symbols found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div
              className={`px-2 py-0 border-t text-xs ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-750 text-gray-400"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{filteredOptions.length} symbols available</span>
                <div className="flex items-center space-x-4">
                  <span>↑↓ Navigate</span>
                  <span>⏎ Select</span>
                  <span>⎋ Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TickerDropdown;
