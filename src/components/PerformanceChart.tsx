import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useGetPerformanceAnalyticsQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PerformanceChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  dateRange: {
    from: string;
    to: string;
  };
  tenantId: string;
  height?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  dateRange, 
  tenantId,
  height = '300px' 
}) => {
  const navigate = useNavigate();
  
  const {
    data: performanceData,
    error,
    isLoading
  } = useGetPerformanceAnalyticsQuery({
    tenantId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const handleChartClick = () => {
    navigate('/analytics/performance');
  };

  if (isLoading) {
    return (
      <div className="performance-chart loading">
        <div className="chart-header">
          <h3>Performance Analytics</h3>
          <div className="chart-subtitle">Loading performance data...</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading performance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-chart error">
        <div className="chart-header">
          <h3>Performance Analytics</h3>
          <div className="chart-subtitle">Failed to load performance data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load performance data</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have data
  const hasTimeseriesData = performanceData?.data?.timeseries && performanceData.data.timeseries.length > 0;
  const hasSummaryData = performanceData?.data?.summary && (
    performanceData.data.summary.total_questions > 0 || 
    performanceData.data.summary.correct_answers > 0 ||
    performanceData.data.summary.overall_accuracy > 0
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
      ? performanceData.data.timeseries.map((item: any) => formatDate(item.date || item.timestamp))
      : hasSummaryData
        ? ['Accuracy', 'Response Time', 'Questions', 'Correct', 'Hints']
        : ['No Data'],
    datasets: [
      {
        label: hasTimeseriesData 
          ? 'Performance Metrics' 
          : 'Summary Data',
        data: hasTimeseriesData 
          ? performanceData.data.timeseries.map((item: any) => item.accuracy ? (item.accuracy * 100) : (item.value || 0))
          : hasSummaryData
            ? [
                (performanceData.data.summary.overall_accuracy * 100) || 0,
                Math.min(performanceData.data.summary.avg_response_time_ms / 10, 100) || 0, // Scale response time to fit chart
                Math.min(performanceData.data.summary.total_questions / 10, 100) || 0, // Scale for visualization
                Math.min(performanceData.data.summary.correct_answers / 10, 100) || 0, // Scale for visualization
                (performanceData.data.summary.hint_usage_rate * 100) || 0
              ]
            : [0],
        backgroundColor: hasTimeseriesData
          ? 'rgba(34, 197, 94, 0.8)'
          : [
              'rgba(34, 197, 94, 0.8)',    // Green for accuracy
              'rgba(59, 130, 246, 0.8)',   // Blue for response time
              'rgba(139, 92, 246, 0.8)',   // Purple for questions
              'rgba(16, 185, 129, 0.8)',   // Teal for correct answers
              'rgba(245, 158, 11, 0.8)',   // Orange for hints
            ],
        borderColor: hasTimeseriesData
          ? '#22c55e'
          : ['#22c55e', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
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
              return `Accuracy: ${context.parsed.y.toFixed(1)}%`;
            } else if (hasSummaryData) {
              const labels = ['Accuracy (%)', 'Response Time (scaled)', 'Questions (scaled)', 'Correct (scaled)', 'Hint Usage (%)'];
              const label = labels[context.dataIndex] || 'Value';
              return `${label}: ${context.parsed.y.toFixed(1)}`;
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
            return value + 'ms';
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
    <div className="performance-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>⚡ Performance Analytics</h3>
        <div className="chart-subtitle">
          {hasSummaryData ? 
            `${((performanceData.data.summary.overall_accuracy || 0) * 100).toFixed(1)}% accuracy, ${performanceData.data.summary.avg_response_time_ms || 0}ms avg response` : 
            'Click for detailed view'
          }
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        {hasTimeseriesData || hasSummaryData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            <div className="no-data-content">
              <div className="no-data-icon">⚡</div>
              <p>No performance data available</p>
              <small>Click to view detailed analytics</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
