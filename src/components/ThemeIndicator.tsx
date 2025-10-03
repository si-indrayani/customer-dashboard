import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import './ThemeIndicator.css';

interface ThemeIndicatorProps {
  className?: string;
}

const ThemeIndicator: React.FC<ThemeIndicatorProps> = ({ className }) => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme();

  return (
    <div className={`theme-indicator ${className || ''}`}>
      <div className="theme-status">
        <span className="theme-label">
          Current Theme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
        </span>
      </div>
      
      <div className="theme-controls">
        <button 
          onClick={() => setDarkMode(false)}
          className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
          title="Light Mode"
        >
          <Sun size={18} />
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="theme-btn toggle"
          title="Toggle Theme"
        >
          <Monitor size={18} />
        </button>
        
        <button 
          onClick={() => setDarkMode(true)}
          className={`theme-btn ${isDarkMode ? 'active' : ''}`}
          title="Dark Mode"
        >
          <Moon size={18} />
        </button>
      </div>
    </div>
  );
};

export default ThemeIndicator;
