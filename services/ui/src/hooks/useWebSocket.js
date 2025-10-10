import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = (onMessage) => {
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8001/ws';
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    newWs.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'telemetry_update' && onMessage) {
          onMessage('telemetry', data.data);
        } else if (data.type === 'alert_update' && onMessage) {
          onMessage('alert', data.data);
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
  }, [onMessage]);

  const sendMessage = useCallback((data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, [ws]);

  return { ws, connected, sendMessage };
};