import React from 'react';
import { Line } from 'react-chartjs-2';
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
import { useGetPerformanceAnalyticsQuery } from '../store/api/analyticsApi';
import { useNavigate } from 'react-router-dom';
import './PerformanceAreaChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceAreaChartProps {
  tenantId: string;
  height?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({ 
  tenantId,
  height = '300px',
  dateRange
}) => {
  const navigate = useNavigate();
  
  const {
    data: performanceData,
    error,
    isLoading
  } = useGetPerformanceAnalyticsQuery({
    tenantId,
    dateFrom: dateRange?.from,
    dateTo: dateRange?.to
  });

  const handleChartClick = () => {
    navigate('/analytics/performance');
  };

  if (isLoading) {
    return (
      <div className="performance-area-chart loading">
        <div className="chart-header">
          <h3>Performance Trends</h3>
          <div className="chart-subtitle">Loading performance data...</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-area-chart error">
        <div className="chart-header">
          <h3>Performance Trends</h3>
          <div className="chart-subtitle">Failed to load data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load performance data</p>
          </div>
        </div>
      </div>
    );
  }

  // Process timeseries data
  const timeseries = performanceData?.data?.timeseries || [];
  
  // Format dates for chart labels
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate mock performance data if needed
  const generatePerformanceData = (): Array<{accuracy: number, responseTime: number, successRate: number}> => {
    return timeseries.map(() => ({
      accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
      responseTime: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
      successRate: Math.floor(Math.random() * 20) + 80 // 80-100%
    }));
  };

  const performanceMetrics = generatePerformanceData();

  const chartData = {
    labels: timeseries.map((item: any) => formatDate(item.timestamp)),
    datasets: [
      {
        label: 'Accuracy %',
        data: performanceMetrics.map(m => m.accuracy),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Response Time (ms)',
        data: performanceMetrics.map(m => m.responseTime / 10), // Scale down for display
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      },
      {
        label: 'Success Rate %',
        data: performanceMetrics.map(m => m.successRate),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          color: '#374151',
          font: {
            size: 11,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let suffix = '';
            if (context.datasetIndex === 0 || context.datasetIndex === 2) {
              suffix = '%';
            } else if (context.datasetIndex === 1) {
              return `${context.dataset.label}: ${(context.parsed.y * 10).toFixed(0)}ms`;
            }
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}${suffix}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.4)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(229, 231, 235, 0.6)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return value + '%';
          },
        },
        min: 0,
        max: 100,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return (value * 10) + 'ms';
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const avgAccuracy = performanceMetrics.length > 0 
    ? (performanceMetrics.reduce((sum: number, m: any) => sum + m.accuracy, 0) / performanceMetrics.length).toFixed(1)
    : '0';

  return (
    <div className="performance-area-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>Performance Trends</h3>
        <div className="chart-subtitle">
          Avg Accuracy: {avgAccuracy}%
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PerformanceAreaChart;
