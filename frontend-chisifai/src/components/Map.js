import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useData } from '../contexts/DataContext';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const { locationData, loading } = useData();
  const [mapCenter] = useState([40.4168, -3.7038]); // Center on Spain

  // Determine map position based on active shipments
  const getMapBounds = () => {
    if (locationData && locationData.length > 0) {
      const lats = locationData.map(loc => loc.lat);
      const lngs = locationData.map(loc => loc.lng);
      const southWest = L.latLng(Math.min(...lats) - 0.1, Math.min(...lngs) - 0.1);
      const northEast = L.latLng(Math.max(...lats) + 0.1, Math.max(...lngs) + 0.1);
      return L.latLngBounds(southWest, northEast);
    }
    return null;
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">Ubicación de Envíos</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ height: '400px' }}>
          <MapContainer 
            center={mapCenter} 
            zoom={6} 
            style={{ height: '100%', width: '100%' }}
            bounds={getMapBounds()}
            boundsOptions={{ padding: [50, 50] }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locationData && locationData.map((location) => (
              <Marker 
                key={location.id} 
                position={[location.lat, location.lng]}
              >
                <Popup>
                  <div>
                    <strong>{location.name}</strong><br/>
                    Temperatura: {location.temp}°C<br/>
                    Fuerza G: {location.gForce}G
                  </div>
                </Popup>
              </Marker>
            ))}
            {loading && locationData.length === 0 && (
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                color: 'gray'
              }}>
                Cargando ubicaciones...
              </div>
            )}
          </MapContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Map;