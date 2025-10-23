// apiService.js - API service module to connect with FastAPI backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// Generic API fetch function with error handling
const apiFetch = async (endpoint) => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, [...response.headers.entries()]);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout for ${endpoint}`);
    } else {
      console.error(`Error fetching from ${endpoint}:`, error.message);
      console.error(`Full error:`, error);
    }
    return null;
  }
};

// Fetch telemetry data
export const fetchTelemetryData = async () => {
  return await apiFetch('/api/telemetry') || [];
};

// Fetch KPIs
export const fetchKPIs = async () => {
  return await apiFetch('/api/kpis') || {};
};

// Fetch alerts
export const fetchAlerts = async () => {
  return await apiFetch('/api/alerts') || [];
};

// Fetch location data
export const fetchLocationData = async () => {
  return await apiFetch('/api/location') || [];
};

// Fetch temperature data
export const fetchTemperatureData = async () => {
  return await apiFetch('/api/temperature') || [];
};

// Fetch G-force data
export const fetchGForceData = async () => {
  return await apiFetch('/api/gforce') || [];
};