import React from 'react';
import type { LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  animated?: boolean;
  prefix?: string;
  suffix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  animated = true,
  prefix = '',
  suffix = ''
}) => {
  const isNumeric = typeof value === 'number' || !isNaN(Number(value));
  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-card-header">
          <div className="stats-card-title">{title}</div>
          <div className={`stats-card-icon stats-card-icon-${color}`}>
            <Icon size={24} />
          </div>
        </div>
        
        <div className="stats-card-value">
          {animated && isNumeric ? (
            <AnimatedCounter 
              value={Number(value)} 
              prefix={prefix}
              suffix={suffix}
            />
          ) : (
            `${prefix}${value}${suffix}`
          )}
        </div>
        
        {change && (
          <div className={`stats-card-change stats-card-change-${changeType}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
