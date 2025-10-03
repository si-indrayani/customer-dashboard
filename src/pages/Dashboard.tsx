import React from 'react';
import { Users, Gamepad2, DollarSign, Clock, TrendingUp, Target } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext'; // Available for theme-based conditional logic
import StatsCard from '../components/StatsCard';
import TrafficChart from '../components/TrafficChart';
import GameEngagementChart from '../components/GameEngagementChart';
import PerformanceChart from '../components/PerformanceChart';
import PopularGamesChart from '../components/PopularGamesChart';
import ConversionFunnelChart from '../components/ConversionFunnelChart';
import { useNavigate } from 'react-router-dom';
import {
  useGetTrafficAnalyticsQuery,
  useGetPerformanceAnalyticsQuery,
  useGetPopularGamesRankingQuery,
  useGetConversionFunnelQuery
} from '../store/api/analyticsApi';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // Theme context is available here if needed for conditional rendering
  // const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme();
  
  // Fixed date range for analytics
  const dateRange = {
    from: '2025-09-01',
    to: '2025-09-30'
  };

  const navigate = useNavigate();

  // Fetch API data for stats cards
  const { data: trafficData } = useGetTrafficAnalyticsQuery({
    tenantId: 'tenant_001',
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const { data: performanceData } = useGetPerformanceAnalyticsQuery({
    tenantId: 'tenant_001',
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const { data: popularGamesData } = useGetPopularGamesRankingQuery({
    tenantId: 'tenant_001',
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    limit: 10
  });

  const { data: conversionData } = useGetConversionFunnelQuery({
    tenantId: 'tenant_001',
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const handleTrafficChartClick = () => {
    navigate('/analytics/traffic');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Hub Visits"
            value={conversionData?.data?.summary?.hub_visits || 0}
            change="Real-time data"
            changeType="neutral"
            icon={Users}
            color="blue"
            animated={true}
          />
          <StatsCard
            title="Game Starts"
            value={conversionData?.data?.summary?.game_starts || 0}
            change="From API"
            changeType="positive"
            icon={Gamepad2}
            color="purple"
            animated={true}
          />
          <StatsCard
            title="Game Completions"
            value={conversionData?.data?.summary?.game_completions || 0}
            change="Live tracking"
            changeType="positive"
            icon={Target}
            color="green"
            animated={true}
          />
          <StatsCard
            title="Overall Accuracy"
            value={performanceData?.data?.summary?.overall_accuracy || 0}
            change="Performance metric"
            changeType="positive"
            icon={TrendingUp}
            color="orange"
            animated={true}
            suffix="%"
          />
          <StatsCard
            title="Avg Response Time"
            value={Math.round((performanceData?.data?.summary?.avg_response_time_ms || 0) / 1000 * 10) / 10}
            change="Response speed"
            changeType="neutral"
            icon={Clock}
            color="indigo"
            animated={true}
            suffix=" sec"
          />
          <StatsCard
            title="Total Questions"
            value={performanceData?.data?.summary?.total_questions || 0}
            change="Questions asked"
            changeType="neutral"
            icon={DollarSign}
            color="red"
            animated={true}
          />
          <StatsCard
            title="Total Games"
            value={popularGamesData?.data?.summary?.total_games || 0}
            change="Games available"
            changeType="neutral"
            icon={Gamepad2}
            color="purple"
            animated={true}
          />
          <StatsCard
            title="Unique Visitors"
            value={trafficData?.data?.summary?.unique_visitors || 0}
            change="Site traffic"
            changeType="positive"
            icon={Users}
            color="blue"
            animated={true}
          />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card" style={{ cursor: 'pointer' }} onClick={handleTrafficChartClick}>
            <div className="chart-card-header">
              <h3 className="chart-card-title">Traffic Analytics</h3>
            </div>
            <div className="chart-card-content">
              <TrafficChart dateRange={dateRange} />
            </div>
          </div>
          <GameEngagementChart 
            dateRange={dateRange} 
            tenantId="tenant_001"
            height="300px"
          />
          <PerformanceChart 
            dateRange={dateRange} 
            tenantId="tenant_001"
            height="300px"
          />
          <PopularGamesChart 
            tenantId="tenant_001"
            height="300px"
            limit={10}
            dateRange={dateRange}
          />
          <ConversionFunnelChart 
            tenantId="tenant_001"
            height="300px"
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
