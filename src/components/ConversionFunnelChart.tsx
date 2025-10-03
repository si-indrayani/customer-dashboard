import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useGetConversionFunnelQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ConversionFunnelChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ConversionFunnelChartProps {
  tenantId: string;
  height?: string;
  dateRange: {
    from: string;
    to: string;
  };
}

const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ 
  tenantId, 
  height = '300px',
  dateRange
}) => {
  const navigate = useNavigate();

  const {
    data: funnelData,
    error,
    isLoading
  } = useGetConversionFunnelQuery({
    tenantId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const handleChartClick = () => {
    navigate('/analytics/conversion-funnel');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="conversion-funnel-chart-card">
        <div className="chart-header">
          <h3>🔄 Conversion Funnel</h3>
          <div className="chart-subtitle">Loading conversion data...</div>
        </div>
        <div className="chart-content" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="conversion-funnel-chart-card error-state">
        <div className="chart-header">
          <h3>🔄 Conversion Funnel</h3>
          <div className="chart-subtitle">Failed to load conversion data</div>
        </div>
        <div className="chart-content" style={{ height }}>
          <div className="error-message">
            <p>Unable to fetch conversion data</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare funnel data from API response structure
  const summary = funnelData?.data?.summary || {};
  const steps = [
    { name: 'Hub Visits', users: summary.hub_visits || 0 },
    { name: 'Game Starts', users: summary.game_starts || 0 },
    { name: 'Game Completions', users: summary.game_completions || 0 }
  ];
  const hasFunnelData = summary.hub_visits > 0;
  
  // Create funnel visualization data
  const chartData = {
    labels: steps.map((step: any) => step.name),
    datasets: [
      {
        label: 'Users',
        data: steps.map((step: any) => step.users),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(168, 85, 247, 0.8)',   // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(59, 130, 246, 0.8)',   // Blue
        ],
        borderColor: [
          '#6366f1', '#a855f7', '#ec4899', '#fb923c', '#22c55e', '#3b82f6'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const totalUsers = steps[0]?.users || 1;
            const percentage = totalUsers > 0 
              ? ((context.parsed.y / totalUsers) * 100).toFixed(1)
              : '0.0';
            return `Users: ${context.parsed.y.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Calculate conversion rate from summary data
  const overallConversionRate = summary.overall_conversion_rate 
    ? (summary.overall_conversion_rate * 100).toFixed(1)
    : '0.0';

  return (
    <div className="conversion-funnel-chart-card" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>🔄 Conversion Funnel</h3>
        <div className="chart-subtitle">
          {hasFunnelData 
            ? `Overall conversion: ${overallConversionRate}%` 
            : 'No conversion data available'
          }
        </div>
      </div>
      <div className="chart-content" style={{ height }}>
        {hasFunnelData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            <div className="no-data-content">
              <div className="no-data-icon">🔄</div>
              <p>No hub visits detected</p>
              <small>Visits: {summary.hub_visits || 0} • Starts: {summary.game_starts || 0} • Completions: {summary.game_completions || 0}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionFunnelChart;
