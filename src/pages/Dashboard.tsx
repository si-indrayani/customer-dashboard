import React, { useState } from 'react';
import { Users, Gamepad2, DollarSign, Clock, TrendingUp, Target, Calendar, RefreshCw } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext'; // Available for theme-based conditional logic
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import TrafficChart from '../components/TrafficChart';
import GameEngagementChart from '../components/GameEngagementChart';
import PerformanceChart from '../components/PerformanceChart';
import PopularGamesChart from '../components/PopularGamesChart';
import ConversionFunnelChart from '../components/ConversionFunnelChart';
import { useNavigate } from 'react-router-dom';
import DashboardAnalytics from '../components/DashboardAnalytics';
import { dashboardStats, playerGrowthData, revenueData, topPlayersData } from '../data/mockData';
import './Dashboard.css';
import '../components/DashboardAnalytics.css';

const Dashboard: React.FC = () => {
  // Theme context is available here if needed for conditional rendering
  // const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme();
  
  // Date range state for analytics
  const [dateRange, setDateRange] = useState({
    from: '2025-09-01',
    to: '2025-09-30'
  });

  const navigate = useNavigate();

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    // Force re-render of analytics components
    setDateRange(prev => ({ ...prev }));
  };

  const handleTrafficChartClick = () => {
    navigate('/analytics/traffic');
  };

  const playerColumns = [
    {
      key: 'name',
      title: 'Player Name',
      sortable: true,
    },
    {
      key: 'level',
      title: 'Level',
      sortable: true,
    },
    {
      key: 'score',
      title: 'Score',
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={`status-badge status-badge-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastPlayed',
      title: 'Last Played',
      sortable: true,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Date Range Selector */}
        <div className="date-range-selector">
          <div className="date-label">
            <Calendar size={16} />
            <span>Analytics Period</span>
          </div>
          <div className="date-inputs">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className="date-input"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="date-input"
            />
          </div>
          <button 
            onClick={handleRefresh}
            className="refresh-mini-btn"
            title="Refresh Analytics"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Total Players"
            value={147832}
            change={dashboardStats.totalPlayers.change}
            changeType={dashboardStats.totalPlayers.changeType}
            icon={Users}
            color="blue"
            animated={true}
          />
          <StatsCard
            title="Active Games"
            value={23}
            change={dashboardStats.activeGames.change}
            changeType={dashboardStats.activeGames.changeType}
            icon={Gamepad2}
            color="purple"
            animated={true}
          />
          <StatsCard
            title="Total Revenue"
            value={892456}
            change={dashboardStats.totalRevenue.change}
            changeType={dashboardStats.totalRevenue.changeType}
            icon={DollarSign}
            color="green"
            animated={true}
            prefix="$"
          />
          <StatsCard
            title="Avg Session Time"
            value={24.5}
            change={dashboardStats.avgSessionTime.change}
            changeType={dashboardStats.avgSessionTime.changeType}
            icon={Clock}
            color="orange"
            animated={true}
            suffix=" min"
          />
          <StatsCard
            title="Daily Active Users"
            value={45231}
            change={dashboardStats.dailyActiveUsers.change}
            changeType={dashboardStats.dailyActiveUsers.changeType}
            icon={TrendingUp}
            color="indigo"
            animated={true}
          />
          <StatsCard
            title="Conversion Rate"
            value={3.24}
            change={dashboardStats.conversionRate.change}
            changeType={dashboardStats.conversionRate.changeType}
            icon={Target}
            color="red"
            animated={true}
            suffix="%"
          />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <ChartCard
            title="Player Growth Over Time"
            type="line"
            data={playerGrowthData}
          />
          <ChartCard
            title="Weekly Revenue"
            type="bar"
            data={revenueData}
          />
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
            tenantId="gaming-company-123"
            height="300px"
          />
          <PerformanceChart 
            dateRange={dateRange} 
            tenantId="gaming-company-123"
            height="300px"
          />
          <PopularGamesChart 
            tenantId="gaming-company-123"
            height="300px"
            limit={10}
          />
          <ConversionFunnelChart 
            tenantId="gaming-company-123"
            height="300px"
            dateRange={dateRange}
          />
        </div>

        {/* Analytics Mini Charts */}
        <DashboardAnalytics dateRange={dateRange} />

        {/* Top Players Table */}
        <div className="table-section">
          <DataTable
            title="Top Players"
            columns={playerColumns}
            data={topPlayersData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
