// OptionsTable.js

import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AppContext } from "../context/AppProvider";
import Popup from "./ChartPopup";
import axios from "axios";
import { findStrikes, renderStrikeRow } from "../utils/optionChainTable/OptionTableUtils";

function OptionsTable() {
  const { data, isReversed, isHighlighting, setIsOc, symbol, exp } = useContext(AppContext);

  // State hooks
  const [popupData, setPopupData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set the `isOc` state when the component mounts and clean up on unmount
  useEffect(() => {
    setIsOc(true);
    return () => setIsOc(false);
  }, [setIsOc]);

  // Fetch data from the API
  const fetchData = useCallback(async (params) => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios.post("http://192.168.29.33:8000/api/percentage-data", params);
      if (response.data) {
        // console.log("API Response:", response.data);
        setPopupData(response.data);
        setIsPopupVisible(true);
      } else {
        setError("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Safely access option data with optional chaining
  const options = data?.options?.data?.oc || {};
  const optionChain = data?.options?.data || {};
  const atmPrice = data?.spot?.data?.Ltp ? Math.round(data.spot.data.Ltp) : null;

  // Memoize strike calculations for performance optimization
  const { nearestStrike, otmStrikes, itmStrikes } = useMemo(() => {
    return findStrikes(options, atmPrice);
  }, [options, atmPrice]);

  // Create a list of active strikes, reversing them if required
  const activeStrikes = useMemo(() => {
    const strikes = [...itmStrikes, ...otmStrikes];
    return isReversed ? strikes.reverse() : strikes;
  }, [itmStrikes, otmStrikes, isReversed]);

  // Handle click on percentage to fetch data
  const handlePercentageClick = (isCe, strike) => {
    fetchData({ strike, exp, isCe, sid: symbol });
  };

  // Close the popup and reset its data
  const closePopup = () => {
    setPopupData(null);
    setIsPopupVisible(false);
  };

  // Early return if data is unavailable
  if (!data?.options?.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="h-[100vh] overflow-y-auto">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <table
        id="options-table"
        className="w-full bg-white shadow-lg rounded-lg text-sm md:text-base border border-gray-300 text-center table-fixed"
      >
        <thead className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700 font-semibold sticky top-0 z-10">
          <tr className="divide-x divide-gray-300">
            {["IV", "OI CHANGE", "OI", "VOLUME", "LTP"].map((header, index) => (
              <th key={index} className="p-2">
                {header}
                <br />
                <small className="text-xs text-gray-500">{index === 0 ? "Delta" : "Ltp_chng"}</small>
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
                <small className="text-xs text-gray-500">{index === 0 ? "Ltp_chng" : "Delta"}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activeStrikes.map((strike) => (
            <tr
              key={strike}
              className="hover:bg-gray-100 transition-all duration-200 ease-in-out divide-x divide-gray-300"
            >
              {renderStrikeRow(
                options[strike],
                strike,
                isHighlighting,
                optionChain,
                handlePercentageClick
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
