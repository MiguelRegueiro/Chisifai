import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';

const KPIs = () => {
  const { kpis, loading } = useData();
  console.log('KPIs component - kpis state:', kpis);
  console.log('KPIs component - loading state:', loading);

  // Default values when loading
  const kpiData = loading ? [
    { title: "% de Envíos en SLA", value: "Cargando...", description: "Envíos que llegaron dentro del tiempo prometido", icon: "⏰", color: "secondary" },
    { title: "% de Tartas en Temperatura", value: "Cargando...", description: "Tartas que mantuvieron la temperatura correcta", icon: "🌡️", color: "secondary" },
    { title: "Tiempo Medio de Entrega", value: "Cargando...", description: "Tiempo promedio de entrega", icon: "⏱️", color: "secondary" },
    { title: "% de Condición del Producto", value: "Cargando...", description: "Tartas entregadas en perfectas condiciones", icon: "🍰", color: "secondary" },
    { title: "Satisfacción del Cliente", value: "Cargando...", description: "Calificación promedio de clientes", icon: "😊", color: "secondary" },
    { title: "Tiempo Medio de Detección", value: "Cargando...", description: "Tiempo promedio para detectar problemas", icon: "🔍", color: "secondary" }
  ] : [
    { title: "% de Envíos en SLA", value: `${kpis.slaPercentage !== undefined ? kpis.slaPercentage : 'N/A'}%`, description: "Envíos que llegaron dentro del tiempo prometido", icon: "⏰", color: "success" },
    { title: "% de Tartas en Temperatura", value: `${kpis.temperatureCompliance !== undefined ? kpis.temperatureCompliance : 'N/A'}%`, description: "Tartas que mantuvieron la temperatura correcta", icon: "🌡️", color: "info" },
    { title: "Tiempo Medio de Entrega", value: `${kpis.avgDeliveryTime !== undefined ? kpis.avgDeliveryTime : 'N/A'} min`, description: "Tiempo promedio de entrega", icon: "⏱️", color: "primary" },
    { title: "% de Condición del Producto", value: `${kpis.productConditionRate !== undefined ? kpis.productConditionRate : 'N/A'}%`, description: "Tartas entregadas en perfectas condiciones", icon: "🍰", color: "success" },
    { title: "Satisfacción del Cliente", value: `${kpis.customerSatisfaction !== undefined ? kpis.customerSatisfaction : 'N/A'}/5`, description: "Calificación promedio de clientes", icon: "😊", color: "warning" },
    { title: "Tiempo Medio de Detección", value: `${kpis.mttDetection !== undefined ? kpis.mttDetection : 'N/A'} seg`, description: "Tiempo promedio para detectar problemas", icon: "🔍", color: "info" }
  ];

  return (
    <div className="kpis-container mb-4">
      <h3 className="mb-4 fw-bold">Indicadores Clave de Rendimiento</h3>
      <Row>
        {kpiData.map((kpi, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className={`kpi-card border-${kpi.color}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="text-muted small">{kpi.title}</Card.Title>
                    <Card.Text className={`display-4 fw-bold mb-0 ${loading ? 'text-muted' : ''}`}>{kpi.value}</Card.Text>
                    <small className="text-muted">{kpi.description}</small>
                  </div>
                  <div className="kpi-icon display-4">{kpi.icon}</div>
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