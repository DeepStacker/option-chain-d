// slices/dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch live data
export const fetchLiveData = createAsyncThunk(
  'data/fetchLiveData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://option-chain-d.onrender.com/api/live-data', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async action to fetch expiry dates
export const fetchExpiryDate = createAsyncThunk(
  'data/fetchExpiryDate',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://option-chain-d.onrender.com/api/exp-date', { params });
      return response.data?.fut?.data?.explist || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {},
    expDate: [],
    exp: 1415989800,
    symbol: 'NIFTY',
    isOc: true,
    error: null,
  },
  reducers: {
    setExp: (state, action) => {
      state.exp = action.payload;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchExpiryDate.fulfilled, (state, action) => {
        state.expDate = action.payload;
        state.exp = action.payload?.[0] ?? state.exp;
        state.error = null;
      })
      .addCase(fetchLiveData.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch live data';
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch expiry dates';
      });
  },
});

export const { setExp, setSymbol, setIsOc } = dataSlice.actions;
export default dataSlice.reducer;
