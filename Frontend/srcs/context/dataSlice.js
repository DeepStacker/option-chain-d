// slices/dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

let socket = null;
let reconnectTimer = null;

const WEBSOCKET_URL = 'https://option-chain-d.onrender.com';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 5000;

const initSocket = () => {
  if (socket) return socket;

  socket = io(WEBSOCKET_URL, {
    transports: ['polling', 'websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: INITIAL_RECONNECT_DELAY,
    reconnectionDelayMax: MAX_RECONNECT_DELAY,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    timeout: 20000,
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Credentials": "true"
    },
    path: '/socket.io/',
    forceNew: true,
    upgrade: true
  });

  return socket;
};

// Async action to fetch expiry dates
export const fetchExpiryDate = createAsyncThunk(
  'data/fetchExpiryDate',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${WEBSOCKET_URL}/api/exp-date/`, {
        params,
        withCredentials: true
      });
      return response.data?.fut?.data?.explist || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async action to initialize WebSocket
export const initializeWebSocketConnection = createAsyncThunk(
  'data/initializeWebSocket',
  async (_, { dispatch, getState }) => {
    if (socket?.connected) return;

    const socket = initSocket();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.off('connect');
        socket.off('connect_error');
        reject(new Error('WebSocket connection timeout'));
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        const state = getState().data;
        socket.emit('subscribe_live_data', {
          sid: state.symbol,
          exp: state.exp
        });
        resolve();
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      socket.on('disconnect', (reason) => {
        dispatch(setConnectionStatus(false));
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, reconnect manually
          socket.connect();
        }
      });

      socket.on('live_data_update', (data) => {
        dispatch(updateLiveData(data));
      });

      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        dispatch(setError(error.message));
      });

      socket.connect();
    });
  }
);

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {},
    expDate: [],
    exp: 1416594600,
    symbol: 'NIFTY',
    isOc: true,
    error: null,
    isConnected: false,
    reconnectAttempts: 0,
  },
  reducers: {
    setExp: (state, action) => {
      state.exp = action.payload;
      if (socket?.connected) {
        socket.emit('subscribe_live_data', {
          sid: state.symbol,
          exp: action.payload
        });
      }
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
      if (socket?.connected) {
        socket.emit('subscribe_live_data', {
          sid: action.payload,
          exp: state.exp
        });
      }
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.reconnectAttempts = 0;
        state.error = null;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    disconnectWebSocket: (state) => {
      if (socket) {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        state.isConnected = false;
        state.reconnectAttempts = 0;
        state.error = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpiryDate.fulfilled, (state, action) => {
        state.expDate = action.payload;
        state.exp = action.payload?.[0] ?? state.exp;
        state.error = null;
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch expiry dates';
      })
      .addCase(initializeWebSocketConnection.fulfilled, (state) => {
        state.isConnected = true;
        state.error = null;
        state.reconnectAttempts = 0;
      })
      .addCase(initializeWebSocketConnection.rejected, (state, action) => {
        state.error = action.error.message;
        state.isConnected = false;
      });
  },
});

export const {
  setExp,
  setSymbol,
  setIsOc,
  updateLiveData,
  setConnectionStatus,
  setError,
  disconnectWebSocket
} = dataSlice.actions;

export default dataSlice.reducer;
