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
    <div className={`flex flex-col md:flex-row items-center justify-between transition  ease-in-out ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-0 md:p-2 rounded-lg`}>
      {data ? (
        <>
          <div className="flex flex-wrap justify-center md:justify-start w-full md:w-auto">
            {currentDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date, index)} // Handle button click
                className={`m-0.5 px-1.5 py-1 rounded-md transition duration-300 ease-in-out 
                  ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {date}
              </button>
            ))}
          </div>
          <div className="font-bold  md:mt-0">
            <TickerDropdown />
          </div>
          <div className="gap-3 flex flex-col md:flex-row items-center w-full md:w-auto mt-0 md:mt-0">
            <div className="flex items-center">
              <button
                onClick={handlePrevious}
                disabled={startIndex === 0}
                className={`p-1 rounded transition duration-300 ease-in-out 
                  ${theme === 'dark' ? 'bg-blue-600 text-white disabled:bg-gray-600' : 'bg-blue-500 text-white disabled:bg-gray-300'}`}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={endIndex >= formattedDates.length}
                className={`p-1 rounded transition duration-300 ease-in-out ml-2 
                  ${theme === 'dark' ? 'bg-blue-600 text-white disabled:bg-gray-600' : 'bg-blue-500 text-white disabled:bg-gray-300'}`}
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="mt-1 md:mt-0">
              <ToggleButton />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-dark rounded-lg shadow-md p-2 mb-0.5 text-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
