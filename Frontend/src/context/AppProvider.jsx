import React, { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveData, fetchExpiryDate } from "../context/dataSlice"; // Import data actions

export const AppContext = createContext(); // Create context

export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();

  // User state from Redux
  const user = useSelector((state) => state.user.user);

  // Theme state from Redux
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);

  // Data state from Redux
  const data = useSelector((state) => state.data.data);
  const exp = useSelector((state) => state.data.exp);
  const symbol = useSelector((state) => state.data.symbol);
  const expDate = useSelector((state) => state.data.expDate);
  const isOc = useSelector((state) => state.data.isOc);

  const intervalRef = useRef(null);

  // Fetch expiry dates on symbol change
  useEffect(() => {
    dispatch(fetchExpiryDate({ sid: symbol }));
  }, [dispatch, symbol]);

  // Fetch live data every 3 seconds when `isOc` is true
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLiveData({ sid: symbol, exp }));
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    };

    if (isOc) {
      fetchData(); // Initial fetch
      intervalRef.current = setInterval(fetchData, 3000);
    }

    // Clear interval on cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [exp, isOc, symbol, dispatch]);

  // Provide state and functions to child components
  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        isReversed,
        isHighlighting,
        data,
        exp,
        symbol,
        expDate,
        isOc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
