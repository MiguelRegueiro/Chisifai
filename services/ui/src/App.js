import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard/Dashboard';
import DeliveryList from './components/Delivery/DeliveryList';
import DeliveryDetail from './components/Delivery/DeliveryDetail';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import { AppProvider } from './contexts/AppContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import './styles/App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF9800',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <WebSocketProvider>
          <Router>
            <div className="app">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <div className="app-body">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/deliveries" element={<DeliveryList />} />
                    <Route path="/deliveries/:id" element={<DeliveryDetail />} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </WebSocketProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;