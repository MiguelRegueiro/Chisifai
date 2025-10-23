import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  fetchTelemetryData, 
  fetchKPIs, 
  fetchAlerts, 
  fetchLocationData,
  fetchTemperatureData,
  fetchGForceData
} from '../services/apiService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [kpis, setKpis] = useState({
    temperatureCompliance: 0,
    productConditionRate: 0,
    avgDeliveryTime: 0,
    customerSatisfaction: 0,
    slaPercentage: 0,
    mttDetection: 0,
    alertCount: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [gforceData, setGForceData] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch real data from API
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch all data concurrently
      const [telemetry, kpis, alerts, locations, tempData, gforceData] = await Promise.all([
        fetchTelemetryData(),
        fetchKPIs(),
        fetchAlerts(),
        fetchLocationData(),
        fetchTemperatureData(),
        fetchGForceData()
      ]);
      
      // Only update state if data is valid
      if (telemetry !== null) setTelemetryData(telemetry);
      if (kpis !== null) setKpis(kpis);
      if (alerts !== null) setAlerts(alerts);
      if (locations !== null) setLocationData(locations);
      if (tempData !== null) setTemperatureData(tempData);
      if (gforceData !== null) setGForceData(gforceData);
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
    
    // Set up polling to update data every 5 minutes to significantly reduce refresh frequency
    const interval = setInterval(() => {
      fetchData();
    }, 300000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{
      telemetryData,
      kpis,
      alerts,
      locationData,
      temperatureData,
      gforceData,
      loading,
      refreshData: fetchData  // Add manual refresh function
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