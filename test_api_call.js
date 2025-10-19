// Script para probar la llamada API desde el frontend
const API_BASE_URL = 'http://localhost:8001';

// Simular la función apiFetch del frontend
async function apiFetch(endpoint) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    console.log(`Fetching: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout for ${endpoint}`);
    } else {
      console.error(`Error fetching from ${endpoint}:`, error.message);
    }
    return null;
  }
}

// Simular la llamada a fetchKPIs
async function testKPIs() {
  console.log("Testing KPIs API call...");
  const kpis = await apiFetch('/api/kpis');
  console.log("KPIs received:", kpis);
  
  if (kpis) {
    console.log("slaPercentage:", kpis.slaPercentage);
    console.log("mttDetection:", kpis.mttDetection);
    console.log("falsePositiveRate:", kpis.falsePositiveRate);
  } else {
    console.log("No KPIs data received");
  }
}

// Ejecutar la prueba
testKPIs().catch(console.error);