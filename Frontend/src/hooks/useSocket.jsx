import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../api/config';

const useSocket = (onDataReceived) => {
  // Use a ref to hold the socket instance
  const socketRef = useRef(null);

  useEffect(() => {
    // Check if socket already exists, if not, create it
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false,
        withCredentials: true,
        extraHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        }
      });

      // Set up event listeners
      socketRef.current.on('live_data', onDataReceived);
      socketRef.current.on('connect_error', (error) => console.error('Connection Error:', error));
      
      // Emit event to start live data
      socketRef.current.emit('start_live_data');
    }

    // Clean up function to disconnect the socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset the ref to prevent memory leaks
      }
    };
  }, [onDataReceived]);

  return socketRef.current; // Optional: Return the socket instance if needed
};

export default useSocket;
