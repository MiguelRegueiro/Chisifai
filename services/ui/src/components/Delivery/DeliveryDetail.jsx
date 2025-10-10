import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { api } from '../../services/api';
import TelemetryChart from '../Dashboard/TelemetryChart';

const DeliveryDetail = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        setLoading(true);
        // Fetch history for the delivery
        const response = await api.get(`/api/telemetry/history/${id}`);
        setDeliveryHistory(response.data);
        
        // Get the most recent data point
        if (response.data.length > 0) {
          setDelivery(response.data[0]); // Most recent is first due to ORDER BY ts DESC
        } else {
          setError('No data found for this delivery');
        }
        
        setError(null);
      } catch (error) {
        setError('Error fetching delivery details');
        console.error('Error fetching delivery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalle de Entrega: {id}
      </Typography>
      
      {delivery && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Temperatura</Typography>
                <Typography variant="h4" color={delivery.temp > 8 ? '#ff0000' : '#00aaff'}>
                  {delivery.temp}°C
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Humedad</Typography>
                <Typography variant="h4" color={delivery.humidity > 85 ? '#ff0000' : '#00aaff'}>
                  {delivery.humidity}%
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Vibración</Typography>
                <Typography variant="h4" color={delivery.vibration > 3 ? '#ff0000' : '#00aaff'}>
                  {delivery.vibration}G
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Estado</Typography>
                <Typography variant="h4" color="text.primary">
                  {delivery.temp > 8 || delivery.humidity > 85 || delivery.vibration > 3 ? 'ALERTA' : 'NORMAL'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Gráfico de Telemetría</Typography>
              <TelemetryChart data={deliveryHistory} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Información de la Entrega</Typography>
              <Typography>Última actualización: {new Date(delivery.ts).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default DeliveryDetail;