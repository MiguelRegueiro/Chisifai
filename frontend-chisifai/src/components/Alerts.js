import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';

const Alerts = () => {
  const { alerts, loading } = useData();

  const getAlertClass = (severity) => {
    switch(severity) {
      case 'high':
        return 'list-group-item-danger';
      case 'medium':
        return 'list-group-item-warning';
      case 'low':
        return 'list-group-item-info';
      default:
        return 'list-group-item-light';
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Alertas del Sistema</h5>
        <span className="badge bg-danger">{alerts ? alerts.length : 0}</span>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {loading && (!alerts || alerts.length === 0) ? (
            <ListGroup.Item className="text-center text-muted">
              Cargando alertas...
            </ListGroup.Item>
          ) : alerts && alerts.length > 0 ? (
            alerts.map(alert => (
              <ListGroup.Item 
                key={alert.id} 
                className={`${getAlertClass(alert.severity)} alert-item`}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="mb-1">{alert.type}</h6>
                    <p className="mb-1 small">{alert.message}</p>
                  </div>
                  <div className="text-end">
                    <small className="text-muted">{alert.timestamp}</small>
                    <div className="mt-1">
                      <span className="badge bg-secondary">{alert.packageId}</span>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center text-muted">
              No hay alertas activas
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Alerts;