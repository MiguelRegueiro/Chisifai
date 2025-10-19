import React from 'react';
import { Navbar, Container, Image, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3" style={{ backgroundColor: '#224a70' }}>
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Image 
            src="/favicontransparent.png" 
            alt="Chisifai Logo" 
            width="30" 
            height="30" 
            className="me-2"
            style={{ objectFit: 'contain' }}
          />
          <strong style={{ color: '#d8eaf2', fontSize: '1.5rem' }}>Chisifai Dashboard</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              style={{ 
                color: isActive('/') ? '#f5bc4b' : '#d8eaf2' 
              }}
              className={isActive('/') ? 'fw-bold' : ''}
            >
              Inicio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              style={{ 
                color: isActive('/dashboard') ? '#f5bc4b' : '#d8eaf2' 
              }}
              className={isActive('/dashboard') ? 'fw-bold' : ''}
            >
              Dashboard
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;