import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp,
  Gamepad2, 
  Target, 
  Trophy, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import './AnalyticsOverview.css';

const AnalyticsOverview: React.FC = () => {
  const analyticsModules = [
    {
      path: '/analytics/traffic',
      name: 'Traffic Analytics',
      icon: TrendingUp,
      description: 'Website traffic and visitor metrics',
      color: 'blue',
      metrics: ['Unique Visitors', 'Page Views', 'Session Duration', 'Bounce Rate']
    },
    {
      path: '/analytics/game-engagement',
      name: 'Game Engagement',
      icon: Gamepad2,
      description: 'Game-specific engagement metrics',
      color: 'purple',
      metrics: ['Session Time', 'Completion Rate', 'User Retention', 'Engagement Score']
    },
    {
      path: '/analytics/performance',
      name: 'Performance Analytics',
      icon: Target,
      description: 'Game performance and accuracy metrics',
      color: 'green',
      metrics: ['Answer Accuracy', 'Response Time', 'Error Rate', 'Success Rate']
    },
    {
      path: '/analytics/popular-games',
      name: 'Popular Games',
      icon: Trophy,
      description: 'Game popularity rankings and plays',
      color: 'orange',
      metrics: ['Play Count', 'Player Rankings', 'Game Popularity', 'Trending Games']
    },
    {
      path: '/analytics/conversion-funnel',
      name: 'Conversion Funnel',
      icon: BarChart3,
      description: 'User conversion and funnel analysis',
      color: 'indigo',
      metrics: ['Hub Visits', 'Game Starts', 'Completions', 'Drop-off Rate']
    }
  ];

  return (
    <div className="analytics-overview">
      {/* Header */}
      <div className="analytics-overview-header">
        <h1>Analytics Dashboard</h1>
        <p className="header-subtitle">
          Comprehensive insights and performance metrics for your gaming platform
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="analytics-modules-grid">
        {analyticsModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.path}
              to={module.path}
              className={`analytics-card analytics-card-${module.color}`}
            >
              <div className="analytics-card-header">
                <div className="analytics-card-icon">
                  <Icon size={24} />
                </div>
                <div className="analytics-card-arrow">
                  <ArrowRight size={20} />
                </div>
              </div>
              
              <div className="analytics-card-content">
                <h3 className="analytics-card-title">{module.name}</h3>
                <p className="analytics-card-description">{module.description}</p>
                
                <div className="analytics-card-metrics">
                  {module.metrics.map((metric, index) => (
                    <span key={index} className="metric-tag">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
      <div className="quick-stats-section">
        <h2>Quick Overview</h2>
        <div className="quick-stats-grid">
          <div className="quick-stat-card">
            <div className="quick-stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="quick-stat-content">
              <div className="quick-stat-value">5</div>
              <div className="quick-stat-label">Analytics Modules</div>
            </div>
          </div>
          
          <div className="quick-stat-card">
            <div className="quick-stat-icon">
              <BarChart3 size={20} />
            </div>
            <div className="quick-stat-content">
              <div className="quick-stat-value">Real-time</div>
              <div className="quick-stat-label">Data Updates</div>
            </div>
          </div>
          
          <div className="quick-stat-card">
            <div className="quick-stat-icon">
              <Target size={20} />
            </div>
            <div className="quick-stat-content">
              <div className="quick-stat-value">API</div>
              <div className="quick-stat-label">Connected</div>
            </div>
          </div>
          
          <div className="quick-stat-card">
            <div className="quick-stat-icon">
              <Trophy size={20} />
            </div>
            <div className="quick-stat-content">
              <div className="quick-stat-value">tenant_001</div>
              <div className="quick-stat-label">Active Tenant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
