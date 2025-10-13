import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Target, CheckCircle2 } from 'lucide-react';
import { useGetAnswerAccuracyQuery } from '../../store/api/analyticsApi';
import ChartCard from '../../components/ChartCard';
import StatsCard from '../../components/StatsCard';
import Table from '../../components/Table';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
}

const AnswerAccuracy: React.FC = () => {
  const { tenantId, dateRange, selectedGame } = useOutletContext<AnalyticsContext>();
  
  const {
    data: accuracyData,
    error,
    isLoading
  } = useGetAnswerAccuracyQuery({
    tenantId: tenantId,
    gameId: selectedGame || undefined,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
  });

  const chartData = accuracyData?.series?.map(item => ({
    name: new Date(item.date).toLocaleDateString(),
    value: Math.round((item.count / 100) * 100) // Assuming count is percentage
  })) || [];

  const avgAccuracy = accuracyData?.series?.length 
    ? Math.round(accuracyData.series.reduce((sum, item) => sum + item.count, 0) / accuracyData.series.length)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Target className="page-title-icon" />
            Answer Accuracy
          </h2>
          <p className="page-description">
            Monitor player performance and question difficulty by tracking answer accuracy rates.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Failed to load Answer Accuracy data. Please check your API connection.</p>
        </div>
      )}

      <div className="analytics-stats">
        <StatsCard
          title="Average Accuracy"
          value={`${avgAccuracy}%`}
          change="4"
          changeType="positive"
          icon={Target}
          color="blue"
        />
        
        <StatsCard
          title="Best Day"
          value={`${Math.max(...(accuracyData?.series?.map(s => s.count) || [0]))}%`}
          change="7"
          changeType="positive"
          icon={CheckCircle2}
          color="green"
        />
        
        <StatsCard
          title="Improvement"
          value="+12%"
          change="12"
          changeType="positive"
          icon={Target}
          color="purple"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Daily Answer Accuracy (%)"
          type="line"
          data={chartData}
        />
      </div>

      {accuracyData?.series && accuracyData.series.length > 0 && (
        <Table
          title="Accuracy Breakdown"
          columns={[
            { 
              key: 'date', 
              title: 'Date', 
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString()
            },
            { 
              key: 'count', 
              title: 'Accuracy Rate', 
              sortable: true, 
              align: 'right',
              render: (value: number) => (
                <span className="metric-value">{Math.round(value)}%</span>
              )
            },
            { 
              key: 'performance', 
              title: 'Performance', 
              sortable: true,
              render: (value: string, row: any) => {
                const accuracy = Math.round(row.count);
                const performanceClass = accuracy > 80 ? 'positive' : accuracy > 60 ? 'neutral' : 'negative';
                return <span className={`growth ${performanceClass}`}>{value}</span>
              }
            },
            { 
              key: 'trend', 
              title: 'Trend', 
              sortable: false,
              align: 'center',
              render: (value: string) => value
            }
          ]}
          data={accuracyData.series.map((item, index) => {
            const accuracy = Math.round(item.count);
            const performance = accuracy > 80 ? 'Excellent' : accuracy > 60 ? 'Good' : 'Needs Improvement';
            
            const prevAccuracy = index > 0 ? accuracyData.series[index - 1].count : item.count;
            const trend = accuracy > prevAccuracy ? '↗' : accuracy < prevAccuracy ? '↘' : '→';
            
            return {
              ...item,
              performance,
              trend
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
          <p>Loading Answer Accuracy data...</p>
        </div>
      )}

      {!isLoading && (!accuracyData?.series || accuracyData.series.length === 0) && !error && (
        <div className="empty-state">
          <Target size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No Answer Accuracy data found for the selected period and filters.</p>
        </div>
      )}
    </div>
  );
};

export default AnswerAccuracy;
