import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  AlertTitle,
  Box,
  Typography
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AlertPanel = ({ alerts, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando alertas...</Typography>
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Sin Alertas</AlertTitle>
        No hay alertas activas en este momento.
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Alertas Activas ({alerts.length})
      </Typography>
      <List>
        {alerts.slice(0, 5).map((alert, index) => (
          <ListItem key={index} divider>
            <ListItemIcon>
              <WarningIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary={`${alert.part_id} - ${alert.alert_type}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {alert.alert_value} (umbral: {alert.threshold})
                  </Typography>
                  <br />
                  {new Date(alert.ts).toLocaleString()}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AlertPanel;