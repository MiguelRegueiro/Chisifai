import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KPIs from './KPIs';
import TemperatureChart from './TemperatureChart';
import GForceChart from './GForceChart';
import Alerts from './Alerts';
import PackageStats from './PackageStats';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Container fluid className="dashboard-main">
        <Row>
          <Col xs={12} className="content-col">
            <Row>
              <Col xs={12}>
                <KPIs />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <TemperatureChart />
              </Col>
              <Col xs={12} md={4}>
                <Alerts />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <GForceChart />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <PackageStats />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;