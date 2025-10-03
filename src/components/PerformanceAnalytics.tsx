import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { useGetPerformanceAnalyticsQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  Zap, 
  Clock, 
  Target,
  HelpCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import './PerformanceAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsContextType {
  tenantId: string;
  dateRange: {
    from: string;
    to: string;
  };
}

// Animated counter hook for smooth number animations
const useAnimatedCounter = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - startCount) + startCount));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return count;
};

const PerformanceAnalytics: React.FC = () => {
  const { tenantId, dateRange } = useOutletContext<AnalyticsContextType>();
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: performanceData,
    error,
    isLoading
  } = useGetPerformanceAnalyticsQuery({
    tenantId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  // All hooks must be called at the top level - before any conditional returns
  const animatedAccuracy = useAnimatedCounter(Math.round((performanceData?.data.summary?.overall_accuracy || 0) * 100), 1500);
  const animatedResponseTime = useAnimatedCounter(performanceData?.data.summary?.avg_response_time_ms || 0, 1500);
  const animatedTotalQuestions = useAnimatedCounter(performanceData?.data.summary?.total_questions || 0, 1500);
  const animatedCorrectAnswers = useAnimatedCounter(performanceData?.data.summary?.correct_answers || 0, 1500);
  const animatedHintUsage = useAnimatedCounter(Math.round((performanceData?.data.summary?.hint_usage_rate || 0) * 100), 1500);

  // Set visibility when data is loaded
  useEffect(() => {
    if (performanceData && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [performanceData, isLoading]);

  // Format dates for chart labels
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: '#374151',
          font: {
            size: 14,
            weight: 'normal' as const,
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
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}ms`;
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
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            if (hasTimeseriesData) {
              return value.toFixed(1) + '%';
            } else {
              return value.toFixed(1);
            }
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="performance-analytics loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading performance analytics...</p>
        </div>
      </div>
    );
  }

  // Return error state only if no data is available
  if (!performanceData) {
    return (
      <div className="performance-analytics error">
        <div className="error-message">
          <h3>Failed to Load Performance Data</h3>
          <p>{error ? (typeof error === 'string' ? error : 'API Error') : 'No data available'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Prepare chart data (after we know performanceData exists)
  const hasTimeseriesData = performanceData.data.timeseries && performanceData.data.timeseries.length > 0;
  const hasSummaryData = performanceData.data.summary && (
    performanceData.data.summary.total_questions > 0 || 
    performanceData.data.summary.correct_answers > 0 ||
    performanceData.data.summary.overall_accuracy > 0
  );
  
  // Create chart data based on available data
  const chartData = {
    labels: hasTimeseriesData 
      ? performanceData.data.timeseries.map((item: any) => formatDate(item.date || item.timestamp))
      : hasSummaryData
        ? ['Accuracy (%)', 'Response Time (ms)', 'Total Questions', 'Correct Answers', 'Hint Usage (%)']
        : ['No Data'],
    datasets: [
      {
        label: hasTimeseriesData 
          ? 'Accuracy (%)' 
          : 'Performance Metrics',
        data: hasTimeseriesData 
          ? performanceData.data.timeseries.map((item: any) => (item.accuracy || item.overall_accuracy || 0) * 100)
          : hasSummaryData
            ? [
                (performanceData.data.summary.overall_accuracy * 100) || 0,
                performanceData.data.summary.avg_response_time_ms || 0,
                performanceData.data.summary.total_questions || 0,
                performanceData.data.summary.correct_answers || 0,
                (performanceData.data.summary.hint_usage_rate * 100) || 0
              ]
            : [0],
        borderColor: '#22c55e',
        backgroundColor: hasTimeseriesData 
          ? 'rgba(34, 197, 94, 0.1)'
          : [
              'rgba(34, 197, 94, 0.8)',    // Green for accuracy
              'rgba(59, 130, 246, 0.8)',   // Blue for response time
              'rgba(139, 92, 246, 0.8)',   // Purple for questions
              'rgba(16, 185, 129, 0.8)',   // Teal for correct answers
              'rgba(245, 158, 11, 0.8)',   // Orange for hints
            ],
        borderWidth: 3,
        fill: hasTimeseriesData,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#22c55e',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  return (
    <div className={`performance-analytics ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="performance-header">
        <div className="header-content">
          <h2>
            <Zap size={24} />
            Performance Analytics
          </h2>
          <p className="header-subtitle">
            System performance metrics and monitoring data
            {error && (
              <span>⚠️ {typeof error === 'string' ? error : 'API Error'}</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon accuracy">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedAccuracy}%</div>
            <div className="stat-label">Overall Accuracy</div>
            <div className="stat-change positive">
              {hasSummaryData ? 'Answer accuracy rate' : 'No data available'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon response-time">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedResponseTime}ms</div>
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Time per response' : 'No timing data'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-questions">
            <HelpCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalQuestions.toLocaleString()}</div>
            <div className="stat-label">Total Questions</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Questions attempted' : 'No questions tracked'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon correct-answers">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedCorrectAnswers.toLocaleString()}</div>
            <div className="stat-label">Correct Answers</div>
            <div className="stat-change positive">
              {hasSummaryData ? 'Successfully answered' : 'No correct answers'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hint-usage">
            <Lightbulb size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedHintUsage}%</div>
            <div className="stat-label">Hint Usage Rate</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Hints requested' : 'No hints tracked'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="performance-chart-container">
        <div className="chart-header">
          <h3>Performance Overview</h3>
          <div className="chart-subtitle">
            {hasTimeseriesData ? 'Performance metrics over time' : 
             hasSummaryData ? 'Current performance summary metrics' : 
             'Performance data visualization'}
          </div>
        </div>
        <div className="chart-wrapper" style={{ height: '400px' }}>
          {hasTimeseriesData || hasSummaryData ? (
            hasTimeseriesData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280',
              fontSize: '16px',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>📊 No Performance Data Available</div>
              <div style={{ fontSize: '14px' }}>
                Performance metrics will appear once questions are answered and timing data is collected
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      {hasSummaryData && (
        <div className="performance-summary-container">
          <div className="summary-header">
            <h3>Performance Summary</h3>
            <div className="summary-subtitle">Key performance indicators and metrics</div>
          </div>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon accuracy">
                <Target size={18} />
              </div>
              <div className="summary-content">
                <div className="summary-value">{((performanceData.data.summary.overall_accuracy || 0) * 100).toFixed(1)}%</div>
                <div className="summary-label">Overall Accuracy</div>
                <div className="summary-detail">
                  {performanceData.data.summary.correct_answers}/{performanceData.data.summary.total_questions} correct
                </div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon response-time">
                <Clock size={18} />
              </div>
              <div className="summary-content">
                <div className="summary-value">{performanceData.data.summary.avg_response_time_ms || 0}ms</div>
                <div className="summary-label">Response Time</div>
                <div className="summary-detail">Average time per response</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {!hasSummaryData && !hasTimeseriesData && (
        <div className="empty-state-container">
          <div className="empty-state-content">
            <div className="empty-state-icon">⚡</div>
            <h3>No Performance Data Available</h3>
            <p>
              Performance analytics will appear once users start answering questions and system metrics are collected.
            </p>
            <div className="empty-state-info">
              <small>
                Period: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;
