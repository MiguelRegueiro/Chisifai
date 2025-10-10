import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeliveryMap = ({ telemetryData }) => {
  // Calculate center based on data or default
  // Use a default location if no data is available or if coordinates are missing
  const hasValidCoordinates = telemetryData.some(d => d.lat && d.lng && d.lat !== 0 && d.lng !== 0);
  const center = hasValidCoordinates 
    ? [telemetryData.find(d => d.lat && d.lng && d.lat !== 0 && d.lng !== 0).lat, 
       telemetryData.find(d => d.lat && d.lng && d.lat !== 0 && d.lng !== 0).lng] 
    : [40.4168, -3.7038]; // Madrid as default

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={hasValidCoordinates ? 13 : 6} // Zoom out if using default location
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {telemetryData.map((delivery, index) => {
          // Only show markers for deliveries with valid coordinates
          if (!delivery.lat || !delivery.lng || delivery.lat === 0 || delivery.lng === 0) {
            return null;
          }
          return (
            <Marker key={index} position={[delivery.lat, delivery.lng]}>
              <Popup>
                <div>
                  <h3>Entrega: {delivery.part_id}</h3>
                  <p>Temperatura: {delivery.temp}°C</p>
                  <p>Humedad: {delivery.humidity}%</p>
                  <p>Vibración: {delivery.vibration}G</p>
                  <p>Estado: {delivery.temp > 8 || delivery.humidity > 85 || delivery.vibration > 3 ? 'ALERTA' : 'NORMAL'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default DeliveryMap;