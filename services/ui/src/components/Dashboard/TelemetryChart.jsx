import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';

const TelemetryChart = ({ data }) => {
  // Prepare data for chart (last 20 entries for clarity)
  const chartData = data.slice(-20).map(entry => ({
    name: new Date(entry.ts).toLocaleTimeString(),
    temp: entry.temp,
    humidity: entry.humidity,
    vibration: entry.vibration
  }));

  return (
    <Card>
      <CardHeader title="Telemetría en Tiempo Real" />
      <CardContent>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#ff0000" 
                name="Temperatura (°C)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#00aaff" 
                name="Humedad (%)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="vibration" 
                stroke="#00cc00" 
                name="Vibración (G)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;