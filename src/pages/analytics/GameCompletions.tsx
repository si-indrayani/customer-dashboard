import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trophy, CheckCircle, Target } from 'lucide-react';
import { useGetGameCompletionsQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const GameCompletions: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: completionData,
    error,
    isLoading
  } = useGetGameCompletionsQuery({
    tenantId: tenantId,
    gameId: selectedGame || undefined,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const chartData = completionData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: item.count
  })) || [];

  const totalCompletions = completionData?.total || 0;
  const avgDaily = completionData?.series?.length 
    ? Math.round(totalCompletions / completionData.series.length)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Trophy className="page-title-icon" />
            Game Completions
          </h2>
          <p className="page-description">
            Track successful game completions and analyze completion rates to optimize player retention.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Game Completions data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Total Completions"
          value={totalCompletions.toLocaleString()}
          change="18"
          changeType="positive"
          icon={Trophy}
          color="gold"
        />
        
        <StatsCard
          title="Daily Average"
          value={avgDaily.toLocaleString()}
          change="5"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        
        <StatsCard
          title="Completion Rate"
          value="74.5%"
          change="3"
          changeType="positive"
          icon={Target}
          color="blue"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Daily Game Completions"
          type="line"
          data={chartData}
        />
      </div>

      {completionData?.series && completionData.series.length > 0 && (
        <Table
          title="Completion Breakdown"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Completions', 
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
              key: 'runningTotal', 
              title: 'Running Total', 
              sortable: true, 
              align: 'right',
              render: (value: number) => value.toLocaleString()
            }
          ]}
          data={completionData.series.map((item, index) => {
            const runningTotal = completionData.series
              .slice(0, index + 1)
              .reduce((sum, s) => sum + s.count, 0);
            
            return {
              ...item,
              runningTotal
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
          <p>Loading Game Completions data...</p>
        </div>
      )}

      {!isLoading && (!completionData?.series || completionData.series.length === 0) && !error && (
        <div className="empty-state">
          <Trophy size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Game Completions data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default GameCompletions;
