import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useGetConversionFunnelQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  TrendingDown, 
  Users, 
  Target, 
  Percent, 
  RefreshCw,
  ArrowDown
} from 'lucide-react';
import './ConversionFunnelAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
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

const ConversionFunnelAnalytics: React.FC = () => {
  const { tenantId, dateRange } = useOutletContext<AnalyticsContextType>();
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: funnelData,
    error,
    isLoading,
    refetch
  } = useGetConversionFunnelQuery({
    tenantId,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  // All hooks must be called at the top level - before any conditional returns
  const summary = funnelData?.data?.summary || {};
  const timeseries = funnelData?.data?.timeseries || [];
  
  // Create funnel steps from the summary data
  const steps = [
    { name: 'Hub Visits', users: summary.hub_visits || 0, step_name: 'Hub Visits', user_count: summary.hub_visits || 0 },
    { name: 'Game Starts', users: summary.game_starts || 0, step_name: 'Game Starts', user_count: summary.game_starts || 0 },
    { name: 'Game Completions', users: summary.game_completions || 0, step_name: 'Game Completions', user_count: summary.game_completions || 0 }
  ];
  
  const totalUsers = summary.hub_visits || 0;
  const convertedUsers = summary.game_completions || 0;
  const overallConversion = summary.overall_conversion_rate ? summary.overall_conversion_rate * 100 : 0;
  const dropOffRate = totalUsers > 0 ? (((totalUsers - convertedUsers) / totalUsers) * 100) : 0;

  const animatedTotalUsers = useAnimatedCounter(totalUsers, 1500);
  const animatedConvertedUsers = useAnimatedCounter(convertedUsers, 1500);
  const animatedConversionRate = useAnimatedCounter(Math.round(overallConversion * 10) / 10, 1500);
  const animatedDropOffRate = useAnimatedCounter(Math.round(dropOffRate * 10) / 10, 1500);

  // Set visibility when data is loaded
  useEffect(() => {
    if (funnelData && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [funnelData, isLoading]);

  const handleRefresh = () => {
    refetch();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="conversion-funnel-analytics loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading conversion funnel analytics...</p>
        </div>
      </div>
    );
  }

  // Return error state only if no data is available
  if (!funnelData) {
    return (
      <div className="conversion-funnel-analytics error">
        <div className="error-message">
          <h3>Failed to Load Conversion Data</h3>
          <p>{error ? (typeof error === 'string' ? error : 'API Error') : 'No data available'}</p>
          <button onClick={handleRefresh}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have meaningful data (but still show UI regardless)
  const hasStepsData = steps && steps.length > 0 && totalUsers > 0;
  const hasTimeseriesData = timeseries && timeseries.length > 0;

  // Prepare funnel chart data
  const funnelChartData = {
    labels: steps.map((step: any, index: number) => 
      step.name || step.step_name || `Step ${index + 1}`
    ),
    datasets: [
      {
        label: 'Users',
        data: steps.map((step: any) => step.users || step.user_count || 0),
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
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Prepare timeseries chart data
  const timeseriesChartData = {
    labels: timeseries.map((item: any) => 
      new Date(item.date || item.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Conversion Rate',
        data: timeseries.map((item: any) => 
          (item.conversion_rate || item.rate || 0) * 100
        ),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Prepare drop-off distribution chart
  const dropOffData = steps.map((step: any, index: number) => {
    if (index === 0) return 0;
    const prevUsers = steps[index - 1]?.users || steps[index - 1]?.user_count || 0;
    const currUsers = step.users || step.user_count || 0;
    return prevUsers > 0 ? ((prevUsers - currUsers) / prevUsers) * 100 : 0;
  });

  const dropOffChartData = {
    labels: steps.slice(1).map((step: any, index: number) => 
      `${steps[index].name || steps[index].step_name || `Step ${index + 1}`} → ${step.name || step.step_name || `Step ${index + 2}`}`
    ),
    datasets: [
      {
        data: dropOffData.slice(1),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          '#ef4444', '#fb923c', '#f59e0b', '#22c55e', '#3b82f6'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            size: 12,
          },
          callback: function(value: any) {
            return value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
  };

  const timeseriesOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context: any) {
            return `Conversion Rate: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value: any) {
            return `${value}%`;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: '#374151',
          font: {
            size: 12,
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
            return `Drop-off: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className={`conversion-funnel-analytics ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="funnel-header">
        <div className="header-content">
          <h2>
            <TrendingDown size={24} />
            Conversion Funnel Analysis
          </h2>
          <p className="header-subtitle">
            API Response: Hub Visits: {summary.hub_visits || 0}, Game Starts: {summary.game_starts || 0}, Completions: {summary.game_completions || 0}, Timeseries: {timeseries.length}
            {error && (
              <span style={{ color: '#ef4444', marginLeft: '10px' }}>⚠️ {typeof error === 'string' ? error : 'API Error'}</span>
            )}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleRefresh} className="refresh-button">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-users">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalUsers.toLocaleString()}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-change neutral">
              Entered funnel
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon converted-users">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedConvertedUsers.toLocaleString()}</div>
            <div className="stat-label">Converted Users</div>
            <div className="stat-change positive">
              Completed funnel
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon conversion-rate">
            <Percent size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedConversionRate.toFixed(1)}%</div>
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-change positive">
              Overall success rate
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon drop-off">
            <TrendingDown size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedDropOffRate.toFixed(1)}%</div>
            <div className="stat-label">Drop-off Rate</div>
            <div className="stat-change negative">
              Users who left
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visit-to-play">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{((summary.visit_to_play_rate || 0) * 100).toFixed(1)}%</div>
            <div className="stat-label">Visit-to-Play Rate</div>
            <div className="stat-change neutral">
              Hub visits → Game starts
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon play-to-completion">
            <Percent size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{((summary.play_to_completion_rate || 0) * 100).toFixed(1)}%</div>
            <div className="stat-label">Play-to-Completion Rate</div>
            <div className="stat-change positive">
              Game starts → Completions
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Funnel Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Funnel Steps Breakdown</h3>
            <div className="chart-subtitle">User progression through each step</div>
          </div>
          <div className="chart-wrapper" style={{ height: '400px', position: 'relative' }}>
            <Bar data={funnelChartData} options={chartOptions} />
            {!hasStepsData && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#6b7280',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                No conversion data - All values are 0
              </div>
            )}
          </div>
        </div>

        {/* Timeseries Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Conversion Rate Trend</h3>
            <div className="chart-subtitle">Daily conversion rate over time</div>
          </div>
          <div className="chart-wrapper" style={{ height: '400px', position: 'relative' }}>
            {hasTimeseriesData ? (
              <Line data={timeseriesChartData} options={timeseriesOptions} />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                color: '#6b7280',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                No timeseries data - Empty array
              </div>
            )}
          </div>
        </div>

        {/* Drop-off Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Drop-off Distribution</h3>
            <div className="chart-subtitle">Where users leave the funnel</div>
          </div>
          <div className="chart-wrapper" style={{ height: '400px', position: 'relative' }}>
            {hasStepsData && steps.length > 1 ? (
              <Doughnut data={dropOffChartData} options={doughnutOptions} />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                color: '#6b7280',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                No drop-off data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Funnel Steps Details */}
      <div className="funnel-steps-container">
        <div className="list-header">
          <h3>Detailed Funnel Steps</h3>
          <div className="list-subtitle">Step-by-step conversion breakdown</div>
        </div>
        <div className="funnel-steps">
          {hasStepsData ? steps.map((step: any, index: number) => {
            const users = step.users || step.user_count || 0;
            const conversionFromPrevious = index > 0 && steps[index - 1] 
              ? ((users / (steps[index - 1].users || steps[index - 1].user_count || 1)) * 100)
              : 100;
            const conversionFromStart = totalUsers > 0 ? ((users / totalUsers) * 100) : 0;
            
            return (
              <div key={index} className="funnel-step">
                <div className="step-number">
                  <span>{index + 1}</span>
                </div>
                <div className="step-info">
                  <div className="step-name">
                    {step.name || step.step_name || `Step ${index + 1}`}
                  </div>
                  <div className="step-stats">
                    <Users size={14} />
                    <span>{users.toLocaleString()} users</span>
                    <span className="step-conversion">
                      ({conversionFromStart.toFixed(1)}% of total)
                    </span>
                  </div>
                </div>
                <div className="step-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${conversionFromStart}%` }}
                  />
                  <div className="progress-text">
                    {conversionFromStart.toFixed(1)}%
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-arrow">
                    <ArrowDown size={16} />
                    <span className="drop-off-rate">
                      {index > 0 ? `${(100 - conversionFromPrevious).toFixed(1)}% drop-off` : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          }) : (
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#374151' }}>Conversion Funnel API Response:</h4>
              <div style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>
                <div><strong>Summary:</strong></div>
                <ul style={{ marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Hub Visits: {summary.hub_visits || 0}</li>
                  <li>Game Starts: {summary.game_starts || 0}</li>
                  <li>Game Completions: {summary.game_completions || 0}</li>
                  <li>Visit-to-Play Rate: {((summary.visit_to_play_rate || 0) * 100).toFixed(1)}%</li>
                  <li>Play-to-Completion Rate: {((summary.play_to_completion_rate || 0) * 100).toFixed(1)}%</li>
                  <li>Overall Conversion Rate: {((summary.overall_conversion_rate || 0) * 100).toFixed(1)}%</li>
                </ul>
                <div style={{ marginTop: '10px' }}><strong>Timeseries:</strong> {timeseries.length} items (empty array)</div>
              </div>
              <p style={{ marginTop: '15px', color: '#6b7280' }}>No funnel progression data to display - all metrics are 0</p>
            </div>
          )}
        </div>
      </div>

      {/* API Response Debug Section */}
      <div className="api-response-debug" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px', color: '#374151' }}>Raw API Response:</h3>
        <pre style={{ 
          backgroundColor: '#ffffff', 
          padding: '15px', 
          borderRadius: '6px', 
          overflow: 'auto', 
          fontSize: '12px',
          border: '1px solid #e5e7eb'
        }}>
          {JSON.stringify(funnelData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ConversionFunnelAnalytics;
