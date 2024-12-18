import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToggleButton, TickerDropdown, Spinner } from "./Index";
import { useDispatch, useSelector } from "react-redux";
import { setExp } from "../context/dataSlice";

export default function DateList() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);

  // Data state
  const data = useSelector((state) => state.data.data);
  const dates = data?.fut?.data?.explist || [];

  const formatTimestamps = (timestamps) => {
    return timestamps.map((timestamp) => {
      const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
      const day = date.getUTCDate().toString().padStart(2, "0"); // Ensure two-digit day
      const month = date.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
      }); // Specify timezone explicitly
      return `${day} ${month}`;
    });
  };

  const formattedDates = data?.fut?.data?.explist
    ? formatTimestamps(data.fut.data.explist)
    : [];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDates = formattedDates.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < formattedDates.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle date selection
  const handleDateSelect = (date, index) => {
    dispatch(setExp(dates[startIndex + index] || 0));
  };

  // Function to handle dropdown selection
  const handleDateDropdownSelect = (event) => {
    const selectedDate = event.target.value;
    dispatch(setExp(selectedDate));
  };

  return (
    <div
      className={`p-1 z-20 shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        } flex flex-col md:flex-row items-center justify-between md:space-x-4 space-y-1 md:space-y-0`}
    >
      {data ? (
        <>
          {/* Date Buttons for larger screens (visible only on md and above) */}
          <div className="hidden md:flex flex-wrap justify-center md:justify-start w-full md:w-auto space-x-2 items-center md:block  ">
            {currentDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date, index)} // Handle button click
                className={`m-1 px-3 py-1 rounded-md transition cursor-pointer ease-in-out 
        ${theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                {date}
              </button>
            ))}

            {/* Pagination for larger screens, now inside the same flex container */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={startIndex === 0}
                className={`p-2 rounded-full transition ease-in-out ${theme === "dark"
                  ? "bg-blue-600 text-white disabled:bg-gray-600"
                  : "bg-blue-500 text-white disabled:bg-gray-300"
                  }`}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={endIndex >= formattedDates.length}
                className={`p-2 rounded-full transition ease-in-out ${theme === "dark"
                  ? "bg-blue-600 text-white disabled:bg-gray-600"
                  : "bg-blue-500 text-white disabled:bg-gray-300"
                  }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Date Dropdown for smaller screens (visible only on below md) */}
          <div className="w-full md:hidden">
            <select
              value={dates[0] || ''}
              onChange={handleDateDropdownSelect}
              className={`w-full p-2  rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"} focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 `}
            >
              {formattedDates.map((date, index) => (
                <option
                  className="cursor-pointer focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                  key={index}
                  value={dates[index]}
                >
                  {date}
                </option>
              ))}
            </select>
          </div>

          {/* Ticker Dropdown */}
          <div className="w-40 mt-4">
            <TickerDropdown />
          </div>

          {/* Pagination and Toggle */}
          <div className="flex flex-col items-center space-x-4 mt-4 md:mt-0 sm:flex sm:items-center justify-between w-full md:w-auto">
            <ToggleButton />
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
