import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import { TrendingUp, Users, Eye, Calendar, BarChart3 } from 'lucide-react';
import { useGetTrafficAnalyticsQuery } from '../store/api/analyticsApi';
import './TrafficAnalytics.css';

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



// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

interface AnalyticsContextType {
  tenantId: string;
  dateRange: {
    from: string;
    to: string;
  };
  selectedGame: string;
  availableGames: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  getRandomImage: (gameName: string) => string;
}

const TrafficAnalytics: React.FC = () => {
  const { tenantId, dateRange } = useOutletContext<AnalyticsContextType>();
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    data: trafficData,
    error,
    isLoading
  } = useGetTrafficAnalyticsQuery({ 
    tenantId, 
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  // All hooks must be called at the top level - before any conditional returns
  const animatedTotalVisits = useAnimatedCounter(trafficData?.data.summary.visits || 0, 1500);
  const animatedUniqueVisitors = useAnimatedCounter(trafficData?.data.summary.unique_visitors || 0, 1500);
  const animatedAvgDaily = useAnimatedCounter(
    trafficData ? Math.round(trafficData.data.summary.visits / (trafficData.data.timeseries.length || 1)) : 0, 
    1500
  );

  console.log('🔄 TrafficAnalytics component rendering...', { isLoading, isVisible, hasData: !!trafficData, error });

  // Set visibility when data is loaded
  React.useEffect(() => {
    if (trafficData && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [trafficData, isLoading]);

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
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'normal' as const,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            weight: 'normal' as const,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            weight: 'normal' as const,
          }
        }
      }
    }
  };

  // Calculate percentage change
  const calculateChange = () => {
    if (!trafficData) return 0;
    const timeseries = trafficData.data.timeseries;
    if (timeseries.length < 2) return 0;
    
    const latest = timeseries[timeseries.length - 1].value;
    const previous = timeseries[timeseries.length - 2].value;
    
    if (previous === 0) return latest > 0 ? 100 : 0;
    return Math.round(((latest - previous) / previous) * 100);
  };

  const changePercentage = calculateChange();

  // Return loading state
  if (isLoading) {
    console.log('📊 Showing loading state...');
    return (
      <div className="traffic-analytics loading">
        <div className="loading-spinner">
          <BarChart3 className="spinner-icon" size={32} />
          <p>Loading traffic analytics...</p>
        </div>
      </div>
    );
  }

  // Return error state only if no data is available
  if (!trafficData) {
    console.log('❌ Showing error state - no data:', { error, hasData: !!trafficData });
    return (
      <div className="traffic-analytics error">
        <div className="error-message">
          <h3>Failed to Load Traffic Data</h3>
          <p>{error ? (typeof error === 'string' ? error : 'API Error') : 'No data available'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Animated counters moved to top of component to follow Rules of Hooks

  // Prepare chart data (after we know trafficData exists)
  const hasTimeseriesData = trafficData.data.timeseries && trafficData.data.timeseries.length > 0;
  
  const chartData = {
    labels: hasTimeseriesData ? trafficData.data.timeseries.map((item: any) => formatDate(item.timestamp)) : [],
    datasets: [
      {
        label: 'Total Visits',
        data: hasTimeseriesData ? trafficData.data.timeseries.map((item: any) => item.value) : [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Unique Visitors', 
        data: hasTimeseriesData ? trafficData.data.timeseries.map((item: any) => item.metadata?.unique || 0) : [],
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
      }
    ]
  };

  console.log('✅ Rendering main component with data:', trafficData);
  
  return (
    <div className={`traffic-analytics ${isVisible ? 'visible' : ''}`}>
      {error && (
        <div className="warning-banner">
          <span>⚠️ {typeof error === 'string' ? error : 'API Error'}</span>
        </div>
      )}
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-title">
            <TrendingUp className="header-icon" size={24} />
            <h2>Traffic Analytics</h2>
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>Live</span>
            </div>
          </div>
          <div className="header-controls">
            <div className="period-info">
              <Calendar size={16} />
              <span>{trafficData.metadata.period.from} to {trafficData.metadata.period.to}</span>
            </div>
            <button 
              className="refresh-button"
              onClick={() => window.location.reload()}
              title="Refresh data"
            >
              <BarChart3 size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-icon total-visits">
            <Eye size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalVisits}</div>
            <div className="stat-label">Total Visits</div>
            <div className={`stat-change ${changePercentage >= 0 ? 'positive' : 'negative'}`}>
              {changePercentage >= 0 ? '+' : ''}{changePercentage}% from yesterday
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon unique-visitors">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedUniqueVisitors}</div>
            <div className="stat-label">Unique Visitors</div>
            <div className="stat-change neutral">
              100% unique rate
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon avg-daily">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedAvgDaily}</div>
            <div className="stat-label">Avg. Daily Visits</div>
            <div className="stat-change neutral">
              Based on 3-day period
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Traffic Trend</h3>
          <div className="chart-subtitle">Daily visits and unique visitors over time</div>
        </div>
        <div className="chart-wrapper" style={{ height: '400px' }}>
          {hasTimeseriesData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              No timeseries data available for the selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalytics;
