
import { createSlice } from '@reduxjs/toolkit';

export const optionChainSlice = createSlice({
    name: 'optionChain',
    initialState: {
        popupData: null,
        strike: null,
        isPopupVisible: false,
        isDeltaPopupVisible: false,
        isFuturePricePopupVisible: false,
        isReversalPopupVisible: false,
        isIVPopupVisible: false,
        loading: false,
        fetchError: null,
    },
    reducers: {
        setPopupData: (state, action) => {
            state.popupData = action.payload;
        },
        setStrike: (state, action) => {
            state.strike = action.payload;
        },
        togglePopup: (state) => {
            state.isPopupVisible = !state.isPopupVisible;
        },
        toggleDeltaPopup: (state) => {
            state.isDeltaPopupVisible = !state.isDeltaPopupVisible;
        },
        toggleFuturePricePopup: (state) => {
            state.isFuturePricePopupVisible = !state.isFuturePricePopupVisible;
        },
        toggleReversalPopup: (state) => {
            state.isReversalPopupVisible = !state.isReversalPopupVisible;
        },
        toggleIVPopup: (state) => {
            state.isIVPopupVisible = !state.isIVPopupVisible;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFetchError: (state, action) => {
            state.fetchError = action.payload;
        },
    },
});

// Export actions for use in components
export const {
    setPopupData,
    setStrike,
    togglePopup,
    toggleDeltaPopup,
    toggleFuturePricePopup,
    toggleReversalPopup,
    toggleIVPopup,
    setLoading,
    setFetchError,
} = optionChainSlice.actions;

// Export the reducer to include in the Redux store
export default optionChainSlice.reducer;
