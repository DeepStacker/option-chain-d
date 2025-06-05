import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";
import { decode } from "@msgpack/msgpack";

axios.defaults.withCredentials = true;

let socket = null;

// Helpers
const getAuthToken = () => localStorage.getItem("authToken");

const handleApiError = (error) => {
  if (error.response) return error.response.data?.message || "Server error";
  if (error.request) return "No response from server";
  return error.message || "An error occurred";
};

const createSocketConnection = (socketURL) => {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token available for socket connection");
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    socket = io(socketURL, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.warn("Socket disconnected"));
    socket.on("connect_error", (err) => console.error("Connect error:", err));
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  }

  return socket;
};

// Thunks
export const fetchLiveData = createAsyncThunk(
  "data/fetchLiveData",
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const state = getState();
      const API_BASE_URL = state.config.baseURL;
      const SOCKET_URL = state.config.socketURL;
      const currentParams = {
        sid: params.sid || state.data.sid,
        exp_sid: params.exp_sid || state.data.exp_sid,
      };

      const response = await axios.get(`${API_BASE_URL}/live-data/`, {
        params: currentParams,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const socketInstance = createSocketConnection(SOCKET_URL);
      if (!socketInstance) {
        console.error("Socket connection failed");
        return rejectWithValue("Socket connection failed");
      }

      if (!socketInstance.connected) {
        try {
          await new Promise((resolve) => {
            const waitForConnect = () => {
              if (socketInstance.connected) resolve();
              else setTimeout(waitForConnect, 100);
            };
            waitForConnect();
          });
        } catch (error) {
          console.error("Failed to connect socket:", error);
          return rejectWithValue("Failed to connect socket");
        }
      }

      socketInstance.emit("stop_stream");
      socketInstance.off("live_data");
      socketInstance.emit("start_stream", currentParams);

      socketInstance.on("live_data", (binaryBuffer) => {
        try {
          const arrayBuffer = new Uint8Array(binaryBuffer);
          const decoded = decode(arrayBuffer);
          dispatch(updateLiveData(decoded));
          // console.log("Received binary data", binaryBuffer);
        } catch (e) {
          console.error("Error decoding:", e);
        }
      });

      socketInstance.once("stream_started", () => {
        dispatch(setStreamingState(true));
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const fetchExpiryDate = createAsyncThunk(
  "data/fetchExpiryDate",
  async (params, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const state = getState();
      const API_BASE_URL = state.config.baseURL;

      const response = await axios.get(`${API_BASE_URL}/exp-date/`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const startLiveStream = createAsyncThunk(
  "data/startLiveStream",
  async ({ sid, exp_sid }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const state = getState();
      const SOCKET_URL = state.config.socketURL;

      if (!socket) socket = createSocketConnection(SOCKET_URL);
      if (!socket) throw new Error("Failed to create socket connection");

      if (!socket.connected) socket.connect();

      socket.emit("stop_stream");
      socket.emit("start_stream", { sid, exp_sid });

      return { sid, exp_sid };
    } catch (error) {
      console.error("Start live stream error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const setSidAndFetchData = createAsyncThunk(
  "data/setSidAndFetchData",
  async (newSid, { dispatch }) => {
    try {
      dispatch(setSid(newSid));
      const res = await dispatch(fetchExpiryDate({ sid: newSid }));

      if (res.payload?.length > 0) {
        const firstExpiry = res.payload[0];
        dispatch(setExp_sid(firstExpiry));
        dispatch(fetchLiveData({ sid: newSid, exp_sid: firstExpiry }));
      }
    } catch (err) {
      console.error("Set SID error:", err);
    }
  }
);

// Slice
export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    expDate: [],
    exp_sid: 1419013800,
    sid: "NIFTY",
    isOc: true,
    error: null,
    isStreaming: false,
    loading: false,
    popupData: null,
  },
  reducers: {
    setExp_sid: (state, action) => {
      state.exp_sid = action.payload;
      if (socket?.connected && state.isOc) {
        socket.emit("stop_stream");
        socket.emit("start_stream", {
          sid: state.sid,
          exp_sid: action.payload,
        });
      }
    },
    setSid: (state, action) => {
      state.sid = action.payload;
      if (socket?.connected && state.isOc) {
        socket.emit("stop_stream");
        socket.emit("start_stream", {
          sid: action.payload,
          exp_sid: state.exp_sid,
        });
      }
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      state.data = action.payload;
    },
    setStreamingState: (state, action) => {
      state.isStreaming = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    setPopupData: (state, action) => {
      state.popupData = action.payload;
    },
    clearData: (state) => {
      state.data = null;
      state.exp_sid = null;
      state.sid = null;
      state.error = null;
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
        state.error = action.payload || "Failed to fetch live data";
        state.loading = false;
      })
      .addCase(fetchExpiryDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiryDate.fulfilled, (state, action) => {
        const expiryDates = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.expiry_dates || [];
        state.expDate = expiryDates;
        state.exp_sid = expiryDates[0] ?? state.exp_sid;
        state.loading = false;
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch expiry dates";
        state.loading = false;
      })
      .addCase(startLiveStream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLiveStream.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startLiveStream.rejected, (state, action) => {
        state.error = action.payload || "Failed to start stream";
        state.loading = false;
      });
  },
});

// Actions and Stop Stream
export const {
  setExp_sid,
  setSid,
  setIsOc,
  updateLiveData,
  setStreamingState,
  resetError,
  setPopupData,
  clearData,
} = dataSlice.actions;

export const stopLiveStream = () => (dispatch) => {
  if (socket) {
    socket.emit("stop_stream");
    socket.off("live_data");
    socket.disconnect();
    socket = null;
    dispatch(setStreamingState(false));
  }
};

export default dataSlice.reducer;
