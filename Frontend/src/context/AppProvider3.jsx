import React, { createContext, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveData, fetchExpiryDate, setExp_sid } from "./dataSlice";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const dispatch = useDispatch();

    // Redux state
    const user = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.theme.theme);
    const isReversed = useSelector((state) => state.theme.isReversed);
    const isHighlighting = useSelector((state) => state.theme.isHighlighting);
    const data = useSelector((state) => state.data.data);
    const exp = useSelector((state) => state.data.exp);
    const symbol = useSelector((state) => state.data.symbol);
    const expDate = useSelector((state) => state.data.expDate);
    const isOc = useSelector((state) => state.data.isOc);

    const intervalRef = useRef(null);

    // Fetch expiry dates on symbol change
    useEffect(() => {
        dispatch(fetchExpiryDate({ sid: symbol, exp }));
    }, [dispatch, symbol]);

    // Update expiry based on fetched data
    useEffect(() => {
        if (data?.fut?.data?.explist) {
            dispatch(setExp_sid(data.fut.data.explist[0] || 0));
        }
    }, [symbol]);

    // Fetch live data every 3 seconds
    const fetchData = useCallback(async () => {
        try {
            await dispatch(fetchLiveData({ sid: symbol, exp }));
        } catch (error) {
            console.error("Error fetching live data:", error);
        }
    }, [dispatch, symbol, exp]);

    useEffect(() => {
        if (isOc) {
            fetchData();
            intervalRef.current = setInterval(fetchData, 5000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isOc, exp, symbol, fetchData]);

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
