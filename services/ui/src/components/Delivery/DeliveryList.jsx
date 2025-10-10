import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { api } from '../../services/api';

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await api.get('/api/deliveries/active');
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const getStatusColor = (delivery) => {
    if (delivery.temp > 8 || delivery.humidity > 85 || delivery.vibration > 3) {
      return 'error';
    } else if (delivery.temp > 7 || delivery.humidity > 75 || delivery.vibration > 2) {
      return 'warning';
    }
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando entregas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Entregas Activas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID de Entrega</TableCell>
              <TableCell>Temperatura</TableCell>
              <TableCell>Humedad</TableCell>
              <TableCell>Vibración</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Última Actualización</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.part_id}>
                <TableCell>{delivery.part_id}</TableCell>
                <TableCell>{delivery.temp}°C</TableCell>
                <TableCell>{delivery.humidity}%</TableCell>
                <TableCell>{delivery.vibration}G</TableCell>
                <TableCell>
                  <Chip
                    label={delivery.temp > 8 || delivery.humidity > 85 || delivery.vibration > 3 ? 'ALERTA' : 'NORMAL'}
                    color={getStatusColor(delivery)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(delivery.ts).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeliveryList;