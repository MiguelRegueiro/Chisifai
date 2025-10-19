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
    { title: "% de Envíos en SLA", value: "Cargando...", description: "Envíos que llegaron sin incidentes", icon: "📦", color: "secondary" },
    { title: "Tiempo Medio de Detección", value: "Cargando...", description: "Tiempo promedio para detectar incidentes", icon: "⏱️", color: "secondary" },
    { title: "% de Falsos Positivos", value: "Cargando...", description: "Alertas que no correspondieron a incidentes reales", icon: "⚠️", color: "secondary" }
  ] : [
    { title: "% de Envíos en SLA", value: `${kpis.slaPercentage !== undefined ? kpis.slaPercentage : 'N/A'}%`, description: "Envíos que llegaron sin incidentes", icon: "📦", color: "success" },
    { title: "Tiempo Medio de Detección", value: `${kpis.mttDetection !== undefined ? kpis.mttDetection : 'N/A'} seg`, description: "Tiempo promedio para detectar incidentes", icon: "⏱️", color: "info" },
    { title: "% de Falsos Positivos", value: `${kpis.falsePositiveRate !== undefined ? kpis.falsePositiveRate : 'N/A'}%`, description: "Alertas que no correspondieron a incidentes reales", icon: "⚠️", color: "warning" }
  ];

  return (
    <div className="kpis-container mb-4">
      <h3 className="mb-4">Indicadores Clave de Rendimiento</h3>
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