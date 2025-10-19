import React from 'react';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container fluid className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center p-4" style={{ 
            backgroundColor: '#d8eaf2', 
            border: '1px solid #224a70',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(34, 74, 112, 0.15)'
          }}>
            <Card.Body>
              <Image 
                src="/icon.png" 
                alt="Chisifai Logo" 
                className="mb-4"
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  maxHeight: '200px'
                }}
              />
              <Card.Title style={{ color: '#224a70', fontSize: '3rem', fontWeight: 'bold' }}>
                <strong>Chisifai Dashboard</strong>
              </Card.Title>
              <Card.Text className="mt-4" style={{ color: '#1a3a5a', fontSize: '1.5rem', lineHeight: '1.6' }}>
                Sistema de monitoreo en tiempo real para el transporte de cheesecakes que controla temperatura y fuerza G.
              </Card.Text>
              <Card.Text className="mt-3" style={{ color: '#1a3a5a', fontSize: '1.3rem', lineHeight: '1.6' }}>
                La aplicación permite rastrear envíos en tiempo real, recibir alertas críticas y visualizar métricas clave del sistema.
              </Card.Text>
              <div className="mt-4">
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  variant="primary" 
                  style={{ 
                    backgroundColor: '#224a70', 
                    borderColor: '#224a70',
                    fontSize: '1.1rem',
                    padding: '10px 25px'
                  }}
                >
                  Ir al Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
