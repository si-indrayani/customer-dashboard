import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Gamepad2, Play, TrendingUp } from 'lucide-react';
import { useGetGamePlaysQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const GamePlays: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: gamePlayData,
    error,
    isLoading
  } = useGetGamePlaysQuery({
    tenant_id: tenantId,
    ...(selectedGame && { game_id: selectedGame }),
    from: dateRange.from,
    to: dateRange.to
  });

  const chartData = gamePlayData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: item.count
  })) || [];

  const totalPlays = gamePlayData?.total || 0;
  const avgDaily = gamePlayData?.series?.length 
    ? Math.round(totalPlays / gamePlayData.series.length)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Gamepad2 className="page-title-icon" />
            Game Plays
          </h2>
          <p className="page-description">
            Monitor game session starts and track player engagement patterns across your gaming platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Game Plays data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Total Game Plays"
          value={totalPlays.toLocaleString()}
          change="12"
          changeType="positive"
          icon={Gamepad2}
          color="green"
        />
        
        <StatsCard
          title="Daily Average"
          value={avgDaily.toLocaleString()}
          change="8"
          changeType="positive"
          icon={Play}
          color="blue"
        />
        
        <StatsCard
          title="Peak Day"
          value={Math.max(...(gamePlayData?.series?.map(s => s.count) || [0])).toLocaleString()}
          change="15"
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Game Plays Over Time"
          type="bar"
          data={chartData}
        />
      </div>

      {gamePlayData?.series && gamePlayData.series.length > 0 && (
        <Table
          title="Daily Game Plays"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Game Plays', 
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
              key: 'percentage', 
              title: '% of Total', 
              sortable: true, 
              align: 'right',
              render: (value: number) => `${value}%`
            }
          ]}
          data={gamePlayData.series.map((item) => {
            const percentage = totalPlays > 0 ? parseFloat(((item.count / totalPlays) * 100).toFixed(1)) : 0;
            
            return {
              ...item,
              percentage
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
          <p>Loading Game Plays data...</p>
        </div>
      )}

      {!isLoading && (!gamePlayData?.series || gamePlayData.series.length === 0) && !error && (
        <div className="empty-state">
          <Gamepad2 size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Game Plays data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default GamePlays;
