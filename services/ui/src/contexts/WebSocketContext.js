import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './AppContext';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const { dispatch } = useAppContext();

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8001/ws';
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      setConnected(true);
    };

    newWs.onclose = () => {
      setConnected(false);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'telemetry_update') {
          dispatch({ type: 'ADD_DELIVERY_TELEMETRY', payload: data.data });
        } else if (data.type === 'alert_update') {
          dispatch({ type: 'ADD_ALERT', payload: data.data });
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    setWs(newWs);

    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, [dispatch]);

  const sendMessage = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, connected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};