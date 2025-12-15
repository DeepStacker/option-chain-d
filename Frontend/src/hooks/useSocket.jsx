import { useEffect, useRef, useCallback, useState } from 'react';
import { decode as msgpackDecode } from '@msgpack/msgpack';
import logger from '../utils/logger';

/**
 * WebSocket Hook for FastAPI Backend
 * Endpoint: ws://host/ws/options
 * Supports msgpack binary message decoding
 */
const useSocket = (onDataReceived, options = {}) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const {
    enabled = true, // Set to false to disable auto-connection
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 3, // Reduced to avoid spam
    socketUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000/ws/options',
  } = options;

  const reconnectAttemptsRef = useRef(0);

  /**
   * Decode message - handles both msgpack binary and JSON
   */
  const decodeMessage = async (data) => {
    try {
      // Handle Blob (binary data from WebSocket)
      if (data instanceof Blob) {
        const buffer = await data.arrayBuffer();
        return msgpackDecode(new Uint8Array(buffer));
      }
      // Handle ArrayBuffer directly
      if (data instanceof ArrayBuffer) {
        return msgpackDecode(new Uint8Array(data));
      }
      // Handle string (JSON)
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      // Return as-is if already object
      return data;
    } catch (err) {
      console.error('Error decoding message:', err);
      throw err;
    }
  };

  // Use ref for callback to prevent effect re-triggering when callback identity changes
  const onDataReceivedRef = useRef(onDataReceived);
  
  useEffect(() => {
    onDataReceivedRef.current = onDataReceived;
  }, [onDataReceived]);

  const connect = useCallback(() => {
    try {
      // Clear any existing connection
      if (socketRef.current) {
        socketRef.current.close();
      }

      // Use the WebSocket URL (already includes /ws/options if using VITE_WS_URL)
      const wsUrl = socketUrl.includes('/ws/') ? socketUrl : `${socketUrl}/ws/options`;

      logger.log('🔌 Connecting to WebSocket:', wsUrl);

      // Connect without token in URL (long JWT tokens can cause issues in query params)
      // Auth token can be sent as first message after connection if needed
      socketRef.current = new WebSocket(wsUrl);

      // Connection opened
      socketRef.current.onopen = () => {
        logger.log('✅ WebSocket Connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Send ping to confirm connection
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'ping' }));
        }
      };

      // Listen for messages
      socketRef.current.onmessage = async (event) => {
        try {
          // Debug: Log raw message type
          logger.debug('📩 WebSocket raw message type:', typeof event.data, event.data instanceof Blob ? 'Blob' : event.data instanceof ArrayBuffer ? 'ArrayBuffer' : 'String');
          
          const data = await decodeMessage(event.data);
          
          // Debug: Log decoded data
          logger.debug('📦 WebSocket decoded data:', data?.type || 'live_data', data?.oc ? `(${Object.keys(data.oc).length} strikes)` : '');

          // Handle different message types
          if (data.type === 'connected') {
            logger.log('✅ Connection confirmed, client_id:', data.client_id);
            setError(null); // Clear error on successful connection
          } else if (data.type === 'subscribed') {
            logger.log('✅ Subscribed to:', data.symbol, data.expiry);
            setSubscription({ symbol: data.symbol, expiry: data.expiry });
            setError(null); // Clear error on successful subscription
          } else if (data.type === 'unsubscribed') {
            logger.log('✅ Unsubscribed');
            setSubscription(null);
          } else if (data.type === 'pong') {
            // Heartbeat response
          } else if (data.type === 'error') {
            console.error('WebSocket Error Message:', data.message);
            setError(data.message);
          } else {
            // Live data - pass to callback
            if (error) setError(null); // Clear error if we start receiving data
            logger.debug('📡 Passing live data to callback');
            if (onDataReceivedRef.current) {
                onDataReceivedRef.current(data);
            }
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      // Connection error - less verbose logging
      socketRef.current.onerror = () => {
        // Don't log full error object - too noisy
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      // Connection closed
      socketRef.current.onclose = (event) => {
        logger.log('🔌 WebSocket Disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSubscription(null);

        // Auto-reconnect logic
        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          !event.wasClean
        ) {
          reconnectAttemptsRef.current += 1;
          logger.log(
            `⏳ Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.warn('⚠️ WebSocket unavailable, using REST polling');
          setError('WebSocket unavailable - using polling');
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketUrl, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close(1000, 'Client disconnect');
      socketRef.current = null;
    }
    setIsConnected(false);
    setSubscription(null);
  }, []);

  // Send message function
  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      socketRef.current.send(payload);
      return true;
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
      return false;
    }
  }, []);

  /**
   * Subscribe to live data for a symbol/expiry
   * @param {string} symbol - Trading symbol (e.g., 'NIFTY')
   * @param {string} expiry - Expiry timestamp (e.g., '1419013800')
   */
  const subscribe = useCallback((symbol, expiry) => {
    if (!isConnected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return false;
    }
    return sendMessage({
      type: 'subscribe',
      sid: symbol.toUpperCase(),
      exp_sid: expiry
    });
  }, [isConnected, sendMessage]);

  /**
   * Unsubscribe from live data
   */
  const unsubscribe = useCallback(() => {
    return sendMessage({ type: 'unsubscribe' });
  }, [sendMessage]);

  // Initial connection - only connect if enabled
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // Return socket interface
  return {
    isConnected,
    error,
    subscription,
    sendMessage,
    subscribe,
    unsubscribe,
    disconnect,
    reconnect: connect,
  };
};

export default useSocket;
