import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

let socket = null; // Global variable for WebSocket connection

// API configuration
const API_BASE_URL = 'https://option-chain-d.onrender.com/api';
const SOCKET_URL = 'https://option-chain-d-new-app.onrender.com';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error Response:', error.response);
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    console.error('API No Response:', error.request);
    return 'No response from server';
  } else {
    console.error('API Error:', error);
    return error.message || 'An error occurred';
  }
};

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to create socket connection with auth
const createSocketConnection = () => {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token available for socket connection');
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token
      },
      withCredentials: true,
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

// Async action to fetch live data using HTTP
export const fetchLiveData = createAsyncThunk(
  'data/fetchLiveData',
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      // Get current state to ensure we use latest values
      const state = getState();
      const currentParams = {
        sid: params.sid || state.data.sid,
        exp_sid: params.exp_sid || state.data.exp_sid
      };

      // First, get the initial data via HTTP
      const response = await axios.get(`${API_BASE_URL}/live-data/`, {
        params: currentParams,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Then establish WebSocket connection for live updates
      const socketInstance = createSocketConnection();
      if (socketInstance) {
        // Wait for connection to be established
        if (!socketInstance.connected) {
          await new Promise((resolve) => {
            const checkConnection = () => {
              if (socketInstance.connected) {
                resolve();
              } else {
                setTimeout(checkConnection, 100);
              }
            };
            checkConnection();
          });
        }

        // Stop any existing stream before starting a new one
        socketInstance.emit('stop_stream');

        // Start streaming with latest parameters
        socketInstance.emit('start_stream', currentParams);

        // Listen for live data updates
        socketInstance.on('live_data', (data) => {
          dispatch(updateLiveData(data));
        });

        // Listen for stream start confirmation
        socketInstance.on('stream_started', (data) => {
          dispatch(setStreamingState(true));
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to fetch expiry dates
export const fetchExpiryDate = createAsyncThunk(
  'data/fetchExpiryDate',
  async (params, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const response = await axios.get(`${API_BASE_URL}/exp-date/`, {
        params: {
          sid: params.sid,  // Use sid consistently
          exp_sid: params.exp_sid  // Rename exp to exp_sid
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to start live stream
export const startLiveStream = createAsyncThunk(
  'data/startLiveStream',
  async ({ sid, exp_sid }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      if (!socket) {
        socket = createSocketConnection();
        if (!socket) {
          throw new Error('Failed to create socket connection');
        }
      }

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit('start_stream', { sid, exp_sid });
      return { sid, exp_sid };
    } catch (error) {
      console.error('Error starting live stream:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async action to set symbol and fetch data
export const setSidAndFetchData = createAsyncThunk(
  'data/setSidAndFetchData',
  async (newSid, { dispatch, getState }) => {
    try {
      // First, update the symbol
      dispatch(setSid(newSid));

      // Then fetch expiry dates for the new symbol
      const response = await dispatch(fetchExpiryDate({ sid: newSid }));

      // If we got expiry dates successfully, set the first one
      if (response.payload && response.payload.length > 0) {
        const firstExpiry = response.payload[0];
        dispatch(setExp_sid(firstExpiry));

        // Finally, fetch live data with new symbol and first expiry
        dispatch(fetchLiveData({ sid: newSid, exp_sid: firstExpiry }));
      }
    } catch (error) {
      console.error('Error updating symbol and fetching data:', error);
    }
  }
);

// Redux Slice for Data Management
export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {}, // Live data
    expDate: [], // Expiry dates
    exp_sid: 1419013800, // Default expiry timestamp
    sid: 'NIFTY', // Default symbol
    isOc: true, // Open chain toggle
    error: null, // Error state
    isStreaming: false, // WebSocket streaming state
    loading: false, // Loading state for async actions
  },
  reducers: {
    setExp_sid: (state, action) => {
      state.exp_sid = action.payload;
      // When expiry changes, update the WebSocket connection with new parameters
      if (socket?.connected && state.isOc) {
        socket.emit('stop_stream');
        socket.emit('start_stream', {
          sid: state.sid,
          exp_sid: action.payload
        });
      }
    },
    setSid: (state, action) => {
      state.sid = action.payload;
      // When symbol changes, update the WebSocket connection with new parameters
      if (socket?.connected && state.isOc) {
        socket.emit('stop_stream');
        socket.emit('start_stream', {
          sid: action.payload,
          exp_sid: state.exp_sid
        });
      }
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      state.data = action.payload; // Update live data from WebSocket
    },

    setStreamingState: (state, action) => {
      state.isStreaming = action.payload; // Update WebSocket streaming state
    },
    resetError: (state) => {
      state.error = null; // Reset error state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveData.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch live data';
        state.loading = false;
      })
      .addCase(fetchExpiryDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiryDate.fulfilled, (state, action) => {
        // Ensure we have an array of expiry dates
        const expiryDates = Array.isArray(action.payload) ? action.payload :
          (action.payload?.expiry_dates || []);
        state.expDate = expiryDates;
        state.exp_sid = expiryDates[0] ?? state.exp_sid; // Default to first expiry date
        state.loading = false;
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch expiry dates';
        state.loading = false;
      })
      .addCase(startLiveStream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLiveStream.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(startLiveStream.rejected, (state, action) => {
        state.error = action.payload || 'Failed to start live stream';
        state.loading = false;
      });
  },
});

export const { setExp_sid, setSid, setIsOc, updateLiveData, setStreamingState, resetError } =
  dataSlice.actions;

// Stop WebSocket connection
export const stopLiveStream = () => (dispatch) => {
  if (socket) {
    socket.emit('stop_stream');
    socket.disconnect();
    socket = null;
    dispatch(setStreamingState(false));
  }
};

export default dataSlice.reducer;
