// src/components/OptionsTable.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Popup from "./ChartPopup";
import axios from "axios";
import { findStrikes, renderStrikeRow } from "../utils/optionChainTable/OptionTableUtils";
import { useDispatch, useSelector } from "react-redux";
import { setIsOc } from "../context/dataSlice"; // Import data actions

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

  // Set `isOc` state on mount and clean up on unmount
  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  // Fetch data from the API
  const fetchData = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await axios.post("http://192.168.29.33:8000/api/percentage-data", params);
      if (response.data) {
        setPopupData(response.data);
        setIsPopupVisible(true);
      } else {
        throw new Error("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Option data and ATM price
  const options = data?.options?.data?.oc || {};
  const atmPrice = data?.spot?.data?.Ltp ? Math.round(data.spot.data.Ltp) : null;

  // Memoize strike calculations for performance
  const { nearestStrike, otmStrikes, itmStrikes } = useMemo(() => {
    return findStrikes(options, atmPrice);
  }, [options, atmPrice]);

  // Create active strikes list and reverse if needed
  const activeStrikes = useMemo(() => {
    const strikes = [...itmStrikes, ...otmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [itmStrikes, otmStrikes, isReversed]);

  // Handle click on percentage to fetch data
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
    return <div>No data available</div>;
  }

  return (
    <div className={`h-[100vh] overflow-y-auto ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      {loading && <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Loading...</div>}
      {error && <div className={`text-red-500 ${theme === "dark" ? "text-red-300" : "text-red-500"}`}>{error}</div>}

      <table
        id="options-table"
        className={`w-full shadow-lg rounded-lg text-sm md:text-base border ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-300 bg-white text-gray-700"}`}
      >
        <thead className={`${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700"} font-semibold sticky top-0 z-10`}>
          <tr className={`divide-x ${theme === "dark" ? "divide-gray-600" : "divide-gray-300"}`}>
            {["IV", "OI CHANGE", "OI", "VOLUME", "LTP"].map((header, index) => (
              <th key={index} className="p-2">
                {header}
                <br />
                <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{index === 0 ? "Delta" : "Ltp_chng"}</small>
              </th>
            ))}
            <th className="p-2 bg-yellow-100 text-yellow-800 font-bold">
              Strike Price
              <br />
              <small className="text-xs text-yellow-600">PCR</small>
            </th>
            {["LTP", "VOLUME", "OI", "OI CHANGE", "IV"].map((header, index) => (
              <th key={index + 5} className="p-2">
                {header}
                <br />
                <small className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{index === 0 ? "Ltp_chng" : "Delta"}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
          {activeStrikes.map((strike) => (
            <tr
              key={strike}
              className={`hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} text-center transition-all duration-200 ease-in-out divide-x ${theme === "dark" ? "divide-gray-600" : "divide-gray-300"}`}
            >
              {renderStrikeRow(
                options[strike],
                strike,
                isHighlighting,
                data.options.data,
                handlePercentageClick,
                theme
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupVisible && <Popup data={popupData} onClose={closePopup} />}
    </div>
  );
}

export default OptionsTable;
