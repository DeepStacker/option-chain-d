import React, { useState, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons
import { AppContext } from "../context/AppProvider";
import {ToggleButton, TickerDropdown, Spinner} from './Index'

export default function DateList() {
  const {
    setIsHighlighting,
    setIsReversed,
    isHighlighting,
    isReversed,
    data,
    setExp,
    expDate,
  } = useContext(AppContext);
  

  const formatTimestamps = (timestamps) => {
    return timestamps.map((timestamp) => {
      const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
      const day = date.getUTCDate().toString().padStart(2, '0'); // Ensure two-digit day
      const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }); // Specify timezone explicitly
      return `${day} ${month}`;
    });
  };
  

  const formattedDates = data ? formatTimestamps(data.fut.data.explist) : [];
  const dates = data ? (data.fut.data.explist) : [];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDates = formattedDates.slice(startIndex, endIndex);
  // const [i, setI] = useState(0)


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
    // console.log("Selected date:", date); // Replace with your logic to send payload
    if (startIndex >= 8) {
      setExp(dates[startIndex + index] || 0)
      // console.log(dates[startIndex + index], date)
    } else {
      setExp(dates[index] || 0)
      // console.log(dates[index], date)
    }
  };

  return (
    <div className="flex items-center justify-between">
      {data ? (
        <>
          <div className="flex flex-wrap">
            {currentDates.map((date, index) => (
              // console.log(date, index),

              <button
                key={index}
                onClick={() => handleDateSelect(date, index)} // Handle button click
                className="m-1 px-2 py-0 bg-blue-500 text-white rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
              >
                {date}
              </button>
            ))}
          </div>
          <div className="font-bold">
            <TickerDropdown />
          </div>
          <div className="gap-3 flex ">
            <div className="flex items-center ml-4">
              <button
                onClick={handlePrevious}
                disabled={startIndex === 0}
                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                disabled={endIndex >= formattedDates.length}
                className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300 ml-2"
              >
                <FaChevronRight />
              </button>
            </div>
            <div>
              <ToggleButton
                setIsReversed={setIsReversed}
                setIsHighlighting={setIsHighlighting}
                isHighlighting={isHighlighting}
                isReversed={isReversed}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-2 mb-0.5 text-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
