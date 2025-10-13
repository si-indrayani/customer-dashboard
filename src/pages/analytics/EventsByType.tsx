import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart3, Activity, Zap } from 'lucide-react';
import { useGetEventsByTypeQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const EventsByType: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: eventsData,
    error,
    isLoading
  } = useGetEventsByTypeQuery({
    tenantId: tenantId,
    gameId: selectedGame || undefined,
    dateFrom: dateRange.from,
    dateTo: dateRange.to
  });

  const chartData = eventsData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: item.count
  })) || [];

  const totalEvents = eventsData?.total || 0;
  const avgDaily = eventsData?.series?.length 
    ? Math.round(totalEvents / eventsData.series.length)
    : 0;

  // Mock event types data (in real app, this would come from API)
  const eventTypes = [
    { type: 'game_play_start', count: Math.floor(totalEvents * 0.35), percentage: '35%' },
    { type: 'game_play_end', count: Math.floor(totalEvents * 0.32), percentage: '32%' },
    { type: 'correct_answer', count: Math.floor(totalEvents * 0.18), percentage: '18%' },
    { type: 'wrong_answer', count: Math.floor(totalEvents * 0.12), percentage: '12%' },
    { type: 'error', count: Math.floor(totalEvents * 0.03), percentage: '3%' }
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <BarChart3 className="page-title-icon" />
            Events by Type
          </h2>
          <p className="page-description">
            Analyze event distribution and identify patterns in player behavior across different event types.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Events by Type data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Total Events"
          value={totalEvents.toLocaleString()}
          change="25"
          changeType="positive"
          icon={BarChart3}
          color="blue"
        />
        
        <StatsCard
          title="Daily Average"
          value={avgDaily.toLocaleString()}
          change="8"
          changeType="positive"
          icon={Activity}
          color="green"
        />
        
        <StatsCard
          title="Peak Day Events"
          value={Math.max(...(eventsData?.series?.map(s => s.count) || [0])).toLocaleString()}
          change="15"
          changeType="positive"
          icon={Zap}
          color="orange"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Events Over Time"
          type="bar"
          data={chartData}
        />
      </div>

      {/* Event Types Breakdown */}
      <Table
        title="Event Type Distribution"
        columns={[
          { 
            key: 'type', 
            title: 'Event Type', 
            sortable: true,
            render: (value: string) => (
              <span className="metric-value">{value.replace(/_/g, ' ').toUpperCase()}</span>
            )
          },
          { 
            key: 'count', 
            title: 'Count', 
            sortable: true, 
            align: 'right',
            render: (value: number) => value.toLocaleString()
          },
          { 
            key: 'percentage', 
            title: 'Percentage', 
            sortable: true, 
            align: 'right'
          },
          { 
            key: 'category', 
            title: 'Category', 
            sortable: true
          }
        ]}
        data={eventTypes.map((event) => {
          const category = event.type.includes('play') ? 'Gameplay' : 
                         event.type.includes('answer') ? 'Interaction' : 'System';
          
          return {
            ...event,
            category
          };
        })}
        loading={false}
        defaultSortKey="count"
        defaultSortOrder="desc"
        defaultItemsPerPage={10}
      />

      {eventsData?.series && eventsData.series.length > 0 && (
        <Table
          title="Daily Event Summary"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Total Events', 
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
              key: 'activityLevel', 
              title: 'Activity Level', 
              sortable: true,
              render: (value: string, row: any) => {
                const activityClass = row.count > avgDaily * 1.2 ? 'positive' : 
                                     row.count > avgDaily * 0.8 ? 'neutral' : 'negative';
                return <span className={`growth ${activityClass}`}>{value}</span>
              }
            }
          ]}
          data={eventsData.series.map((item) => {
            const activityLevel = item.count > avgDaily * 1.2 ? 'High' : 
                                 item.count > avgDaily * 0.8 ? 'Normal' : 'Low';
            
            return {
              ...item,
              activityLevel
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
          <p>Loading Events by Type data...</p>
        </div>
      )}

      {!isLoading && (!eventsData?.series || eventsData.series.length === 0) && !error && (
        <div className="empty-state">
          <BarChart3 size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Events by Type data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default EventsByType;
