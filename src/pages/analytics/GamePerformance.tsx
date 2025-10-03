import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Gamepad2, TrendingUp, Users, Trophy } from 'lucide-react';
import Table from '../../components/Table';
import StatsCard from '../../components/StatsCard';
import './AnalyticsPage.css';

interface AnalyticsContext {
  tenantId: string;
  dateRange: { from: string; to: string };
  selectedGame: string;
  availableGames: Array<{ id: string; name: string; image: string }>;
  getRandomImage: (gameName: string) => string;
}

const GamePerformance: React.FC = () => {
  const { tenantId, dateRange, selectedGame, availableGames, getRandomImage } = useOutletContext<AnalyticsContext>();

  // Mock comprehensive gaming analytics data based on your event structure
  const gamePerformanceData = [
    {
      id: 'premier-league-predictor',
      name: 'Premier League Predictor',
      category: 'football',
      gameMode: 'daily_challenge',
      difficulty: 'medium',
      
      // Core Metrics
      totalPlays: 12450,
      completions: 9234,
      completionRate: 74.2,
      avgSessionTime: '8:45',
      activeUsers: 3240,
      
      // Gaming Hub Metrics
      hubEnters: 15680,
      hubToGameConversion: 79.4,
      
      // Answer Analytics
      questionsAttempted: 124500,
      questionsCorrect: 87150,
      answerAccuracy: 70.0,
      avgTimePerQuestion: 12.5,
      hintsUsed: 18650,
      
      // Session Analytics
      avgSessionDuration: 125000, // milliseconds
      longestSession: 342000,
      sessionCompletionRate: 82.3,
      
      // Error Analytics
      errorCount: 156,
      networkTimeouts: 89,
      gameLoadFailures: 32,
      otherErrors: 35,
      
      // Performance Trends
      trend: 'up',
      growthRate: 15.2
    },
    {
      id: 'football-trivia-master',
      name: 'Football Trivia Master',
      category: 'football',
      gameMode: 'quick_play',
      difficulty: 'easy',
      
      totalPlays: 8920,
      completions: 6789,
      completionRate: 76.1,
      avgSessionTime: '6:30',
      activeUsers: 2890,
      
      hubEnters: 11240,
      hubToGameConversion: 79.4,
      
      questionsAttempted: 89200,
      questionsCorrect: 71360,
      answerAccuracy: 80.0,
      avgTimePerQuestion: 8.2,
      hintsUsed: 12450,
      
      avgSessionDuration: 95000,
      longestSession: 280000,
      sessionCompletionRate: 85.1,
      
      errorCount: 92,
      networkTimeouts: 45,
      gameLoadFailures: 28,
      otherErrors: 19,
      
      trend: 'up',
      growthRate: 8.7
    },
    {
      id: 'sports-quiz-champion',
      name: 'Sports Quiz Champion',
      category: 'sports',
      gameMode: 'tournament',
      difficulty: 'hard',
      
      totalPlays: 6750,
      completions: 4823,
      completionRate: 71.5,
      avgSessionTime: '7:15',
      activeUsers: 2150,
      
      hubEnters: 8940,
      hubToGameConversion: 75.5,
      
      questionsAttempted: 67500,
      questionsCorrect: 40500,
      answerAccuracy: 60.0,
      avgTimePerQuestion: 18.7,
      hintsUsed: 20250,
      
      avgSessionDuration: 165000,
      longestSession: 425000,
      sessionCompletionRate: 78.2,
      
      errorCount: 124,
      networkTimeouts: 67,
      gameLoadFailures: 41,
      otherErrors: 16,
      
      trend: 'down',
      growthRate: -3.2
    }
  ];

  // Filter data based on selected game
  const filteredData = selectedGame 
    ? gamePerformanceData.filter(game => game.id === selectedGame)
    : gamePerformanceData;

  // Add images to filtered data
  const dataWithImages = filteredData.map(game => ({
    ...game,
    imageUrl: getRandomImage(game.id)
  }));

  // Calculate totals from comprehensive data
  const totals = {
    totalPlays: filteredData.reduce((sum, game) => sum + game.totalPlays, 0),
    completions: filteredData.reduce((sum, game) => sum + game.completions, 0),
    activeUsers: filteredData.reduce((sum, game) => sum + game.activeUsers, 0),
    hubEnters: filteredData.reduce((sum, game) => sum + game.hubEnters, 0),
    questionsAttempted: filteredData.reduce((sum, game) => sum + game.questionsAttempted, 0),
    questionsCorrect: filteredData.reduce((sum, game) => sum + game.questionsCorrect, 0),
    errorCount: filteredData.reduce((sum, game) => sum + game.errorCount, 0)
  };

  const overallCompletionRate = totals.totalPlays > 0 ? 
    ((totals.completions / totals.totalPlays) * 100).toFixed(1) : '0';

  const overallAnswerAccuracy = totals.questionsAttempted > 0 ? 
    ((totals.questionsCorrect / totals.questionsAttempted) * 100).toFixed(1) : '0';

  const overallHubConversion = totals.hubEnters > 0 ? 
    ((totals.totalPlays / totals.hubEnters) * 100).toFixed(1) : '0';

  const gameColumns = [
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
          <div>
            <div className="game-title">{value}</div>
            <div className="game-meta">{row.category} • {row.difficulty}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'hubEnters', 
      title: 'Hub Enters', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'totalPlays', 
      title: 'Game Plays', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'hubToGameConversion', 
      title: 'Hub→Game %', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => `${value}%`
    },
    { 
      key: 'answerAccuracy', 
      title: 'Answer Accuracy', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => (
        <span className={`accuracy-badge ${value >= 70 ? 'high' : value >= 50 ? 'medium' : 'low'}`}>
          {value}%
        </span>
      )
    },
    { 
      key: 'completionRate', 
      title: 'Completion %', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => `${value}%`
    },
    { 
      key: 'errorCount', 
      title: 'Errors', 
      sortable: true, 
      align: 'right' as const,
      render: (value: number) => (
        <span className={`error-count ${value > 100 ? 'high' : value > 50 ? 'medium' : 'low'}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'growthRate', 
      title: 'Growth', 
      sortable: true, 
      align: 'center' as const,
      render: (value: number) => (
        <span className={`growth-indicator ${value > 0 ? 'positive' : 'negative'}`}>
          {value > 0 ? '↗️' : '↘️'} {Math.abs(value)}%
        </span>
      )
    }
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div className="page-title-section">
          <h2 className="page-title">
            <Gamepad2 className="page-title-icon" />
            Game Performance Overview
          </h2>
          <p className="page-description">
            Comprehensive performance metrics for individual games including engagement, completion rates, and revenue.
          </p>
        </div>
      </div>

      <div className="analytics-stats">
        <StatsCard
          title="Hub Enters"
          value={totals.hubEnters.toLocaleString()}
          change="12"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Game Plays"
          value={totals.totalPlays.toLocaleString()}
          change="8"
          changeType="positive"
          icon={Gamepad2}
          color="green"
        />
        
        <StatsCard
          title="Answer Accuracy"
          value={`${overallAnswerAccuracy}%`}
          change="3"
          changeType="positive"
          icon={Trophy}
          color="gold"
        />
        
        <StatsCard
          title="Total Errors"
          value={totals.errorCount.toLocaleString()}
          change="-5"
          changeType="negative"
          icon={TrendingUp}
          color="red"
        />
      </div>

      <div className="analytics-charts">
        <Table
          title={selectedGame ? `Performance for ${availableGames.find(g => g.id === selectedGame)?.name}` : 'All Games Performance'}
          columns={gameColumns}
          data={dataWithImages}
          loading={false}
          defaultSortKey="totalPlays"
          defaultSortOrder="desc"
          defaultItemsPerPage={10}
        />
      </div>

      {dataWithImages.length === 0 && (
        <div className="empty-state">
          <Gamepad2 size={64} className="empty-icon" />
          <h3>No Data Available</h3>
          <p>No game performance data found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default GamePerformance;
