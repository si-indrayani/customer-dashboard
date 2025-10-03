import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useGetGameEngagementQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { 
  Gamepad2, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Play, 
  CheckCircle, 
  Award,
  BarChart3
} from 'lucide-react';
import './GameEngagement.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
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

const GameEngagement: React.FC = () => {
  const { tenantId, dateRange } = useOutletContext<AnalyticsContextType>();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGameId] = useState('word-puzzle-pro'); // Could be dynamic in the future

  const {
    data: engagementData,
    error,
    isLoading
  } = useGetGameEngagementQuery({
    tenantId,
    gameId: selectedGameId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  // All hooks must be called at the top level - before any conditional returns
  const animatedTotalSessions = useAnimatedCounter(engagementData?.data.summary?.total_sessions || 0, 1500);
  const animatedCompletedSessions = useAnimatedCounter(engagementData?.data.summary?.completed_sessions || 0, 1500);
  const animatedSessionDuration = useAnimatedCounter(Math.round((engagementData?.data.summary?.avg_session_duration_ms || 0) / 1000), 1500);
  const animatedCompletionRate = useAnimatedCounter(Math.round((engagementData?.data.summary?.completion_rate || 0) * 100), 1500);
  const animatedQuestionsPerSession = useAnimatedCounter(Math.round(engagementData?.data.summary?.avg_questions_per_session || 0), 1500);

  // Set visibility when data is loaded
  useEffect(() => {
    if (engagementData && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [engagementData, isLoading]);

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
            weight: 'normal',
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
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="game-engagement loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading game engagement analytics...</p>
        </div>
      </div>
    );
  }

  // Return error state only if no data is available
  if (!engagementData) {
    return (
      <div className="game-engagement error">
        <div className="error-message">
          <h3>Failed to Load Game Engagement Data</h3>
          <p>{error ? (typeof error === 'string' ? error : 'API Error') : 'No data available'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Prepare chart data (after we know engagementData exists)
  const hasTimeseriesData = engagementData.data.timeseries && engagementData.data.timeseries.length > 0;
  const hasBreakdownData = engagementData.data.breakdown && engagementData.data.breakdown.length > 0;
  const hasSummaryData = engagementData.data.summary && (engagementData.data.summary.total_sessions > 0);
  
  // If no timeseries data, create a simple completion vs abandoned breakdown chart
  const chartData = {
    labels: hasTimeseriesData 
      ? engagementData.data.timeseries.map((item: any) => formatDate(item.date || item.timestamp))
      : hasBreakdownData
        ? engagementData.data.breakdown.map((item: any) => item.category.charAt(0).toUpperCase() + item.category.slice(1))
        : ['No Data'],
    datasets: hasTimeseriesData ? [
      {
        label: 'Sessions',
        data: engagementData.data.timeseries.map((item: any) => item.sessions || item.value || 0),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Completion Rate (%)', 
        data: engagementData.data.timeseries.map((item: any) => (item.completion_rate || 0) * 100),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
    ] : hasBreakdownData ? [
      {
        label: 'Sessions',
        data: engagementData.data.breakdown.map((item: any) => item.value),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',   // Green for completed
          'rgba(239, 68, 68, 0.8)',    // Red for abandoned
        ],
        borderColor: [
          '#10b981', '#ef4444'
        ],
        borderWidth: 2,
      },
    ] : [
      {
        label: 'No Data',
        data: [0],
        backgroundColor: 'rgba(107, 114, 128, 0.3)',
        borderColor: '#6b7280',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`game-engagement ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="engagement-header">
        <div className="header-content">
          <h2>
            <Gamepad2 size={24} />
            Game Engagement Analytics
          </h2>
          <p className="header-subtitle">
            Detailed engagement metrics for {selectedGameId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {error && (
              <span>⚠️ {typeof error === 'string' ? error : 'API Error'}</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-sessions">
            <Play size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalSessions.toLocaleString()}</div>
            <div className="stat-label">Total Sessions</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Sessions started' : 'No sessions yet'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-sessions">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedCompletedSessions.toLocaleString()}</div>
            <div className="stat-label">Completed Sessions</div>
            <div className="stat-change positive">
              {hasSummaryData ? 'Successfully finished' : 'No completions yet'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon session-time">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedSessionDuration}s</div>
            <div className="stat-label">Avg Session Duration</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Time per session' : 'No data available'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completion-rate">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedCompletionRate}%</div>
            <div className="stat-label">Completion Rate</div>
            <div className="stat-change positive">
              {hasSummaryData ? 'Success rate' : 'No completions tracked'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon questions-per-session">
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedQuestionsPerSession}</div>
            <div className="stat-label">Avg Questions/Session</div>
            <div className="stat-change neutral">
              {hasSummaryData ? 'Questions answered' : 'No questions tracked'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="engagement-chart-container">
        <div className="chart-header">
          <h3>Engagement Trend</h3>
          <div className="chart-subtitle">Daily engagement score and completion rates over time</div>
        </div>
        <div className="chart-wrapper" style={{ height: '400px' }}>
          {hasTimeseriesData || hasBreakdownData ? (
            hasTimeseriesData ? (
              <Line data={chartData} options={chartOptions} />
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
                <div>📊 Breakdown View Available</div>
                <div style={{ fontSize: '14px' }}>
                  No timeseries data for chart, but breakdown data is shown below
                </div>
              </div>
            )
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              No engagement data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Session Breakdown */}
      {hasBreakdownData && (
        <div className="breakdown-container">
          <div className="breakdown-header">
            <h3>Session Breakdown</h3>
            <div className="breakdown-subtitle">Distribution of completed vs abandoned sessions</div>
          </div>
          <div className="breakdown-grid">
            {engagementData.data.breakdown.map((item: any, index: number) => (
              <div key={index} className="breakdown-card">
                <div className={`breakdown-icon ${item.category}`}>
                  {item.category === 'completed' ? <CheckCircle size={18} /> : <Target size={18} />}
                </div>
                <div className="breakdown-content">
                  <div className="breakdown-value">{item.value.toLocaleString()}</div>
                  <div className="breakdown-label">{item.category.charAt(0).toUpperCase() + item.category.slice(1)} Sessions</div>
                  <div className="breakdown-percentage">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {!hasSummaryData && !hasTimeseriesData && !hasBreakdownData && (
        <div className="empty-state-container">
          <div className="empty-state-content">
            <div className="empty-state-icon">🎮</div>
            <h3>No Engagement Data Available</h3>
            <p>
              Game engagement data will appear once users start playing sessions for the selected game and date range.
            </p>
            <div className="empty-state-info">
              <small>
                Game: {selectedGameId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} | 
                Period: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameEngagement;
