import React, { useState } from "react";
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
  const dates = data?.fut?.data?.explist || [];

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

  return (
    <div className={`fixed top-11 left-0 right-0 p-3 z-20 shadow-md 
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} 
      flex flex-wrap items-center justify-between`}>
      {data ? (
        <>
          <div className="flex flex-wrap justify-center md:justify-start w-full md:w-auto space-x-1">
            {currentDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date, index)} // Handle button click
                className={`m-1 px-2 py-1 rounded-md transition  ease-in-out 
                  ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {date}
              </button>
            ))}
          </div>
          <TickerDropdown />
          <div className="md:ml-3 flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevious}
                disabled={startIndex === 0}
                className={`p-2 rounded-full transition ease-in-out 
                  ${theme === 'dark' ? 'bg-blue-600 text-white disabled:bg-gray-600' : 'bg-blue-500 text-white disabled:bg-gray-300'}`}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={endIndex >= formattedDates.length}
                className={`p-2 rounded-full transition ease-in-out 
                  ${theme === 'dark' ? 'bg-blue-600 text-white disabled:bg-gray-600' : 'bg-blue-500 text-white disabled:bg-gray-300'}`}
              >
                <FaChevronRight />
              </button>
            </div>
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
