import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, Timer, BarChart } from 'lucide-react';
import { useGetAverageSessionTimeQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const SessionTime: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: sessionData,
    error,
    isLoading
  } = useGetAverageSessionTimeQuery({
    tenantId: tenantId,
    gameId: selectedGame || undefined,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const chartData = sessionData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: Math.round(item.count / 60) // Convert seconds to minutes
  })) || [];

  const avgSessionTime = sessionData?.total 
    ? Math.round(sessionData.total / (sessionData.series?.length || 1))
    : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Clock className="page-title-icon" />
            Average Session Time
          </h2>
          <p className="page-description">
            Analyze player engagement by tracking how long users spend in gaming sessions.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Session Time data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Average Session"
          value={formatTime(avgSessionTime)}
          change="8"
          changeType="positive"
          icon={Clock}
          color="blue"
        />
        
        <StatsCard
          title="Peak Session"
          value={formatTime(Math.max(...(sessionData?.series?.map(s => s.count) || [0])))}
          change="12"
          changeType="positive"
          icon={Timer}
          color="purple"
        />
        
        <StatsCard
          title="Total Sessions"
          value={(sessionData?.series?.length || 0).toString()}
          change="5"
          changeType="positive"
          icon={BarChart}
          color="green"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Session Time Trend (Minutes)"
          type="line"
          data={chartData}
        />
      </div>

      {sessionData?.series && sessionData.series.length > 0 && (
        <Table
          title="Session Time Details"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Avg Session Time', 
              sortable: true, 
              align: 'right',
              render: (value: number) => (
                <span className="metric-value">{formatTime(value)}</span>
              )
            },
            { 
              key: 'minutes', 
              title: 'Minutes', 
              sortable: true, 
              align: 'right',
              render: (value: number) => `${value} min`
            },
            { 
              key: 'engagement', 
              title: 'Engagement Level', 
              sortable: true,
              render: (value: string, row: any) => {
                const minutes = Math.round(row.count / 60);
                const engagementClass = minutes > 10 ? 'positive' : minutes > 5 ? 'neutral' : 'negative';
                return <span className={`growth ${engagementClass}`}>{value}</span>
              }
            }
          ]}
          data={sessionData.series.map((item) => {
            const minutes = Math.round(item.count / 60);
            const engagement = minutes > 10 ? 'High' : minutes > 5 ? 'Medium' : 'Low';
            
            return {
              ...item,
              minutes,
              engagement
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
          <p>Loading Session Time data...</p>
        </div>
      )}

      {!isLoading && (!sessionData?.series || sessionData.series.length === 0) && !error && (
        <div className="empty-state">
          <Clock size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Session Time data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default SessionTime;
