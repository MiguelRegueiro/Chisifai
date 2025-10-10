import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/alerts/active');
        setAlerts(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching alerts');
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error };
};