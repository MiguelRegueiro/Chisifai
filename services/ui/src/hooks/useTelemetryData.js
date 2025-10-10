import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useTelemetryData = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTelemetryData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/telemetry/latest');
        // Add default coordinates if not present
        const enrichedData = response.data.map(item => ({
          ...item,
          lat: item.lat || 40.4168, // Default to Madrid coordinates
          lng: item.lng || -3.7038
        }));
        setTelemetryData(enrichedData);
        setError(null);
      } catch (error) {
        setError('Error fetching telemetry data');
        console.error('Error fetching telemetry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetryData();
    const interval = setInterval(fetchTelemetryData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { telemetryData, loading, error };
};