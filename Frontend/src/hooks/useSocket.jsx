import { useEffect, useRef, useCallback, useState } from 'react';
import { decode as msgpackDecode } from '@msgpack/msgpack';

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
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
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

  const connect = useCallback(() => {
    try {
      // Clear any existing connection
      if (socketRef.current) {
        socketRef.current.close();
      }

      // Use the WebSocket URL (already includes /ws/options if using VITE_WS_URL)
      const wsUrl = socketUrl.includes('/ws/') ? socketUrl : `${socketUrl}/ws/options`;

      // Get auth token if available
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const urlWithAuth = token ? `${wsUrl}?token=${token}` : wsUrl;

      console.log('🔌 Connecting to WebSocket:', wsUrl);

      socketRef.current = new WebSocket(urlWithAuth);

      // Connection opened
      socketRef.current.onopen = () => {
        console.log('✅ WebSocket Connected');
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
          const data = await decodeMessage(event.data);

          // Handle different message types
          if (data.type === 'connected') {
            console.log('✅ Connection confirmed, client_id:', data.client_id);
          } else if (data.type === 'subscribed') {
            console.log('✅ Subscribed to:', data.symbol, data.expiry);
            setSubscription({ symbol: data.symbol, expiry: data.expiry });
          } else if (data.type === 'unsubscribed') {
            console.log('✅ Unsubscribed');
            setSubscription(null);
          } else if (data.type === 'pong') {
            // Heartbeat response
          } else if (data.type === 'error') {
            console.error('WebSocket Error Message:', data.message);
            setError(data.message);
          } else {
            // Live data - pass to callback
            onDataReceived(data);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      // Connection error
      socketRef.current.onerror = (errorEvent) => {
        console.error('❌ WebSocket Error:', errorEvent);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      // Connection closed
      socketRef.current.onclose = (event) => {
        console.log('🔌 WebSocket Disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSubscription(null);

        // Auto-reconnect logic
        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          !event.wasClean
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `⏳ Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached');
          setError('Failed to connect after multiple attempts');
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err.message);
    }
  }, [socketUrl, onDataReceived, autoReconnect, reconnectInterval, maxReconnectAttempts]);

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

  // Initial connection
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

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
