import React, { useState, useEffect } from 'react';
import DeliveryMap from './DeliveryMap';
import TelemetryChart from './TelemetryChart';
import AlertPanel from './AlertPanel';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useTelemetryData } from '../../hooks/useTelemetryData';
import { useAlerts } from '../../hooks/useAlerts';
import { useWebSocket } from '../../hooks/useWebSocket';

const Dashboard = () => {
  const { telemetryData, loading: telemetryLoading } = useTelemetryData();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { connected } = useWebSocket();

  return (
    <div className="dashboard">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Monitoreo Chisifai
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2, height: '500px' }}>
              <DeliveryMap telemetryData={telemetryData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <AlertPanel alerts={alerts} loading={alertsLoading} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <TelemetryChart data={telemetryData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;