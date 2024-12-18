import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { object } from 'prop-types';
import { io } from 'socket.io-client';

let socket = null; // Global variable for WebSocket connection

const API_BASE_URL = 'http://127.0.0.1:10000/api'; // Regular API requests go to app.py
const SOCKET_URL = 'http://127.0.0.1:5000'; // WebSocket connections go to new_app.py

// Helper function to handle API errors
const handleApiError = (error) => {
  return error.response?.data?.message || error.message || 'An unexpected error occurred';
};

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to create socket connection with auth
const createSocketConnection = () => {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token available for socket connection');
    return null;
  }

  if (socket?.connected) {
    // console.log('Reusing existing socket connection');
    return socket;
  }

  // Close existing socket if it exists but isn't connected
  if (socket) {
    socket.close();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: `Bearer ${token}`
    },
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    withCredentials: true,
    timeout: 10000
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
  });

  socket.on('connection_established', (data) => {
    console.log('Connection established with sid:', data.sid);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Try to reconnect after connection error
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, 1000);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect' || reason === 'transport close') {
      // Server disconnected us, try to reconnect
      setTimeout(() => {
        if (!socket.connected) {
          socket.connect();
        }
      }, 1000);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Connect the socket
  socket.connect();

  return socket;
};

// Async action to fetch live data using HTTP
export const fetchLiveData = createAsyncThunk(
  'data/fetchLiveData',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      // First, get the initial data via HTTP
      const response = await axios.get(`${API_BASE_URL}/live-data/`, {
        params: {
          sid: params.sid,  // Use sid consistently
          exp_sid: params.exp_sid  // Rename exp to exp_sid
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
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

        // Start streaming with sid and exp_sid
        socketInstance.emit('start_stream', {
          sid: params.sid,
          exp_sid: params.exp_sid
        });

        // Listen for live data updates
        socketInstance.on('live_data', (data) => {
          dispatch(updateLiveData(data));
        });

        // Listen for stream start confirmation
        socketInstance.on('stream_started', (data) => {
          // console.log('Stream started:', data);
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
    },
    setSid: (state, action) => {
      state.sid = action.payload;
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      state.data = action.payload; // Update live data from WebSocket
      // console.log(Object.keys(action.payload.options.data.oc)); // Correct capitalization of Object.keys
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
        // Extract expiry dates from the fut.data.explist array
        const expiryDates = action.payload?.fut?.data?.explist || [];
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
