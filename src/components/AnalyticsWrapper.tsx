import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { useGetClientGamesQuery } from '../store/api/gamesApi';
import './AnalyticsWrapper.css';

const AnalyticsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTenantId } = useTenant();
  
  const [dateRange, setDateRange] = useState({
    from: '2025-09-01',
    to: '2025-09-30'
  });

  // Also fetch games data to ensure it's cached when tenant changes
  const { data: _gamesData } = useGetClientGamesQuery(selectedTenantId, {
    skip: !selectedTenantId,
  });

  const handleBackToAnalytics = () => {
    navigate('/analytics');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="analytics-wrapper">
      {/* Analytics Header */}
      <div className="analytics-wrapper-header">
        <div className="analytics-wrapper-header-content">
          <button 
            onClick={handleBackToAnalytics}
            className="back-to-analytics-btn"
          >
            <ArrowLeft size={16} />
            Back to Analytics
          </button>

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

      {/* Analytics Content */}
      <main className="analytics-wrapper-content">
        <Outlet context={{ tenantId: selectedTenantId, dateRange }} />
      </main>
    </div>
  );
};

export default AnalyticsWrapper;
