import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Users, Gamepad2, Trophy } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DateRange {
  from: string;
  to: string;
}

interface DashboardAnalyticsProps {
  dateRange: DateRange;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ dateRange }) => {
  
  // Generate mock data based on date range
  const generateMockData = (fromDate: string, toDate: string, baseValue: number, variance: number) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const data = [];
    const labels = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const value = Math.floor(baseValue + (Math.random() - 0.5) * variance);
      data.push(Math.max(0, value));
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return { labels, data };
  };

  const dauData = generateMockData(dateRange.from, dateRange.to, 150, 50);
  const gamePlaysData = generateMockData(dateRange.from, dateRange.to, 80, 30);
  const completionsData = generateMockData(dateRange.from, dateRange.to, 45, 20);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.4)',
          lineWidth: 1,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.3)',
          lineWidth: 1,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
          maxTicksLimit: 7,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 6,
      },
      bar: {
        borderRadius: 3,
      },
    },
  };

  const dailyActiveUsersChart = {
    labels: dauData.labels,
    datasets: [
      {
        data: dauData.data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
      },
    ],
  };

  const gamePlaysChart = {
    labels: gamePlaysData.labels,
    datasets: [
      {
        data: gamePlaysData.data,
        backgroundColor: '#f093fb',
        borderColor: '#f093fb',
      },
    ],
  };

  const completionsChart = {
    labels: completionsData.labels,
    datasets: [
      {
        data: completionsData.data,
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard-analytics-grid">
      <div className="mini-chart-card">
        <div className="mini-chart-header">
          <div className="mini-chart-title">
            <Users size={16} />
            <span>Daily Active Users</span>
          </div>
          <div className="mini-chart-value">
            {dauData.data.reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
        </div>
        <div className="mini-chart-content">
          <Line data={dailyActiveUsersChart} options={chartOptions} />
        </div>
      </div>

      <div className="mini-chart-card">
        <div className="mini-chart-header">
          <div className="mini-chart-title">
            <Gamepad2 size={16} />
            <span>Game Plays</span>
          </div>
          <div className="mini-chart-value">
            {gamePlaysData.data.reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
        </div>
        <div className="mini-chart-content">
          <Bar data={gamePlaysChart} options={chartOptions} />
        </div>
      </div>

      <div className="mini-chart-card">
        <div className="mini-chart-header">
          <div className="mini-chart-title">
            <Trophy size={16} />
            <span>Completions</span>
          </div>
          <div className="mini-chart-value">
            {completionsData.data.reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
        </div>
        <div className="mini-chart-content">
          <Line data={completionsChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
