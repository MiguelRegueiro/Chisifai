import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';

const KPIs = () => {
  const { kpis, loading } = useData();
  const [lastKnownKpis, setLastKnownKpis] = useState({});

  // Update last known KPIs when new data comes in
  useEffect(() => {
    if (!loading && kpis && Object.keys(kpis).length > 0) {
      setLastKnownKpis(prev => ({ ...prev, ...kpis }));
    }
  }, [kpis, loading]);

  // Use last known values when current kpis are not available during loading
  // Provide default values to avoid N/A display
  const displayKpis = {
    temperatureCompliance: (loading && lastKnownKpis.temperatureCompliance !== undefined) ? 
      lastKnownKpis.temperatureCompliance : 
      (kpis.temperatureCompliance !== undefined ? kpis.temperatureCompliance : 0),
    productConditionRate: (loading && lastKnownKpis.productConditionRate !== undefined) ? 
      lastKnownKpis.productConditionRate : 
      (kpis.productConditionRate !== undefined ? kpis.productConditionRate : 0),
    avgDeliveryTime: (loading && lastKnownKpis.avgDeliveryTime !== undefined) ? 
      lastKnownKpis.avgDeliveryTime : 
      (kpis.avgDeliveryTime !== undefined ? kpis.avgDeliveryTime : 0)
  };

  // Default values with proper fallback - only showing the most important metrics
  const kpiData = [
    { 
      title: "Cumplimiento Térmico", 
      value: `${displayKpis.temperatureCompliance}%`, 
      description: "Tartas que mantuvieron temperatura correcta", 
      icon: "🌡️", 
      color: displayKpis.temperatureCompliance >= 95 ? "success" : displayKpis.temperatureCompliance >= 85 ? "warning" : "danger", 
      trend: displayKpis.temperatureCompliance >= 95 ? "up text-success" : "down text-danger" 
    },
    { 
      title: "Calidad del Producto", 
      value: `${displayKpis.productConditionRate}%`, 
      description: "Tartas entregadas en perfectas condiciones", 
      icon: "🍰", 
      color: displayKpis.productConditionRate >= 95 ? "success" : displayKpis.productConditionRate >= 85 ? "warning" : "danger", 
      trend: displayKpis.productConditionRate >= 95 ? "up text-success" : "down text-danger" 
    },
    { 
      title: "Tiempo Promedio Entrega", 
      value: `${displayKpis.avgDeliveryTime} min`, 
      description: "Tiempo medio de entrega", 
      icon: "⏱️", 
      color: displayKpis.avgDeliveryTime <= 30 ? "success" : displayKpis.avgDeliveryTime <= 45 ? "warning" : "danger", 
      trend: displayKpis.avgDeliveryTime <= 30 ? "down text-success" : "up text-danger" 
    }
  ];

  return (
    <div className="kpis-container mb-4">
      <h3 className="mb-4 fw-bold">Métricas Clave de Rendimiento</h3>
      <Row>
        {kpiData.map((kpi, index) => (
          <Col xs={12} md={4} key={index} className="mb-4">
            <Card className={`h-100 ${loading ? 'opacity-75' : ''} card-${kpi.color} border-${kpi.color}`}>
              <Card.Body className="d-flex align-items-center">
                <div className="kpi-icon me-3 text-primary">
                  <span className="display-4">{kpi.icon}</span>
                </div>
                <div className="flex-grow-1">
                  <Card.Title className="text-muted small mb-1">{kpi.title}</Card.Title>
                  <Card.Text className={`fs-3 fw-bold mb-0 ${loading ? 'text-muted' : ''}`}>
                    {kpi.value}
                  </Card.Text>
                  <small className="text-muted">{kpi.description}</small>
                  {kpi.trend && !loading && (
                    <div className={`mt-1 ${kpi.trend === 'up text-success' ? 'text-success' : kpi.trend === 'down text-success' ? 'text-success' : kpi.trend === 'up text-danger' ? 'text-danger' : 'text-danger'}`}>
                      {kpi.trend.includes('up') ? '↑' : kpi.trend.includes('down') ? '↓' : ''} {kpi.trend.includes('up') ? 'Mejora' : 'Deterioro'}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KPIs;