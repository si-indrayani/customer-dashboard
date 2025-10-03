import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useGetPopularGamesRankingQuery } from '../store/api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PopularGamesChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PopularGamesChartProps {
  tenantId: string;
  height?: string;
  limit?: number;
}

const PopularGamesChart: React.FC<PopularGamesChartProps> = ({ 
  tenantId,
  height = '300px',
  limit = 5 
}) => {
  const navigate = useNavigate();
  
  const {
    data: popularGamesData,
    error,
    isLoading
  } = useGetPopularGamesRankingQuery({
    tenantId,
    limit
  });

  const handleChartClick = () => {
    navigate('/analytics/popular-games');
  };

  if (isLoading) {
    return (
      <div className="popular-games-chart loading">
        <div className="chart-header">
          <h3>Popular Games Ranking</h3>
          <div className="chart-subtitle">Loading popular games...</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading popular games...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-games-chart error">
        <div className="chart-header">
          <h3>Popular Games Ranking</h3>
          <div className="chart-subtitle">Failed to load popular games data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load popular games data</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have games data
  const hasGamesData = popularGamesData?.data?.rankings && popularGamesData.data.rankings.length > 0;

  // Prepare chart data
  const chartData = {
    labels: hasGamesData ? popularGamesData.data.rankings.map((game: any) => game.name || game.game_name || 'Unknown Game') : [],
    datasets: [
      {
        label: 'Play Count',
        data: hasGamesData ? popularGamesData.data.rankings.map((game: any) => game.plays || game.play_count || 0) : [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(168, 85, 247, 0.8)',   // Purple  
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(34, 197, 94, 0.8)',    // Green
        ],
        borderColor: [
          '#6366f1',   // Indigo
          '#a855f7',   // Purple
          '#ec4899',   // Pink
          '#fb923c',   // Orange
          '#22c55e',   // Green
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
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
        display: true,
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
        display: true,
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

  return (
    <div className="popular-games-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>Popular Games Ranking</h3>
        <div className="chart-subtitle">
          {popularGamesData?.data?.summary ? 
            `Top ${popularGamesData.data.rankings?.length || 0} games` : 
            'Click for detailed view'
          }
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        {hasGamesData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            <p>No popular games data available</p>
            <small>Click to view detailed analytics</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularGamesChart;
