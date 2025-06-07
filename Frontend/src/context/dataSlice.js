import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";
import { decode } from "@msgpack/msgpack";

axios.defaults.withCredentials = true;

let socket = null;
const activeRequests = new Map();

// Helpers
const getAuthToken = () => localStorage.getItem("authToken");

const handleApiError = (error) => {
  if (error.response) return error.response.data?.message || "Server error";
  if (error.request) return "No response from server";
  return error.message || "An error occurred";
};

const createSocketConnection = (socketURL) => {
  const token = getAuthToken();
  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(socketURL, {
    auth: { token },
    transports: ["websocket"],
    withCredentials: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 5000,
  });

  socket.on("connect", () => {});
  socket.on("disconnect", (reason) => {});
  socket.on("connect_error", (err) => {});
  socket.on("error", (err) => {});

  return socket;
};

const getLatestExpiry = (expiryArray) => {
  if (!Array.isArray(expiryArray) || expiryArray.length === 0) return null;

  return Math.min(
    ...expiryArray.map((exp) => {
      if (typeof exp === "object") {
        return exp.exp_sid || exp.value || exp.timestamp || 0;
      }
      return typeof exp === "number" ? exp : parseInt(exp) || 0;
    })
  );
};

const createRequestKey = (action, params = {}) => {
  return `${action}_${JSON.stringify(params)}`;
};

// Thunks
export const fetchExpiryDate = createAsyncThunk(
  "data/fetchExpiryDate",
  async (params, { getState, rejectWithValue }) => {
    const requestKey = createRequestKey("fetchExpiryDate", params);
    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { baseURL },
      } = getState();
      const requestPromise = axios
        .get(`${baseURL}/exp-date/`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.data);

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const fetchLiveData = createAsyncThunk(
  "data/fetchLiveData",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const requestKey = createRequestKey("fetchLiveData", {
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { baseURL, socketURL },
        data: { sid, exp_sid },
      } = state;
      const params = { sid, exp_sid };

      const requestPromise = (async () => {
        const response = await axios.get(`${baseURL}/live-data/`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const socketInstance = createSocketConnection(socketURL);
        if (!socketInstance) throw new Error("Socket connection failed");

        if (!socketInstance.connected) {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error("Socket connection timeout")),
              5000
            );
            socketInstance.once("connect", () => {
              clearTimeout(timeout);
              resolve();
            });
            socketInstance.once("connect_error", (error) => {
              clearTimeout(timeout);
              reject(error);
            });
          });
        }

        socketInstance.emit("stop_stream");
        socketInstance.off("live_data");
        socketInstance.emit("start_stream", params);

        socketInstance.on("live_data", (binaryBuffer) => {
          try {
            const decoded = decode(new Uint8Array(binaryBuffer));
            dispatch(updateLiveData(decoded));
          } catch (e) {}
        });

        socketInstance.once("stream_started", () => {
          dispatch(setStreamingState(true));
        });

        return response.data;
      })();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const fetchLiveDataDirectSocket = createAsyncThunk(
  "data/fetchLiveDataDirectSocket",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const requestKey = createRequestKey("fetchLiveDataDirectSocket", {
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { socketURL },
        data: { sid, exp_sid },
      } = state;
      const params = { sid, exp_sid };

      const requestPromise = (async () => {
        const socketInstance = createSocketConnection(socketURL);
        if (!socketInstance) throw new Error("Socket connection failed");

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Socket connection timeout")),
            5000
          );
          socketInstance.once("connect", () => {
            clearTimeout(timeout);
            resolve();
          });
          socketInstance.once("connect_error", (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });

        socketInstance.emit("stop_stream");
        socketInstance.off("live_data");
        socketInstance.emit("start_stream", params);

        socketInstance.on("live_data", (binaryBuffer) => {
          try {
            const decoded = decode(new Uint8Array(binaryBuffer));
            dispatch(updateLiveData(decoded));
          } catch (e) {}
        });

        socketInstance.once("stream_started", () => {
          dispatch(setStreamingState(true));
        });

        return { success: true, params };
      })();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const initializeLiveData = createAsyncThunk(
  "data/initializeLiveData",
  async (
    { useDirectSocket = false },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState();
    const requestKey = createRequestKey("initializeLiveData", {
      useDirectSocket,
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const requestPromise = useDirectSocket
        ? dispatch(fetchLiveDataDirectSocket()).unwrap()
        : dispatch(fetchLiveData()).unwrap();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(err.message || "Failed to initialize live data");
    }
  }
);

export const setSidAndFetchData = createAsyncThunk(
  "data/setSidAndFetchData",
  async ({ newSid, useDirectSocket = false }, { dispatch, getState }) => {
    const requestKey = createRequestKey("setSidAndFetchData", {
      newSid,
      useDirectSocket,
    });
    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const requestPromise = (async () => {
        dispatch(setSid(newSid));
        const expiryResponse = await dispatch(
          fetchExpiryDate({ sid: newSid })
        ).unwrap();

        if (!expiryResponse?.length)
          throw new Error("No expiry dates available");

        const latestExpiry = getLatestExpiry(expiryResponse);
        if (!latestExpiry) throw new Error("No valid expiry date found");

        dispatch(setExp_sid(latestExpiry));
        await new Promise((resolve) => setTimeout(resolve, 50));
        await dispatch(initializeLiveData({ useDirectSocket })).unwrap();

        return { success: true, sid: newSid, exp_sid: latestExpiry };
      })();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      throw err;
    }
  }
);

export const startLiveStream = createAsyncThunk(
  "data/startLiveStream",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const requestKey = createRequestKey("startLiveStream", {
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { socketURL },
        data: { sid, exp_sid },
      } = state;
      const streamParams = { sid, exp_sid };

      const requestPromise = (async () => {
        if (!socket) socket = createSocketConnection(socketURL);
        if (!socket) throw new Error("Failed to create socket connection");

        if (!socket.connected) socket.connect();

        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);

        return streamParams;
      })();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(err.message);
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
    connectionMethod: "api",
  },
  reducers: {
    setExp_sid: (state, action) => {
      state.exp_sid = action.payload;
      if (socket?.connected && state.isOc) {
        const streamParams = { sid: state.sid, exp_sid: action.payload };
        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);
      }
    },
    setSid: (state, action) => {
      state.sid = action.payload;
      if (socket?.connected && state.isOc) {
        const streamParams = { sid: action.payload, exp_sid: state.exp_sid };
        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);
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
    setConnectionMethod: (state, action) => {
      state.connectionMethod = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    setPopupData: (state, action) => {
      state.popupData = action.payload;
    },
    clearData: (state) => {
      state.data = {};
      state.error = null;
      state.isStreaming = false;
    },
    setLatestExpiry: (state) => {
      if (state.expDate.length > 0) {
        const latestExpiry = getLatestExpiry(state.expDate);
        if (latestExpiry && latestExpiry !== state.exp_sid) {
          state.exp_sid = latestExpiry;
          if (socket?.connected && state.isOc) {
            const streamParams = { sid: state.sid, exp_sid: latestExpiry };
            socket.emit("stop_stream");
            socket.emit("start_stream", streamParams);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionMethod = "api";
      })
      .addCase(fetchLiveData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveData.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch live data";
        state.loading = false;
        state.isStreaming = false;
      })
      .addCase(fetchLiveDataDirectSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionMethod = "socket";
      })
      .addCase(fetchLiveDataDirectSocket.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchLiveDataDirectSocket.rejected, (state, action) => {
        state.error = action.payload || "Failed to connect via socket";
        state.loading = false;
        state.isStreaming = false;
      })
      .addCase(initializeLiveData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeLiveData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initializeLiveData.rejected, (state, action) => {
        state.error = action.payload || "Failed to initialize live data";
        state.loading = false;
        state.isStreaming = false;
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
        if (expiryDates.length > 0) {
          const latestExpiry = getLatestExpiry(expiryDates);
          if (latestExpiry) state.exp_sid = latestExpiry;
        }
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

export const {
  setExp_sid,
  setSid,
  setIsOc,
  updateLiveData,
  setStreamingState,
  setConnectionMethod,
  resetError,
  setPopupData,
  clearData,
  setLatestExpiry,
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

export const clearActiveRequests = () => {
  activeRequests.clear();
};

export default dataSlice.reducer;
