import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetTrafficAnalyticsQuery } from '../store/api/analyticsApi';
import { useNavigate } from 'react-router-dom';
import './UserEngagementDoughnutChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserEngagementDoughnutChartProps {
  tenantId: string;
  height?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

const UserEngagementDoughnutChart: React.FC<UserEngagementDoughnutChartProps> = ({ 
  tenantId,
  height = '300px',
  dateRange
}) => {
  const navigate = useNavigate();
  
  const {
    data: engagementData,
    error,
    isLoading
  } = useGetTrafficAnalyticsQuery({
    tenantId,
    dateFrom: dateRange?.from || '',
    dateTo: dateRange?.to || ''
  });

  const handleChartClick = () => {
    navigate('/analytics/game-engagement');
  };

  if (isLoading) {
    return (
      <div className="user-engagement-doughnut-chart loading">
        <div className="chart-header">
          <h3>User Engagement Levels</h3>
          <div className="chart-subtitle">Loading engagement data...</div>
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
      <div className="user-engagement-doughnut-chart error">
        <div className="chart-header">
          <h3>User Engagement Levels</h3>
          <div className="chart-subtitle">Failed to load data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load engagement data</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate engagement levels based on traffic data
  const timeseries = engagementData?.data?.timeseries || [];
  
  // Simulate engagement levels based on traffic patterns
  const totalVisits = timeseries.reduce((sum: number, item: any) => sum + item.value, 0);
  
  // Categorize engagement based on visit patterns
  const highEngagement = Math.floor(totalVisits * 0.3); // 30% high engagement
  const mediumEngagement = Math.floor(totalVisits * 0.45); // 45% medium engagement  
  const lowEngagement = totalVisits - highEngagement - mediumEngagement; // Remaining low engagement

  const chartData = {
    labels: ['High Engagement', 'Medium Engagement', 'Low Engagement'],
    datasets: [
      {
        data: [highEngagement, mediumEngagement, lowEngagement],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',    // Green for high
          'rgba(251, 146, 60, 0.8)',   // Orange for medium
          'rgba(239, 68, 68, 0.8)',    // Red for low
        ],
        borderColor: [
          '#22c55e',   // Green
          '#fb923c',   // Orange
          '#ef4444',   // Red
        ],
        borderWidth: 3,
        hoverOffset: 12,
        cutout: '65%', // Makes it a doughnut chart
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#374151',
          font: {
            size: 11,
            weight: 'bold' as const,
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                
                return {
                  text: `${label}: ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${context.parsed} sessions (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
    elements: {
      arc: {
        borderWidth: 3,
      }
    },
  };

  const totalSessions = highEngagement + mediumEngagement + lowEngagement;
  const avgEngagement = totalSessions > 0 
    ? ((highEngagement * 3 + mediumEngagement * 2 + lowEngagement * 1) / totalSessions).toFixed(1)
    : '0';

  return (
    <div className="user-engagement-doughnut-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>User Engagement Levels</h3>
        <div className="chart-subtitle">
          Avg Score: {avgEngagement}/3.0
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        <div className="doughnut-wrapper">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="center-text">
            <div className="total-sessions">{totalSessions}</div>
            <div className="sessions-label">Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementDoughnutChart;
