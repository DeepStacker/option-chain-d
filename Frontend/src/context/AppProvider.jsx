import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AppContext = createContext(); // Create context

export const AppProvider = ({ children }) => {
  // Global state
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isReversed, setIsReversed] = useState(true);
  const [isHighlighting, setIsHighlighting] = useState(true);
  const [data, setData] = useState(null);
  const [expDate, setExpDate] = useState(null);
  const [exp, setExp] = useState(1414780200);
  const [symbol, setSymbol] = useState('NIFTY');
  const [isOc, setIsOc] = useState(true);

  const intervalRef = useRef(null);

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const fetchLiveData = async (params) => {
    try {
      const response = await axios.get('http://192.168.29.33:8000/api/live-data', { params });
      setData(response.data);
      // console.log(response.data.options.data.oc)

      const date = response.data?.fut?.data?.explist;
      if (Array.isArray(date) && date.length > 0) {
      } else {
        console.warn("The 'explist' is not an array or is empty.");
      }
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };

  const fetchExpiryDate = async (params) => {
    try {
      const response = await axios.get('http://192.168.29.33:8000/api/exp-date', { params });
      setExpDate(response.data?.fut?.data?.explist);
      const date = response.data?.fut?.data?.explist;
      if (Array.isArray(date) && date.length > 0) {
        setExp(date[0]);
        setExpDate(date);
      } else {
        console.warn("The 'explist' is not an array or is empty.");
      }
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };

  useEffect(() => {
    const fetchExpiryOnSymbolChange = async () => {
      if (!isOc) return;
      try {
        await fetchExpiryDate({ sid: symbol, exp: exp });
      } catch (error) {
        console.error("Error fetching expiry date:", error);
      }
    };

    fetchExpiryOnSymbolChange();
  }, [symbol, isOc]);

  useEffect(() => {
    const fetchLiveDataWithParams = async () => {
      if (!isOc) return;
      try {
        await fetchLiveData({ sid: symbol, exp: exp });
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    };

    fetchLiveDataWithParams();
    intervalRef.current = setInterval(fetchLiveDataWithParams, 10000);

    return () => clearInterval(intervalRef.current);
  }, [exp, isOc, setExpDate, expDate]);


  // Provide state and functions to child components
  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        theme,
        toggleTheme,
        isReversed,
        setIsReversed,
        isHighlighting,
        setIsHighlighting,
        data,
        exp,
        setExp,
        symbol,
        setSymbol,
        expDate,
        isOc,
        setIsOc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
