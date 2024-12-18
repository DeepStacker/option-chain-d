// src/components/OptionsTable.js

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// Components
import Popup from "./charts/ChartPopup";
import DeltaPopup from "./charts/DeltaChartPopup";
import IVPopup from "./charts/Popup";
import FuturePopup from "./charts/FuturePopup";
import ReversalPopup from "./charts/ReversalPopup";
import LabelSight from "./LabelSight";
import Ticker from "./Ticker";
import TickerChange from "./TickerChange";
import Line from './Line';

// Utils
import { findStrikes, renderStrikeRow } from "../utils/optionChainTable/OptionTableUtils";
import { setIsOc } from "../context/dataSlice";
import { setStrike, setPopupData } from "../context/optionData";

// Styles
import './tableStyle.css';

// API endpoints
const API_BASE_URL = "http://127.0.0.1:5000/api";
const API_ENDPOINTS = {
  percentage: `${API_BASE_URL}/percentage-data/`,
  iv: `${API_BASE_URL}/iv-data/`,
  delta: `${API_BASE_URL}/delta-data/`,
  future: `${API_BASE_URL}/fut-data/`,
};

const OptionsTable = memo(() => {
  const dispatch = useDispatch();

  // Redux selectors
  const {
    theme,
    isReversed,
    isHighlighting
  } = useSelector((state) => state.theme);

  const {
    data,
    exp,
    symbol,
    error
  } = useSelector((state) => state.data);

  const {
    strike,
    popupData
  } = useSelector((state) => state.optionChain);

  // Local state
  const [popupStates, setPopupStates] = useState({
    isPopupVisible: false,
    isDeltaPopupVisible: false,
    isFuturePricePopupVisible: false,
    isReversalPopupVisible: false,
    isIVPopupVisible: false,
    isExpiryPopupVisible: false
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // Option chain data
  const options = data?.options?.data?.oc || {};
  const atmPrice = data?.spot?.data?.Ltp ? Math.round(data.spot.data.Ltp) : null;
  const spotPrice = data?.spot?.data?.Ltp !== undefined ? parseFloat(data.spot.data.Ltp).toFixed(2) : null;
  
  const [lastSpotPrice, setLastSpotPrice] = useState(atmPrice);
  const [isPriceUp, setIsPriceUp] = useState(false);

  // Memoized strike calculations
  const { nearestStrike, otmStrikes, itmStrikes } = useMemo(() => 
    findStrikes(options, atmPrice),
    [options, atmPrice]
  );

  const itmActiveStrikes = useMemo(() => {
    const strikes = [...itmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [itmStrikes, isReversed]);

  const otmActiveStrikes = useMemo(() => {
    const strikes = [...otmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [otmStrikes, isReversed]);

  // State for active strikes
  const [otm, setOtm] = useState(otmActiveStrikes);
  const [itm, setItm] = useState(itmActiveStrikes);

  // Generic API fetch function
  const fetchApiData = useCallback(async (endpoint, params) => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await axios.post(endpoint, params);
      if (response.data) {
        dispatch(setPopupData(response.data));
        return response.data;
      }
      throw new Error("No data received from API.");
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError("Failed to fetch data. Please try again later.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Click handlers
  const handlePercentageClick = useCallback((isCe, strike) => {
    fetchApiData(API_ENDPOINTS.percentage, { strike, exp, isCe, sid: symbol })
      .then(() => setPopupStates(prev => ({ ...prev, isPopupVisible: true })));
  }, [exp, symbol, fetchApiData]);

  const handleIVClick = useCallback((isCe, strike) => {
    fetchApiData(API_ENDPOINTS.iv, { strike, exp, isCe, sid: symbol })
      .then(() => setPopupStates(prev => ({ ...prev, isIVPopupVisible: true })));
  }, [exp, symbol, fetchApiData]);

  const handleDeltaClick = useCallback((strike) => {
    fetchApiData(API_ENDPOINTS.delta, { strike, exp, sid: symbol })
      .then(() => setPopupStates(prev => ({ ...prev, isDeltaPopupVisible: true })));
  }, [exp, symbol, fetchApiData]);

  const handleFuturePriceClick = useCallback((strike) => {
    fetchApiData(API_ENDPOINTS.future, { strike, exp, sid: symbol })
      .then(() => setPopupStates(prev => ({ ...prev, isFuturePricePopupVisible: true })));
  }, [exp, symbol, fetchApiData]);

  const handleReversalClick = useCallback((strike) => {
    if (data?.options?.data) {
      dispatch(setStrike(strike));
      setPopupStates(prev => ({ ...prev, isReversalPopupVisible: true }));
    }
  }, [data, dispatch]);

  const handleClosePopup = useCallback(() => {
    dispatch(setPopupData(null));
    setPopupStates({
      isPopupVisible: false,
      isDeltaPopupVisible: false,
      isFuturePricePopupVisible: false,
      isReversalPopupVisible: false,
      isIVPopupVisible: false,
      isExpiryPopupVisible: false
    });
  }, [dispatch]);

  // Effects
  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  useEffect(() => {
    if (symbol) {
      const timer = setTimeout(() => {
        setPopupStates(prev => ({ ...prev, isExpiryPopupVisible: false }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [symbol]);

  useEffect(() => {
    if (spotPrice !== null && lastSpotPrice !== spotPrice) {
      setIsPriceUp(spotPrice > lastSpotPrice);
      setLastSpotPrice(spotPrice);
    }
  }, [spotPrice, lastSpotPrice]);

  useEffect(() => {
    setOtm(isReversed ? itmActiveStrikes : otmActiveStrikes);
    setItm(isReversed ? otmActiveStrikes : itmActiveStrikes);
  }, [otmActiveStrikes, itmActiveStrikes, isReversed]);

  // Early return if data is unavailable
  if (!data?.options?.data) {
    return (
      <div className={` ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex  flex-col items-center justify-center h-full text-center`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full border-8 border-t-8 border-gray-200 border-t-blue-500 h-16 w-16" role="status" aria-label="Loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">
          Loading...
        </div>
      </div>
    );
  }

  const ceHeaders = [
    { label: "IV", subtitle: "Delta" },
    { label: "OI CHNG", },
    { label: "OI" },
    { label: "VOLUME", },
    { label: "LTP", subtitle: "Ltp_chng (TV)" },
  ];

  const peHeaders = [
    { label: "LTP", subtitle: "Ltp_chng (TV)" },
    { label: "VOLUME", },
    { label: "OI" },
    { label: "OI CHNG", },
    { label: "IV", subtitle: "Delta" },
  ];

  const Spot = memo(({ spotPrice, isPriceUp }) => (
    <div className="flex gap-x-2">
      <span className={`${isPriceUp ? "text-green-500" : "text-red-500"}`} >
        {spotPrice}
      </span>
      <span>
        {isPriceUp ? (
          <ArrowUpIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
        ) : (
          <ArrowDownIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        )}
      </span>
    </div>
  ));

  return (
    <div
      className={`h-screen relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-white via-gray-100 to-gray-200"}`}
    >
      {/* Error or Loading Popups */}
      {fetchError && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"} z-50`}
          role="alert"
        >
          {fetchError}
        </div>
      )}
      {error && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"} z-50`}
          role="alert"
        >
          Something went wrong. Please try again.
        </div>
      )}

      {/* Popup for Expiry Date */}
      {!popupStates.isExpiryPopupVisible && !itm.length && !otm.length && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg text-center max-w-sm ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}
          >
            <p className="text-lg font-semibold">Please Select an Expiry Date</p>
            <button
              onClick={() => setPopupStates(prev => ({ ...prev, isExpiryPopupVisible: true }))}
              className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Okay
            </button>
          </div>
        </div>
      )}


      {/* Options Table */}
      <div className="max-h-full overflow-hidden">
        <div className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-20px)]">
          <table
            id="options-table"
            className={`w-full shadow-lg rounded-lg text-sm md:text-base border-collapse ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-300 bg-white text-gray-700"}`}
          >
            {/* Table Header */}
            <thead
              className={`${theme === "dark" ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-gray-300" : "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-700"} font-semibold sticky top-0 z-10`}
            >
              <tr className={`divide-x ${theme === "dark" ? "divide-gray-600" : "divide-gray-300"}`}>
                {ceHeaders.map((header, index) => (
                  <th key={index} className="p-3 text-center">
                    <span>{header.label}</span>
                    <br />
                    <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{header.subtitle}</small>
                  </th>
                ))}
                <th className="p-3 bg-yellow-100 text-yellow-800 font-bold text-center">
                  Strike Price
                  <br />
                  <small className="text-xs text-yellow-600">PCR</small>
                </th>
                {peHeaders.map((header, index) => (
                  <th key={index + ceHeaders.length} className="p-3 text-center">
                    <span>{header.label}</span>
                    <br />
                    <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{header.subtitle}</small>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
              {itm.map((strike) => (
                <tr
                  key={strike}
                  className={`text-center transition-all duration-200 ease-in-out divide-x hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} ${theme === "dark" ? "divide-gray-800" : "divide-gray-300"}`}
                >
                  {renderStrikeRow(
                    options[strike],
                    strike,
                    isHighlighting,
                    data.options.data,
                    handlePercentageClick,
                    handleDeltaClick,
                    handleIVClick,
                    handleReversalClick,
                    theme
                  )}
                </tr>
              ))}

              {/* Spot Price Row */}
              <tr>
                <td colSpan={1}>
                  <Line />
                </td>
                <td colSpan={1}>
                  <Ticker />
                </td>
                <td colSpan={1}>
                  <Line />
                </td>
                <td
                  onClick={() => handleFuturePriceClick()}
                  colSpan={5}
                  className={`p-2 cursor-pointer ${theme === "dark" ? "text-gray-600" : "text-gray-900"} `}
                >
                  <LabelSight />
                </td>
                <td colSpan={1}>
                  <Line />
                </td>
                <td colSpan={1} className="p-2">
                  <TickerChange />
                </td>
                <td colSpan={1}>
                  <Line />
                </td>
              </tr>

              {otm.map((strike) => (
                <tr
                  key={strike}
                  className={`text-center transition-all duration-200 ease-in-out divide-x hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} ${theme === "dark" ? "divide-gray-800" : "divide-gray-300"}`}
                >
                  {renderStrikeRow(
                    options[strike],
                    strike,
                    isHighlighting,
                    data.options.data,
                    handlePercentageClick,
                    handleDeltaClick,
                    handleIVClick,
                    handleReversalClick,
                    theme
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popups */}
      {popupStates.isPopupVisible && <Popup data={popupData} onClose={handleClosePopup} />}
      {popupStates.isDeltaPopupVisible && <DeltaPopup data={popupData} onClose={handleClosePopup} />}
      {popupStates.isIVPopupVisible && <IVPopup data={popupData} onClose={handleClosePopup} />}
      {popupStates.isFuturePricePopupVisible && <FuturePopup data={popupData} onClose={handleClosePopup} />}
      {popupStates.isReversalPopupVisible && <ReversalPopup strike={strike} onClose={handleClosePopup} />}
    </div>
  );
});

export default OptionsTable;