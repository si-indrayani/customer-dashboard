import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetConversionFunnelQuery } from '../store/api/analyticsApi';
import { useNavigate } from 'react-router-dom';
import './GameCompletionPieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GameCompletionPieChartProps {
  tenantId: string;
  height?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

const GameCompletionPieChart: React.FC<GameCompletionPieChartProps> = ({ 
  tenantId,
  height = '300px',
  dateRange
}) => {
  const navigate = useNavigate();
  
  const {
    data: conversionData,
    error,
    isLoading
  } = useGetConversionFunnelQuery({
    tenantId,
    dateFrom: dateRange?.from,
    dateTo: dateRange?.to
  });

  const handleChartClick = () => {
    navigate('/analytics/conversion-funnel');
  };

  if (isLoading) {
    return (
      <div className="game-completion-pie-chart loading">
        <div className="chart-header">
          <h3>Game Completion Status</h3>
          <div className="chart-subtitle">Loading completion data...</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-completion-pie-chart error">
        <div className="chart-header">
          <h3>Game Completion Status</h3>
          <div className="chart-subtitle">Failed to load data</div>
        </div>
        <div className="chart-container" style={{ height }}>
          <div className="error-message">
            <p>Failed to load completion data</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate completion data
  const gameStarts = conversionData?.data?.summary?.game_starts || 0;
  const gameCompletions = conversionData?.data?.summary?.game_completions || 0;
  const abandonedGames = gameStarts - gameCompletions;

  const chartData = {
    labels: ['Completed Games', 'Abandoned Games'],
    datasets: [
      {
        data: [gameCompletions, abandonedGames],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for completed
          'rgba(239, 68, 68, 0.8)',   // Red for abandoned
        ],
        borderColor: [
          '#22c55e',   // Green
          '#ef4444',   // Red
        ],
        borderWidth: 2,
        hoverOffset: 8,
        cutout: '0%', // Makes it a full pie chart
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold' as const,
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
  };

  const completionRate = gameStarts > 0 ? ((gameCompletions / gameStarts) * 100).toFixed(1) : 0;

  return (
    <div className="game-completion-pie-chart clickable" onClick={handleChartClick}>
      <div className="chart-header">
        <h3>Game Completion Status</h3>
        <div className="chart-subtitle">
          Completion Rate: {completionRate}%
        </div>
      </div>
      <div className="chart-container" style={{ height }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GameCompletionPieChart;
