import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useData } from '../contexts/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = () => {
  const { telemetryData, loading } = useData();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  });

  // Update chart data when telemetry data changes
  useEffect(() => {
    if (telemetryData && telemetryData.length > 0 && !loading) {
      // Use the timestamp from the first data point to represent the current update time
      const currentTimestamp = new Date().toLocaleTimeString();
      // Calculate average temperature if multiple packages exist
      const avgTemp = telemetryData.length > 0 
        ? telemetryData.reduce((sum, item) => sum + item.temperature, 0) / telemetryData.length
        : 0;
      
      // Update chart data
      setChartData(prevData => {
        // Only add new data point if it's different from the last one to prevent duplicates
        if (prevData.labels.length > 0 && prevData.labels[prevData.labels.length - 1] === currentTimestamp) {
          return prevData; // Return previous data if timestamp is the same (avoid duplicate points)
        }
        
        const newLabels = [...prevData.labels.slice(-9), currentTimestamp]; // Keep last 10 points
        const newData = [...prevData.datasets[0].data.slice(-9), avgTemp];
        
        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            }
          ]
        };
      });
    }
  }, [telemetryData, loading]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperatura en Tiempo Real',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
        min: 0,
        max: 10,
      },
    },
    animation: {
      duration: 300, // Animation duration in milliseconds
    },
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Seguimiento de Temperatura</h5>
      </Card.Header>
      <Card.Body>
        <Line ref={chartRef} options={options} data={chartData} />
      </Card.Body>
    </Card>
  );
};

export default TemperatureChart;