import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid>
        <Navbar.Brand href="#">
          <strong>Chisifai Dashboard</strong>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;