// apiService.js - API service module to connect with FastAPI backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Generic API fetch function with error handling
const apiFetch = async (endpoint) => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout for ${endpoint}`);
    } else {
      console.error(`Error fetching from ${endpoint}:`, error.message);
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

