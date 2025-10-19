import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  fetchTelemetryData, 
  fetchKPIs, 
  fetchAlerts, 
  fetchLocationData 
} from '../services/apiService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [kpis, setKpis] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch real data from API
  const fetchData = async () => {
    console.log('Starting data fetch...');
    setLoading(true);
    
    try {
      // Fetch all data concurrently
      const [telemetry, kpis, alerts, locations] = await Promise.all([
        fetchTelemetryData(),
        fetchKPIs(),
        fetchAlerts(),
        fetchLocationData()
      ]);
      
      console.log('Raw API responses:', { telemetry, kpis, alerts, locations });
      
      // Only update state if data is valid
      if (telemetry !== null) setTelemetryData(telemetry);
      if (kpis !== null) {
        console.log('Setting KPIs:', kpis);
        setKpis(kpis);
      }
      if (alerts !== null) setAlerts(alerts);
      if (locations !== null) setLocationData(locations);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Keep existing data if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Initialize data and set up polling
  useEffect(() => {
    // Initial data load
    fetchData();
    
    // Set up polling to update data every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{
      telemetryData,
      kpis,
      alerts,
      locationData,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};