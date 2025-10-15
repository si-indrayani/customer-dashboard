import React, { useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { Calendar, Filter, RefreshCw, TrendingUp, Gamepad2, Target, Trophy, BarChart3 } from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import './Analytics.css';

const Analytics: React.FC = () => {
  const location = useLocation();
  const { selectedTenantId } = useTenant();
  const [dateRange, setDateRange] = useState({
    from: '2025-09-01',
    to: '2025-09-30'
  });
  const [selectedGame, setSelectedGame] = useState('');

  // Array of dummy game images to randomly assign
  const dummyImages = [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100&h=100&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop&crop=center'
  ];

  // Function to get random image for a game (consistent per game name)
  const getRandomImage = (gameName: string) => {
    // Use game name hash to ensure consistent image assignment
    const hash = gameName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % dummyImages.length;
    return dummyImages[index];
  };

  // Mock games data with images
  const availableGames = [
    { id: 'quiz_football_001', name: 'Football Quiz', image: getRandomImage('quiz_football_001') },
    { id: 'quiz_basketball_001', name: 'Basketball Quiz', image: getRandomImage('quiz_basketball_001') },
    { id: 'quiz_soccer_001', name: 'Soccer Quiz', image: getRandomImage('quiz_soccer_001') }
  ];

  const analyticsRoutes = [
    {
      path: '/analytics/traffic',
      name: 'Traffic Analytics',
      icon: TrendingUp,
      description: 'Website traffic and visitor metrics'
    },
    {
      path: '/analytics/game-engagement',
      name: 'Game Engagement',
      icon: Gamepad2,
      description: 'Game-specific engagement metrics'
    },
    {
      path: '/analytics/performance',
      name: 'Performance Analytics',
      icon: Target,
      description: 'Game performance and accuracy metrics'
    },
    {
      path: '/analytics/popular-games',
      name: 'Popular Games',
      icon: Trophy,
      description: 'Game popularity rankings and plays'
    },
    {
      path: '/analytics/conversion-funnel',
      name: 'Conversion Funnel',
      icon: BarChart3,
      description: 'User conversion and funnel analysis'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="analytics-layout">
      {/* Analytics Header */}
      <div className="analytics-header">
        <div className="analytics-header-content">
          {/* Global Filters */}
          <div className="analytics-filters">
            <div className="filter-group">
              <label className="filter-label">
                <Calendar size={16} />
                Date Range
              </label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="date-input"
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="date-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <Filter size={16} />
                Game Filter
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="game-select"
              >
                <option value="">All Games</option>
                {availableGames.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleRefresh}
              className="refresh-btn"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Navigation - hidden on /analytics/traffic */}
      {location.pathname !== '/analytics/traffic' && (
        <nav className="analytics-nav">
          <div className="analytics-nav-content">
            {analyticsRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`analytics-nav-item ${isActive(route.path) ? 'active' : ''}`}
                >
                  <Icon size={20} className="nav-item-icon" />
                  <div className="nav-item-content">
                    <span className="nav-item-name">{route.name}</span>
                    <span className="nav-item-description">{route.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Analytics Content */}
      <main className="analytics-content">
        <Outlet context={{ tenantId: selectedTenantId, dateRange, selectedGame, availableGames, getRandomImage }} />
      </main>
    </div>
  );
};

export default Analytics;
