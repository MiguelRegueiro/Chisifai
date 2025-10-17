import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column pt-3">
        <Nav.Link href="#dashboard" className="active">Dashboard</Nav.Link>
        <Nav.Link href="#shipments">Envíos</Nav.Link>
        <Nav.Link href="#telemetry">Telemetría</Nav.Link>
        <Nav.Link href="#alerts">Alertas</Nav.Link>
        <Nav.Link href="#reports">Reportes</Nav.Link>
        <Nav.Link href="#settings">Configuración</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;