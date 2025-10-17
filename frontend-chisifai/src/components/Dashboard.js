import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import KPIs from './KPIs';
import Map from './Map';
import TemperatureChart from './TemperatureChart';
import GForceChart from './GForceChart';
import Alerts from './Alerts';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <Container fluid className="dashboard-main">
        <Row>
          <Col md={2} className="sidebar-col d-none d-md-block">
            <Sidebar />
          </Col>
          <Col xs={12} md={10} className="content-col">
            <Row>
              <Col xs={12}>
                <KPIs />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <Map />
              </Col>
              <Col xs={12} md={4}>
                <Alerts />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <TemperatureChart />
              </Col>
              <Col xs={12} md={6}>
                <GForceChart />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;