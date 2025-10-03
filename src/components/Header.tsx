import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronLeft, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

interface HeaderProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, sidebarOpen }) => {
  // Get theme from context
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/players') return 'Players';
    if (path === '/games') return 'Games';
    if (path.startsWith('/analytics')) {
      if (path === '/analytics' || path === '/analytics/daily-active-users') return 'Daily Active Users';
      if (path === '/analytics/game-plays') return 'Game Plays';
      if (path === '/analytics/completions') return 'Game Completions';
      if (path === '/analytics/session-time') return 'Session Time';
      if (path === '/analytics/accuracy') return 'Answer Accuracy';
      if (path === '/analytics/events') return 'Events by Type';
      return 'Analytics';
    }
    if (path === '/revenue') return 'Revenue';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  const title = getPageTitle();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${sidebarOpen ? 'header-sidebar-open' : ''} ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-left">
        <button 
          className="header-menu-btn"
          onClick={onSidebarToggle}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="header-title">{title}</h1>
        
        {/* Search moved closer to heading */}
        <div className="header-search">
          <Search size={18} className="header-search-icon" />
          <input 
            type="text" 
            placeholder="Search games, players..." 
            className="header-search-input"
          />
        </div>
      </div>
      
      <div className="header-right">        
        <div className="header-actions">
          {/* Dark mode toggle */}
          <button 
            className="header-action-btn header-theme-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="header-action-btn">
            <Bell size={20} />
            <span className="header-notification-badge">3</span>
          </button>
          
          <div className="header-profile">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile" 
              className="header-profile-image"
            />
            <span className="header-profile-name">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
