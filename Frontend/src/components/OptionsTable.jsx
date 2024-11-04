// src/components/OptionsTable.js

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Popup from "./ChartPopup";
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

function OptionsTable() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);

  // Data state
  const data = useSelector((state) => state.data.data);
  const exp = useSelector((state) => state.data.exp);
  const symbol = useSelector((state) => state.data.symbol);
  const error = useSelector((state) => state.data.error);

  // State hooks
  const [popupData, setPopupData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  // Fetch data from the API
  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setFetchError(null); // Reset fetch error state
    try {
      const response = await axios.post("https://option-chain-d.onrender.com/api/percentage-data", params);
      if (response.data) {
        setPopupData(response.data);
        setIsPopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError("Failed to fetch data. Please try again later."); // Set fetch error message
    } finally {
      setLoading(false);
    }
  }, []);

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
    setOtm(isReversed ? itmActiveStrikes : otmActiveStrikes);
    setItm(isReversed ? otmActiveStrikes : itmActiveStrikes);
  }, [otmActiveStrikes, itmActiveStrikes]);


  const handlePercentageClick = (isCe, strike) => {
    fetchData({ strike, exp, isCe, sid: symbol });
  };

  // Close popup
  const closePopup = () => {
    setPopupData(null);
    setIsPopupVisible(false);
  };

  // Early return if data is unavailable
  if (!data?.options?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
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
    { label: "OI CHANGE", },
    { label: "OI" },
    { label: "VOLUME", },
    { label: "LTP", subtitle: "Ltp_chng" },
  ];

  const peHeaders = [
    { label: "LTP", subtitle: "Ltp_chng" },
    { label: "VOLUME", },
    { label: "OI" },
    { label: "OI CHANGE", },
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
    <div className={`h-[100vh] overflow-y-auto pt-7 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      {loading && (
        <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} role="status">
          Loading...
        </div>
      )}
      {fetchError && (
        <div className={`text-red-500 ${theme === "dark" ? "text-red-300" : "text-red-500"}`} role="alert">
          {fetchError}
        </div>
      )}
      {error && (
        <div className={`text-red-500 ${theme === "dark" ? "text-red-300" : "text-red-500"}`} role="alert">
          {error}
        </div>
      )}

      <div className="overflow-x-auto max-h-full scrollbar-hide">
        <table
          id="options-table"
          className={`w-full shadow-lg rounded-lg text-sm md:text-base border ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-300 bg-white text-gray-700"
            }`}
        >
          {/* Adjust top offset to prevent covering */}
          <thead
            className={`${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700"
              } font-semibold sticky top-[-1px] z-10`} // Adjust top value here to match header height
          >
            <tr className={`divide-x ${theme === "dark" ? "divide-gray-600" : "divide-gray-300"}`}>
              {ceHeaders.map((header, index) => (
                <th key={index} className="p-2" scope="col">
                  {header.label}
                  <br />
                  <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{header.subtitle}</small>
                </th>
              ))}
              {/* Strike Price Column */}
              <th className="p-2 bg-yellow-100 text-yellow-800 font-bold" scope="col">
                Strike Price
                <br />
                <small className="text-xs text-yellow-600">PCR</small>
              </th>
              {/* PE Headers */}
              {peHeaders.map((header, index) => (
                <th key={index + 5} className="p-2" scope="col">
                  {header.label}
                  <br />
                  <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{header.subtitle}</small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`pt-16 divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
            {itm.map((strike) => (
              <tr
                key={strike}
                className={`text-center transition-all duration-200 ease-in-out divide-x hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  } ${theme === "dark" ? "divide-gray-950" : "divide-gray-300"}`}
              >
                {renderStrikeRow(options[strike], strike, isHighlighting, data.options.data, handlePercentageClick, theme)}
              </tr>
            ))}

            {/* Spot Price Row */}
            <tr>
              <td colSpan={1}>
                <Line />
              </td>
              <td colSpan={2}>
                <Ticker />
              </td>
              <td colSpan={1}>
                <Line />
              </td>
              <td colSpan={3} className={`p-0.5`}>
                <LabelSight />
              </td>
              <td colSpan={1}>
                <Line />
              </td>
              <td colSpan={2} className={`p-0.5`}>
                <TickerChange />
              </td>
              <td colSpan={1}>
                <Line />
              </td>
            </tr>

            {otm.map((strike) => (
              <tr
                key={strike}
                className={`text-center transition-all duration-200 ease-in-out divide-x hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                  } ${theme === "dark" ? "divide-gray-950" : "divide-gray-300"}`}
              >
                {renderStrikeRow(options[strike], strike, isHighlighting, data.options.data, handlePercentageClick, theme)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupVisible && <Popup data={popupData} onClose={closePopup} />}
    </div>


  );
}

export default OptionsTable;
