import React, { useState, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';

const PackageStats = () => {
  const { telemetryData, loading } = useData();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [lastKnownData, setLastKnownData] = useState([]);

  // Update last known data when new data comes in
  useEffect(() => {
    if (!loading && telemetryData && telemetryData.length > 0) {
      setLastKnownData(telemetryData);
    }
  }, [telemetryData, loading]);

  // Use last known values when current data is not available during loading
  const displayData = loading ? (lastKnownData.length > 0 ? lastKnownData : []) : (telemetryData || []);

  // Group telemetry data by package ID to get latest values
  const packageStats = {};
  displayData.forEach(item => {
    if (!packageStats[item.packageId] || new Date(item.timestamp) > new Date(packageStats[item.packageId].timestamp)) {
      packageStats[item.packageId] = item;
    }
  });

  const packages = Object.values(packageStats);

  return (
    <Card className={`h-100 ${loading ? 'opacity-75' : ''}`}>
      <Card.Header>
        <h5 className="mb-0">Estadísticas de Envíos</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>ID Envío</th>
                <th>Temperatura (°C)</th>
                <th>Fuerza G</th>
                <th>Batería</th>
                <th>Señal</th>
                <th>Estado</th>
                <th>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg, index) => {
                  // Determine status based on temperature and g-force
                  let status = "Normal";
                  let statusClass = "text-success";
                  
                  if (pkg.temperature > 26.0) {
                    status = "Temperatura Alta";
                    statusClass = "text-danger";
                  } else if (pkg.gForce > 2.5) {
                    status = "Impacto Detectado";
                    statusClass = "text-warning";
                  }
                  
                  const temperature = pkg.temperature !== undefined && pkg.temperature !== null ? pkg.temperature : 0;
                  const gForce = pkg.gForce !== undefined && pkg.gForce !== null ? pkg.gForce : 0;
                  const battery = pkg.batteryLevel !== undefined && pkg.batteryLevel !== null ? 
                    `${Math.round(pkg.batteryLevel)}%` : "--%";
                  const signal = pkg.signalStrength !== undefined && pkg.signalStrength !== null ? 
                    `${pkg.signalStrength} dBm` : "-- dBm";
                  
                  return (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedPackage(pkg)}
                      style={{ cursor: 'pointer' }}
                      className={selectedPackage && selectedPackage.packageId === pkg.packageId ? "table-primary" : ""}
                    >
                      <td>{pkg.packageId}</td>
                      <td>
                        <span className={temperature > 26.0 ? "text-danger fw-bold" : ""}>
                          {temperature}°C
                        </span>
                      </td>
                      <td>
                        <span className={gForce > 2.5 ? "text-warning fw-bold" : ""}>
                          {gForce}G
                        </span>
                      </td>
                      <td>{battery}</td>
                      <td>{signal}</td>
                      <td className={statusClass}>{status}</td>
                      <td>{new Date(pkg.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">{loading ? 'Cargando datos...' : 'No hay datos de envíos disponibles'}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PackageStats;