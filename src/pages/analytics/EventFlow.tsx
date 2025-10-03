import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, ArrowRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Table from '../../components/Table';
import StatsCard from '../../components/StatsCard';
import ChartCard from '../../components/ChartCard';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
  availableGames: Array<{ id: string; name: string; image: string }>;
  getRandomImage: (gameName: string) => string;
}

const EventFlow: React.FC = () => {
  const { tenantId, dateRange, selectedGame, availableGames, getRandomImage } = useOutletContext<AnalyticsContext>();

  // Mock event flow data based on your event structure
  const eventFlowData = [
    {
      id: 'premier-league-predictor',
      name: 'Premier League Predictor',
      
      // Event Funnel
      hubEnters: 15680,
      gameStarts: 12450,
      gameEnds: 9234,
      correctAnswers: 87150,
      wrongAnswers: 37350,
      errors: 156,
      
      // Event Flow Metrics
      hubToStartConversion: 79.4,
      startToEndConversion: 74.2,
      answerSuccessRate: 70.0,
      errorRate: 1.25,
      
      // Time-based Analytics
      avgHubTime: 45000, // ms
      avgGameTime: 125000,
      avgQuestionTime: 12500,
      
      // Recent Events (last 24h)
      recentHubEnters: 1240,
      recentGameStarts: 985,
      recentGameEnds: 730,
      recentErrors: 12
    },
    {
      id: 'football-trivia-master',
      name: 'Football Trivia Master',
      
      hubEnters: 11240,
      gameStarts: 8920,
      gameEnds: 6789,
      correctAnswers: 71360,
      wrongAnswers: 17840,
      errors: 92,
      
      hubToStartConversion: 79.4,
      startToEndConversion: 76.1,
      answerSuccessRate: 80.0,
      errorRate: 1.03,
      
      avgHubTime: 38000,
      avgGameTime: 95000,
      avgQuestionTime: 8200,
      
      recentHubEnters: 890,
      recentGameStarts: 710,
      recentGameEnds: 540,
      recentErrors: 7
    },
    {
      id: 'sports-quiz-champion',
      name: 'Sports Quiz Champion',
      
      hubEnters: 8940,
      gameStarts: 6750,
      gameEnds: 4823,
      correctAnswers: 40500,
      wrongAnswers: 27000,
      errors: 124,
      
      hubToStartConversion: 75.5,
      startToEndConversion: 71.5,
      answerSuccessRate: 60.0,
      errorRate: 1.84,
      
      avgHubTime: 52000,
      avgGameTime: 165000,
      avgQuestionTime: 18700,
      
      recentHubEnters: 670,
      recentGameStarts: 510,
      recentGameEnds: 365,
      recentErrors: 9
    }
  ];

  const filteredData = selectedGame 
    ? eventFlowData.filter(game => game.id === selectedGame)
    : eventFlowData;

  const dataWithImages = filteredData.map(game => ({
    ...game,
    imageUrl: getRandomImage(game.id)
  }));

  // Calculate totals
  const totals = {
    hubEnters: filteredData.reduce((sum, game) => sum + game.hubEnters, 0),
    gameStarts: filteredData.reduce((sum, game) => sum + game.gameStarts, 0),
    gameEnds: filteredData.reduce((sum, game) => sum + game.gameEnds, 0),
    correctAnswers: filteredData.reduce((sum, game) => sum + game.correctAnswers, 0),
    wrongAnswers: filteredData.reduce((sum, game) => sum + game.wrongAnswers, 0),
    errors: filteredData.reduce((sum, game) => sum + game.errors, 0)
  };

  // Chart data for event flow visualization
  const eventFlowChartData = [
    { name: 'Hub Enters', value: totals.hubEnters, color: '#3b82f6' },
    { name: 'Game Starts', value: totals.gameStarts, color: '#10b981' },
    { name: 'Game Ends', value: totals.gameEnds, color: '#f59e0b' },
    { name: 'Errors', value: totals.errors, color: '#ef4444' }
  ];

  const answerDistributionData = [
    { name: 'Correct', value: totals.correctAnswers, color: '#10b981' },
    { name: 'Wrong', value: totals.wrongAnswers, color: '#ef4444' }
  ];

  const eventColumns = [
    {
      key: 'name',
      title: 'Game',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="game-title-cell">
          <img 
            src={row.imageUrl} 
            alt={value}
            className="game-image-inline"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&crop=center';
            }}
          />
          <span className="game-title">{value}</span>
        </div>
      )
    },
    {
      key: 'eventFlow',
      title: 'Event Flow',
      sortable: false,
      render: (_value: any, row: any) => (
        <div className="event-flow-cell">
          <div className="flow-step">
            <span className="flow-number">{row.hubEnters.toLocaleString()}</span>
            <span className="flow-label">Hub</span>
          </div>
          <ArrowRight size={16} className="flow-arrow" />
          <div className="flow-step">
            <span className="flow-number">{row.gameStarts.toLocaleString()}</span>
            <span className="flow-label">Start</span>
          </div>
          <ArrowRight size={16} className="flow-arrow" />
          <div className="flow-step">
            <span className="flow-number">{row.gameEnds.toLocaleString()}</span>
            <span className="flow-label">End</span>
          </div>
        </div>
      )
    },
    {
      key: 'answerSuccessRate',
      title: 'Answer Success',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <span className={`accuracy-badge ${value >= 70 ? 'high' : value >= 50 ? 'medium' : 'low'}`}>
          {value}%
        </span>
      )
    },
    {
      key: 'errorRate',
      title: 'Error Rate',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <span className={`error-rate ${value < 1 ? 'low' : value < 2 ? 'medium' : 'high'}`}>
          {value}%
        </span>
      )
    },
    {
      key: 'avgGameTime',
      title: 'Avg Game Time',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => {
        const minutes = Math.floor(value / 60000);
        const seconds = Math.floor((value % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Activity className="page-title-icon" />
            Event Flow Analysis
          </h2>
          <p className="page-description">
            Track the player journey from gaming hub entrance through game completion and analyze event patterns.
          </p>
        </div>
      </div>

      <div className="analytics-stats">
        <StatsCard
          title="Gaming Hub Enters"
          value={totals.hubEnters.toLocaleString()}
          change="12"
          changeType="positive"
          icon={Activity}
          color="blue"
        />
        
        <StatsCard
          title="Game Sessions"
          value={totals.gameStarts.toLocaleString()}
          change="8"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        
        <StatsCard
          title="Successful Completions"
          value={totals.gameEnds.toLocaleString()}
          change="5"
          changeType="positive"
          icon={CheckCircle}
          color="purple"
        />
        
        <StatsCard
          title="Error Events"
          value={totals.errors.toLocaleString()}
          change="-15"
          changeType="negative"
          icon={XCircle}
          color="red"
        />
      </div>

      <div className="analytics-charts">
        <ChartCard
          title="Event Flow Funnel"
          type="bar"
          data={eventFlowChartData}
        />
        
        <ChartCard
          title="Answer Distribution"
          type="bar"
          data={answerDistributionData}
        />
      </div>

      <div className="analytics-charts">
        <Table
          title="Game Event Flow Details"
          columns={eventColumns}
          data={dataWithImages}
          loading={false}
          defaultSortKey="hubEnters"
          defaultSortOrder="desc"
          defaultItemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default EventFlow;
