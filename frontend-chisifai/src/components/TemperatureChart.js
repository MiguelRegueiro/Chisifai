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
  Filler
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
  Filler,
  annotationPlugin
);

const TemperatureChart = () => {
  const { loading, temperatureData } = useData();
  const chartRef = useRef(null);
  const [lastKnownData, setLastKnownData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  // Update last known data when temperature data changes
  useEffect(() => {
    if (temperatureData && temperatureData.length > 0 && !loading) {
      setLastKnownData(temperatureData);
    }
  }, [temperatureData, loading]);

  // Use last known data to draw chart even during loading
  useEffect(() => {
    const dataToUse = loading ? lastKnownData : temperatureData;
    
    // Always ensure there's some data for the chart
    if (dataToUse && dataToUse.length > 0) {
      // Get the last 10 temperature readings
      const recentData = dataToUse.slice(-10);
      const labels = recentData.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const temperatures = recentData.map(item => item.value);
      
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: temperatures,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
            label: 'Temperatura (°C)',
            data: [null],
            borderColor: 'rgb(200, 200, 200)',
            backgroundColor: 'rgba(200, 200, 200, 0.5)',
            tension: 0.1,
            fill: false,
          }
        ],
      });
    }
  }, [lastKnownData, temperatureData, loading]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Temperatura',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
        min: 15,
        max: 35,
        suggestedMax: 35,
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
        criticalTemp: {
          type: 'line',
          yMin: 26,
          yMax: 26,
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 2,
          borderDash: [6, 6],
          label: {
            display: true,
            content: 'Límite Crítico (26°C)',
            position: 'start',
          }
        },
        safeTemp: {
          type: 'line',
          yMin: 24,
          yMax: 24,
          borderColor: 'rgb(0, 255, 0)',
          borderWidth: 2,
          borderDash: [6, 6],
          label: {
            display: true,
            content: 'Rango Seguro (24°C)',
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
        <h5 className="mb-0">Seguimiento de Temperatura</h5>
      </Card.Header>
      <Card.Body style={{ height: '300px' }}>
        <Line ref={chartRef} options={options} data={chartData} />
      </Card.Body>
    </Card>
  );
};

export default TemperatureChart;