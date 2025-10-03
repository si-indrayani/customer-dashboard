import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useGetGameEngagementQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './GameEngagementChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GameEngagementChartProps {
  dateRange: {
    from: string;
    to: string;
  };
  gameId?: string;
  tenantId: string;
  height?: string;
}

const GameEngagementChart: React.FC<GameEngagementChartProps> = ({ 
  dateRange, 
  gameId = 'word-puzzle-pro', 
  tenantId,
  height = '300px' 
}) => {
  const navigate = useNavigate();
  
  const {
    data: engagementData,
    error,
    isLoading
  } = useGetGameEngagementQuery({
    tenantId,
    gameId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const handleChartClick = () => {
    navigate('/analytics/game-engagement');
  };

  if (isLoading) {
    return (
      <div className="game-engagement-chart loading">
        <div className="chart-header">
          <h3>Game Engagement</h3>
          <div className="chart-subtitle">Loading engagement data...</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading game engagement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-engagement-chart error">
        <div className="chart-header">
          <h3>Game Engagement</h3>
          <div className="chart-subtitle">Failed to load engagement data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load engagement data</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have data
  const hasTimeseriesData = engagementData?.data?.timeseries && engagementData.data.timeseries.length > 0;
  const hasBreakdownData = engagementData?.data?.breakdown && engagementData.data.breakdown.length > 0;
  const hasSummaryData = engagementData?.data?.summary && (
    engagementData.data.summary.total_sessions > 0 || 
    engagementData.data.summary.completed_sessions > 0
  );

  // Format dates for chart labels
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Create chart data based on available data
  const chartData = {
    labels: hasTimeseriesData 
      ? engagementData.data.timeseries.map((item: any) => formatDate(item.date || item.timestamp))
      : hasBreakdownData
        ? engagementData.data.breakdown.map((item: any) => item.category.charAt(0).toUpperCase() + item.category.slice(1))
        : hasSummaryData
          ? ['Total Sessions', 'Completed', 'Completion Rate (%)']
          : ['No Data'],
    datasets: [
      {
        label: hasTimeseriesData 
          ? 'Sessions' 
          : hasBreakdownData 
            ? 'Session Count'
            : 'Summary Data',
        data: hasTimeseriesData 
          ? engagementData.data.timeseries.map((item: any) => item.sessions || item.value || 0)
          : hasBreakdownData
            ? engagementData.data.breakdown.map((item: any) => item.value)
            : hasSummaryData
              ? [
                  engagementData.data.summary.total_sessions,
                  engagementData.data.summary.completed_sessions,
                  (engagementData.data.summary.completion_rate * 100) || 0
                ]
              : [0],
        backgroundColor: hasTimeseriesData
          ? 'rgba(139, 92, 246, 0.8)'
          : hasBreakdownData
            ? [
                'rgba(16, 185, 129, 0.8)',   // Green for completed
                'rgba(239, 68, 68, 0.8)',    // Red for abandoned
              ]
            : [
                'rgba(99, 102, 241, 0.8)',   // Blue for total
                'rgba(16, 185, 129, 0.8)',   // Green for completed  
                'rgba(139, 92, 246, 0.8)',   // Purple for rate
              ],
        borderColor: hasTimeseriesData
          ? '#8b5cf6'
          : hasBreakdownData
            ? ['#10b981', '#ef4444']
            : ['#6366f1', '#10b981', '#8b5cf6'],
        borderWidth: 2,
        borderRadius: 4,
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
            if (hasTimeseriesData) {
              return `Sessions: ${context.parsed.y.toLocaleString()}`;
            } else if (hasBreakdownData) {
              return `${context.label}: ${context.parsed.y.toLocaleString()} sessions`;
            } else if (hasSummaryData) {
              const labels = ['Total Sessions', 'Completed', 'Completion Rate (%)'];
              const label = labels[context.dataIndex] || 'Value';
              if (label.includes('Rate')) {
                return `${label}: ${context.parsed.y.toFixed(1)}%`;
              }
              return `${label}: ${context.parsed.y.toLocaleString()}`;
            }
            return `Value: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return value + '%';
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

  return (
    <div className="game-engagement-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>🎮 Game Engagement</h3>
        <div className="chart-subtitle">
          {hasSummaryData ? 
            `${engagementData.data.summary.total_sessions} sessions, ${(engagementData.data.summary.completion_rate * 100).toFixed(1)}% completion` : 
            'Click for detailed view'
          }
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        {hasTimeseriesData || hasBreakdownData || hasSummaryData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            <div className="no-data-content">
              <div className="no-data-icon">🎮</div>
              <p>No engagement data available</p>
              <small>Click to view detailed analytics</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEngagementChart;
