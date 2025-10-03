import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useGetPopularGamesRankingQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  Trophy, 
  Gamepad2,
  Star, 
  PlayCircle, 
  Award,
  Crown,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import './PopularGamesAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsContextType {
  tenantId: string;
  dateRange: {
    from: string;
    to: string;
  };
}

// Animated counter hook for smooth number animations
const useAnimatedCounter = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * (end - startCount) + startCount));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return count;
};

const PopularGamesAnalytics: React.FC = () => {
  const { tenantId } = useOutletContext<AnalyticsContextType>();
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: popularGamesData,
    error,
    isLoading
  } = useGetPopularGamesRankingQuery({
    tenantId,
    limit: 20
  });

  // All hooks must be called at the top level - before any conditional returns
  const topGame = popularGamesData?.data?.rankings?.[0];
  const totalGames = popularGamesData?.data?.summary?.total_games || 0;
  const totalPlays = popularGamesData?.data?.summary?.total_plays || 0;
  const mostPopularGame = popularGamesData?.data?.summary?.most_popular_game;
  
  const animatedTopGamePlays = useAnimatedCounter(topGame?.plays || topGame?.play_count || 0, 1500);
  const animatedTotalGames = useAnimatedCounter(totalGames, 1500);
  const animatedTotalPlays = useAnimatedCounter(totalPlays, 1500);
  const animatedAveragePlays = useAnimatedCounter(
    popularGamesData?.data?.rankings?.length > 0 
      ? Math.round(popularGamesData.data.rankings.reduce((sum: number, game: any) => sum + (game.plays || game.play_count || 0), 0) / popularGamesData.data.rankings.length)
      : 0, 
    1500
  );

  // Set visibility when data is loaded
  useEffect(() => {
    if (popularGamesData && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [popularGamesData, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="popular-games-analytics loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading popular games analytics...</p>
        </div>
      </div>
    );
  }

  // Return error state only if no data is available
  if (!popularGamesData) {
    return (
      <div className="popular-games-analytics error">
        <div className="error-message">
          <h3>Failed to Load Popular Games Data</h3>
          <p>{error ? (typeof error === 'string' ? error : 'API Error') : 'No data available'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Handle empty data response and prepare chart data
  const hasGamesData = popularGamesData?.data?.rankings && popularGamesData.data.rankings.length > 0;
  const isEmpty = popularGamesData?.data?.summary?.total_games === 0;
  const topGames = hasGamesData ? popularGamesData.data.rankings.slice(0, 10) : [];
  
  // Show empty state if no games data
  if (isEmpty && !isLoading) {
    return (
      <div className={`popular-games-analytics ${isVisible ? 'visible' : ''}`}>
        <div className="games-header">
          <div className="header-content">
            <h2>
              <Trophy size={24} />
              Popular Games Ranking
            </h2>
            <p className="header-subtitle">
              No games data available for the current period
            </p>
          </div>
        </div>
        
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <Gamepad2 size={48} />
            </div>
            <h3>No Popular Games Data</h3>
            <p>
              There are currently no games with popularity data available.<br />
              This could mean:
            </p>
            <ul>
              <li>No games have been played during this period</li>
              <li>Game data hasn't been synchronized yet</li>
              <li>The selected time range has no activity</li>
            </ul>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const barChartData = {
    labels: topGames.map((game: any) => game.name || game.game_name || 'Unknown Game'),
    datasets: [
      {
        label: 'Play Count',
        data: topGames.map((game: any) => game.plays || game.play_count || 0),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(168, 85, 247, 0.8)',   // Purple  
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(245, 158, 11, 0.8)',   // Amber
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(16, 185, 129, 0.8)',   // Emerald
          'rgba(139, 92, 246, 0.8)',   // Violet
        ],
        borderColor: [
          '#6366f1', '#a855f7', '#ec4899', '#fb923c', '#22c55e',
          '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const doughnutChartData = {
    labels: topGames.slice(0, 5).map((game: any) => game.name || game.game_name || 'Unknown Game'),
    datasets: [
      {
        data: topGames.slice(0, 5).map((game: any) => game.plays || game.play_count || 0),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          '#6366f1', '#a855f7', '#ec4899', '#fb923c', '#22c55e'
        ],
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Plays: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: '#374151',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()} plays (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={`popular-games-analytics ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="games-header">
        <div className="header-content">
          <h2>
            <Trophy size={24} />
            Popular Games Ranking
          </h2>
          <p className="header-subtitle">
            Game popularity metrics and player distribution
            {error && (
              <span>⚠️ {typeof error === 'string' ? error : 'API Error'}</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon top-game">
            <Crown size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTopGamePlays.toLocaleString()}</div>
            <div className="stat-label">Top Game Plays</div>
            <div className="stat-change positive">
              {mostPopularGame || topGame?.name || topGame?.game_name || 'N/A'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-games">
            <Gamepad2 size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalGames}</div>
            <div className="stat-label">Total Games</div>
            <div className="stat-change neutral">
              In ranking
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-players">
            <PlayCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedTotalPlays.toLocaleString()}</div>
            <div className="stat-label">Total Plays</div>
            <div className="stat-change positive">
              Across all games
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon avg-players">
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value animated-counter">{animatedAveragePlays.toLocaleString()}</div>
            <div className="stat-label">Avg Plays/Game</div>
            <div className="stat-change neutral">
              Average popularity
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top 10 Games by Plays</h3>
            <div className="chart-subtitle">Play count ranking</div>
          </div>
          <div className="chart-wrapper" style={{ height: '400px' }}>
            {hasGamesData ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                color: '#6b7280',
                fontSize: '16px'
              }}>
                No games data available
              </div>
            )}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top 5 Games Distribution</h3>
            <div className="chart-subtitle">Play share percentage</div>
          </div>
          <div className="chart-wrapper" style={{ height: '400px' }}>
            {hasGamesData ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                color: '#6b7280',
                fontSize: '16px'
              }}>
                No games data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="games-list-container">
        <div className="list-header">
          <h3>Complete Games Ranking</h3>
          <div className="list-subtitle">All games sorted by popularity</div>
        </div>
        <div className="games-list">
          {hasGamesData ? popularGamesData.data.rankings.map((game: any, index: number) => (
            <div key={index} className="game-item">
              <div className="game-rank">
                <span className="rank-number">#{index + 1}</span>
                {index === 0 && <Crown size={16} className="crown-icon" />}
                {index === 1 && <Award size={16} className="award-icon" />}
                {index === 2 && <Star size={16} className="star-icon" />}
              </div>
              <div className="game-info">
                <div className="game-name">{game.name || game.game_name || 'Unknown Game'}</div>
                <div className="game-stats">
                  <PlayCircle size={14} />
                  <span>{(game.plays || game.play_count || 0).toLocaleString()} plays</span>
                </div>
              </div>
              <div className="game-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${((game.plays || game.play_count || 0) / (topGame?.plays || topGame?.play_count || 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )) : (
            <div className="no-games-message">
              <p>No games data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularGamesAnalytics;
