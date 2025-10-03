import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  activeLabel?: string;
  inactiveLabel?: string;
  showLabels?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  showLabels = true
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`toggle-switch-container ${size}`}>
      {showLabels && (
        <span className={`toggle-label ${checked ? 'active' : 'inactive'}`}>
          {checked ? activeLabel : inactiveLabel}
        </span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`toggle-switch ${size} ${checked ? 'checked' : 'unchecked'} ${disabled ? 'disabled' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${checked ? activeLabel : inactiveLabel}`}
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );
};

export default ToggleSwitch;
