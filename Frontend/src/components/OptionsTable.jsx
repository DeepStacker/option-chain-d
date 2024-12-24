// src/components/OptionsTable.js

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Popup from "./charts/ChartPopup";
import axios from "axios";
import { findStrikes, renderStrikeRow } from "../utils/optionChainTable/OptionTableUtils";
import { useDispatch, useSelector } from "react-redux";
import { setIsOc } from "../context/dataSlice"; // Import data actions
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import LabelSight from "./LabelSight";
import Ticker from "./Ticker";
import TickerChange from "./TickerChange";
import Line from './Line';
import './tableStyle.css';
import DeltaPopup from "./charts/DeltaChartPopup";
import IVPopup from "./charts/Popup";
import FuturePopup from "./charts/FuturePopup";
import ReversalPopup from "./charts/ReversalPopup";
import { setStrike, setPopupData } from "../context/optionData";

// Updated OptionsTable.jsx to:
// 1. Use sid instead of symbol from state
// 2. Update dependency arrays to use sid
// 3. Remove unnecessary state updates

// API configuration
const API_BASE_URL = 'http://localhost:10000';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Accept': '*/*'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

function OptionsTable() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);

  // Data state
  const data = useSelector((state) => state.data.data);
  const exp = useSelector((state) => state.data.exp_sid);
  const sid = useSelector((state) => state.data.sid); // Changed from symbol to sid
  const error = useSelector((state) => state.data.error);
  const strike = useSelector((state) => state.optionChain.strike);
  const popupData = useSelector((state) => state.optionChain.popupData);

  // State hooks
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDeltaPopupVisible, setIsDeltaPopupVisible] = useState(false);
  const [isFuturePricePopupVisible, setIsFuturePricePopupVisible] = useState(false);
  const [isReversalPopupVisible, setIsReversalPopupVisible] = useState(false);
  const [isIVPopupVisible, setIsIVPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isExpiryPopupVisible, setExpiryPopupVisible] = useState(false);

  useEffect(() => {
    if (sid) { // Changed from symbol to sid
      const timer = setTimeout(() => {
        setExpiryPopupVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sid]); // Changed from symbol to sid

  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  // Helper function to get the auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch data from the API
  const fetchPercentageData = useCallback(async (params) => {
    const token = getAuthToken();
    setLoading(true);
    setFetchError(null);
    try {
      const requestData = {
        ...params,
        option_type: params.option_type || 'CE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      console.log('Fetching percentage data:', requestData);
      const response = await axiosInstance.post('/api/percentage-data/', requestData);

      if (response.data) {
        dispatch(setPopupData(response.data));
        setIsPopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchIVData = useCallback(async (params) => {
    setLoading(true);
    setFetchError(null);
    try {
      const requestData = {
        ...params,
        option_type: params.option_type || 'CE'
      };
      console.log('Fetching IV data:', requestData);
      const response = await axiosInstance.post('/api/iv-data/', requestData);

      if (response.data) {
        dispatch(setPopupData(response.data));
        setIsIVPopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchDeltaData = useCallback(async (params) => {
    setLoading(true);
    setFetchError(null);
    try {
      const requestData = {
        ...params,
        option_type: params.option_type || 'CE'
      };
      console.log('Fetching delta data:', requestData);
      const response = await axiosInstance.post('/api/delta-data/', requestData);

      if (response.data) {
        dispatch(setPopupData(response.data));
        setIsDeltaPopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchFuturePriceData = useCallback(async (params) => {
    setLoading(true);
    setFetchError(null);
    try {
      const requestData = {
        ...params,
        option_type: params.option_type || 'CE'
      };
      console.log('Fetching future price data:', requestData);
      const response = await axiosInstance.post('/api/fut-data/', requestData);

      if (response.data) {
        dispatch(setPopupData(response.data));
        setIsFuturePricePopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Option data and ATM price
  const options = data?.options?.data?.oc || {};
  const atmPrice = data?.spot?.data?.Ltp ? Math.round(data.spot.data.Ltp) : null;
  const [lastSpotPrice, setLastSpotPrice] = useState(atmPrice);
  const spotPrice = data?.spot?.data?.Ltp !== undefined ? parseFloat(data.spot.data.Ltp).toFixed(2) : null;
  const [isPriceUp, setIsPriceUp] = useState(false);

  // Effect to update the lastSpotPrice and determine the price direction
  useEffect(() => {
    if (spotPrice !== null && lastSpotPrice !== spotPrice && spotPrice > lastSpotPrice) {
      setIsPriceUp(true);
      setLastSpotPrice(spotPrice);
    } else if (spotPrice !== null && lastSpotPrice !== spotPrice && spotPrice < lastSpotPrice) {
      setIsPriceUp(false)
      setLastSpotPrice(spotPrice)
    }
  }, [spotPrice]);

  const { nearestStrike, otmStrikes, itmStrikes } = useMemo(() => {
    return findStrikes(options, atmPrice);
  }, [options, atmPrice]);

  // Create active strikes list and reverse if needed
  const itmActiveStrikes = useMemo(() => {
    const strikes = [...itmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [itmStrikes, isReversed]);

  const otmActiveStrikes = useMemo(() => {
    const strikes = [...otmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [otmStrikes, isReversed]);

  // State to manage the currently active OTM and ITM strikes
  const [otm, setOtm] = useState(otmActiveStrikes);
  const [itm, setItm] = useState(itmActiveStrikes);

  // Effect to update OTM and ITM whenever active strikes or reversal flag changes
  useEffect(() => {
    if (otmActiveStrikes.length > 0 || itmActiveStrikes.length > 0) {
      setOtm(isReversed ? itmActiveStrikes : otmActiveStrikes);
      setItm(isReversed ? otmActiveStrikes : itmActiveStrikes);
    }
  }, [isReversed, otmActiveStrikes, itmActiveStrikes]);

  const handlePercentageClick = (isCe, strike) => {
    fetchPercentageData({
      sid,
      exp_sid: exp,
      strike,
      option_type: isCe
    });
  };

  const handleIVClick = (isCe, strike) => {
    fetchIVData({
      sid,
      exp_sid: exp,
      strike,
      option_type: isCe
    });
  };

  const handleDeltaClick = (strike) => {
    fetchDeltaData({
      sid,
      exp_sid: exp,
      strike
    });
  };

  const handleFuturePriceClick = (strike) => {
    fetchFuturePriceData({
      sid,
      exp_sid: exp,
      strike
    });
  };

  const toggleExpiryPopup = () => setExpiryPopupVisible(!isExpiryPopupVisible);

  // Handle reversal click
  const handleReversalClick = (strike) => {
    setLoading(true);
    setFetchError(null);
    try {
      if (data) {
        dispatch(setStrike(strike));
        setIsReversalPopupVisible(true);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Close popup
  const closePopup = () => {
    dispatch(setPopupData(null));
    setIsPopupVisible(false);
    setIsDeltaPopupVisible(false);
    setIsIVPopupVisible(false);
    setIsFuturePricePopupVisible(false);
    setIsReversalPopupVisible(false);
  };

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
      {!isExpiryPopupVisible && !itm.length && !otm.length && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg text-center max-w-sm ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}
          >
            <p className="text-lg font-semibold">Please Select an Expiry Date</p>
            <button
              onClick={toggleExpiryPopup} // Close the popup on click
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
      {isPopupVisible && <Popup data={popupData} onClose={closePopup} />}
      {isDeltaPopupVisible && <DeltaPopup data={popupData} onClose={closePopup} />}
      {isIVPopupVisible && <IVPopup data={popupData} onClose={closePopup} />}
      {isFuturePricePopupVisible && <FuturePopup data={popupData} onClose={closePopup} />}
      {isReversalPopupVisible && <ReversalPopup strike={strike} onClose={closePopup} />}
    </div>
  );
}

export default OptionsTable;