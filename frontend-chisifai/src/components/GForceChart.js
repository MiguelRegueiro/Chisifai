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
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useData } from '../contexts/DataContext';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const GForceChart = () => {
  const { gforceData, loading } = useData();
  const chartRef = useRef(null);
  const [lastKnownData, setLastKnownData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Fuerza G',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  // Update last known data when gforce data changes
  useEffect(() => {
    if (gforceData && gforceData.length > 0 && !loading) {
      setLastKnownData(gforceData);
    }
  }, [gforceData, loading]);

  // Use last known data to draw chart even during loading
  useEffect(() => {
    const dataToUse = loading ? lastKnownData : gforceData;
    
    // Always ensure there's some data for the chart
    if (dataToUse && dataToUse.length > 0) {
      // Get the last 10 g-force readings
      const recentData = dataToUse.slice(-10);
      const labels = recentData.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const gforces = recentData.map(item => item.value);
      
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Fuerza G',
            data: gforces,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.1,
            fill: false,
          }
        ],
      });
    } else {
      // Provide default "empty" chart data to avoid errors
      setChartData({
        labels: ['Sin datos'],
        datasets: [
          {
            label: 'Fuerza G',
            data: [null],
            borderColor: 'rgb(200, 200, 200)',
            backgroundColor: 'rgba(200, 200, 200, 0.5)',
            tension: 0.1,
            fill: false,
          }
        ],
      });
    }
  }, [lastKnownData, gforceData, loading]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Fuerza G',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Fuerza G',
        },
        min: 0,
        max: 4,
        suggestedMax: 4,
      },
      x: {
        title: {
          display: true,
          text: 'Tiempo',
        }
      }
    },
    annotation: {
      annotations: {
        criticalGForce: {
          type: 'line',
          yMin: 2.5,
          yMax: 2.5,
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 2,
          borderDash: [6, 6],
          label: {
            display: true,
            content: 'Límite Crítico (2.5G)',
            position: 'start',
          }
        }
      }
    },
    animation: {
      duration: 300, // Animation duration in milliseconds
    },
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Seguimiento de Fuerza G</h5>
      </Card.Header>
      <Card.Body style={{ height: '300px' }}>
        <Line ref={chartRef} options={options} data={chartData} />
      </Card.Body>
    </Card>
  );
};

export default GForceChart;