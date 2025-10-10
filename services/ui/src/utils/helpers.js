export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

export const getStatusFromTelemetry = (telemetry) => {
  if (telemetry.temp > 8 || telemetry.humidity > 85 || telemetry.vibration > 3) {
    return 'alert';
  } else if (telemetry.temp > 7 || telemetry.humidity > 75 || telemetry.vibration > 2) {
    return 'warning';
  }
  return 'normal';
};

export const getAlertColor = (type) => {
  switch (type) {
    case 'temp_high':
      return '#ff0000';
    case 'humidity_high':
      return '#00aaff';
    case 'vibration_high':
      return '#ff8800';
    default:
      return '#999999';
  }
};

export const formatAlertType = (type) => {
  switch (type) {
    case 'temp_high':
      return 'Alta Temperatura';
    case 'humidity_high':
      return 'Alta Humedad';
    case 'vibration_high':
      return 'Alta Vibración';
    default:
      return type;
  }
};