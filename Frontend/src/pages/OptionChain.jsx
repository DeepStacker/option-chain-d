import React, { useEffect } from "react";
import { FaChartLine } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import SpotData from "../components/SpotData";
import OptionsTable from "../components/OptionsTable";
import DateList from "../components/DateList";
import Spinner from "../components/Spinner";
import { fetchLiveData, fetchExpiryDate, setIsOc } from "../context/dataSlice";

function OptionChain() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  const exp_sid = useSelector((state) => state.data.exp_sid);  
  const sid = useSelector((state) => state.data.sid);  
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.data.isLoading);

  // Set isOc flag when component mounts and clear it when unmounts
  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  // Fetch initial data and establish WebSocket connection
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {  
        try {
          // Fetch expiry dates first
          await dispatch(fetchExpiryDate({ sid })).unwrap();
          
          // Then fetch live data and establish WebSocket connection
          await dispatch(fetchLiveData({ sid, exp_sid })).unwrap();
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
    };

    loadData();
  }, [dispatch, sid, exp_sid, isAuthenticated]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div className="w-full max-w-full px-2 py-1">
        {!isAuthenticated ? (
          <div
            className={`rounded-lg shadow-md p-6 mb-0.5 text-center transition-all ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"}`}
          >
            <p className="text-lg">Please log in to view option chain data</p>
          </div>
        ) : isLoading ? (
          <div
            className={`rounded-lg shadow-md p-6 mb-0.5 text-center transition-all ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"}`}
            role="status"
            aria-live="polite"
          >
            <Spinner />
            <p className="mt-4 text-lg">Loading data, please wait...</p>
          </div>
        ) : data ? (
          <>
            <div
              className={` mb-1 shadow-lg rounded-lg relative transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
              <DateList />
            </div>

            <div
              className={`flex flex-col mb-10 bg-white shadow-lg  rounded-lg overflow-hidden transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
              <OptionsTable />
            </div>

            <div
              className={`p-1  shadow-lg rounded-lg transition-all ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
              <h2 className="font-semibold flex items-center">
                <FaChartLine className="mr-2 text-blue-600" size={16} />
                Spot Data
              </h2>
              <SpotData />
            </div>
          </>
        ) : (
          <div
            className={`rounded-lg shadow-md p-6 mb-0.5 text-center transition-all ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-white text-gray-800"}`}
            role="status"
            aria-live="polite"
          >
            <Spinner />
            <p className="mt-4 text-lg">No data available...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OptionChain;
