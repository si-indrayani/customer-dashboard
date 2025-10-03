import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { useGetDailyActiveUsersQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const DailyActiveUsers: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: dauData,
    error,
    isLoading
  } = useGetDailyActiveUsersQuery({
    tenant_id: tenantId,
    ...(selectedGame && { game_id: selectedGame }),
    from: dateRange.from,
    to: dateRange.to
  });

  // Transform data for Chart component
  const chartData = dauData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: item.count
  })) || [];

  // Calculate stats
  const totalUsers = dauData?.total || 0;
  const avgDaily = dauData?.series?.length 
    ? Math.round(totalUsers / dauData.series.length)
    : 0;
  
  const lastWeekData = dauData?.series?.slice(-7) || [];
  const previousWeekData = dauData?.series?.slice(-14, -7) || [];
  
  const lastWeekAvg = lastWeekData.length 
    ? Math.round(lastWeekData.reduce((sum, item) => sum + item.count, 0) / lastWeekData.length)
    : 0;
  const previousWeekAvg = previousWeekData.length 
    ? Math.round(previousWeekData.reduce((sum, item) => sum + item.count, 0) / previousWeekData.length)
    : 0;
    
  const weeklyChange = previousWeekAvg > 0 
    ? Math.round(((lastWeekAvg - previousWeekAvg) / previousWeekAvg) * 100)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Users className="page-title-icon" />
            Daily Active Users
          </h2>
          <p className="page-description">
            Track unique users engaging with your games daily. Monitor growth trends and identify peak activity periods.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Daily Active Users data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change={weeklyChange.toString()}
          changeType={weeklyChange >= 0 ? 'positive' : 'negative'}
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Daily Average"
          value={avgDaily.toLocaleString()}
          change="0"
          changeType="neutral"
          icon={Calendar}
          color="green"
        />
        
        <StatsCard
          title="Weekly Average"
          value={lastWeekAvg.toLocaleString()}
          change={weeklyChange.toString()}
          changeType={weeklyChange >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Daily Active Users Trend"
          type="line"
          data={chartData}
        />
      </div>

      {dauData?.series && dauData.series.length > 0 && (
        <Table
          title="Daily Breakdown"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Active Users', 
              sortable: true, 
              align: 'right',
              render: (value: number) => (
                <span className="metric-value">{value.toLocaleString()}</span>
              )
            },
            { 
              key: 'dayOfWeek', 
              title: 'Day of Week', 
              sortable: false,
              render: (_value: string, row: any) => 
                new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })
            },
            { 
              key: 'growth', 
              title: 'Growth %', 
              sortable: true, 
              align: 'right',
              render: (value: number) => (
                <span className={`growth ${value >= 0 ? 'positive' : 'negative'}`}>
                  {value > 0 ? '+' : ''}{value}%
                </span>
              )
            }
          ]}
          data={dauData.series.map((item, index) => {
            const previousCount = index > 0 ? dauData.series[index - 1].count : item.count;
            const growth = previousCount > 0 
              ? Math.round(((item.count - previousCount) / previousCount) * 100)
              : 0;
            
            return {
              ...item,
              growth
            };
          })}
          loading={isLoading}
          defaultSortKey="date"
          defaultSortOrder="desc"
          defaultItemsPerPage={25}
        />
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading Daily Active Users data...</p>
        </div>
      )}

      {!isLoading && (!dauData?.series || dauData.series.length === 0) && !error && (
        <div className="empty-state">
          <Users size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Daily Active Users data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default DailyActiveUsers;
