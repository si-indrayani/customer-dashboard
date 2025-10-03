import React from 'react';
import { Gamepad2 } from 'lucide-react';
import './AnimatedLogo.css';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'medium', 
  showText = true 
}) => {
  return (
    <div className={`animated-logo animated-logo-${size}`}>
      <div className="logo-container">
        <div className="logo-background"></div>
        <div className="logo-icon-wrapper">
          <Gamepad2 className="logo-icon" />
          <div className="logo-glow"></div>
          <div className="logo-particles">
            <span className="particle particle-1"></span>
            <span className="particle particle-2"></span>
            <span className="particle particle-3"></span>
            <span className="particle particle-4"></span>
          </div>
        </div>
      </div>
      
      {showText && (
        <div className="logo-text">
          <span className="logo-text-admin">Admin</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
