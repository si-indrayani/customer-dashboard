import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Settings } from 'lucide-react';
import ruleFieldsConfig from '../data/ruleFields.json';
import './RuleCreation.css';

interface RuleField {
  id: string;
  label: string;
  type: string;
  datatype: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
}

const RuleCreation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameTitle = searchParams.get('gameTitle') || 'Unknown Game';

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields: RuleField[] = ruleFieldsConfig.fields;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.id];
      const isRequired = field.required !== false; // Default to required
      
      // Check if required field is empty
      if (isRequired) {
        if (field.type === 'checkbox' && field.options) {
          // Multiple checkboxes - require at least one selected
          if (!Array.isArray(value) || value.length === 0) {
            newErrors[field.id] = `Please select at least one ${field.label.toLowerCase()}`;
            return;
          }
        } else if (field.type === 'checkbox' && !field.options) {
          // Single checkbox - require it to be checked
          if (value !== true) {
            newErrors[field.id] = `${field.label} is required`;
            return;
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.id] = `${field.label} is required`;
          return;
        }
      }

      // Type-specific validation
      if (value && typeof value === 'string' && value.trim()) {
        switch (field.datatype) {
          case 'integer':
            const intValue = parseInt(value);
            if (isNaN(intValue)) {
              newErrors[field.id] = `${field.label} must be a valid number`;
            } else if (field.min !== undefined && intValue < field.min) {
              newErrors[field.id] = `${field.label} must be at least ${field.min}`;
            } else if (field.max !== undefined && intValue > field.max) {
              newErrors[field.id] = `${field.label} must be no more than ${field.max}`;
            }
            break;

          case 'number':
          case 'float':
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              newErrors[field.id] = `${field.label} must be a valid number`;
            } else if (field.min !== undefined && numValue < field.min) {
              newErrors[field.id] = `${field.label} must be at least ${field.min}`;
            } else if (field.max !== undefined && numValue > field.max) {
              newErrors[field.id] = `${field.label} must be no more than ${field.max}`;
            }
            break;

          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              newErrors[field.id] = `${field.label} must be a valid email address`;
            }
            break;

          case 'url':
            try {
              new URL(value);
            } catch {
              newErrors[field.id] = `${field.label} must be a valid URL`;
            }
            break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Convert data types as needed
        const processedData = { ...formData };
        fields.forEach(field => {
          const value = processedData[field.id];
          
          if (value !== undefined && value !== null) {
            switch (field.datatype) {
              case 'integer':
                processedData[field.id] = parseInt(value);
                break;
              case 'number':
              case 'float':
                processedData[field.id] = parseFloat(value);
                break;
              case 'boolean':
                processedData[field.id] = Boolean(value);
                break;
              case 'array':
                // For multiple checkboxes or multi-select
                if (!Array.isArray(value)) {
                  processedData[field.id] = [value];
                }
                break;
              // 'string' and other types remain as-is
            }
          }
        });

        // TODO: Submit to API
        console.log('Rule data for game:', gameTitle, processedData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate back to games page with success message
        navigate('/games?ruleCreated=true');
        
      } catch (error) {
        console.error('Failed to create rule:', error);
        // Handle error - maybe show toast
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderField = (field: RuleField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const isRequired = field.required !== false; // Default to required

    const renderInput = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
          return (
            <input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-input ${error ? 'error' : ''}`}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            />
          );

        case 'number':
          return (
            <input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-input ${error ? 'error' : ''}`}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              min={field.min}
              max={field.max}
            />
          );

        case 'textarea':
          return (
            <textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-textarea ${error ? 'error' : ''}`}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              rows={4}
            />
          );

        case 'select':
          return (
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-select ${error ? 'error' : ''}`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'radio':
          return (
            <div className="radio-group">
              {field.options?.map((option) => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="radio-input"
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          );

        case 'checkbox':
          if (field.options) {
            // Multiple checkboxes
            const selectedValues = Array.isArray(value) ? value : [];
            return (
              <div className="checkbox-group">
                {field.options.map((option) => (
                  <label key={option.value} className="checkbox-option">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter(v => v !== option.value);
                        handleInputChange(field.id, newValues);
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">{option.label}</span>
                  </label>
                ))}
              </div>
            );
          } else {
            // Single checkbox
            return (
              <label className="checkbox-single">
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-label">{field.label}</span>
              </label>
            );
          }

        case 'date':
          return (
            <input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-input ${error ? 'error' : ''}`}
            />
          );

        case 'time':
          return (
            <input
              id={field.id}
              type="time"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-input ${error ? 'error' : ''}`}
            />
          );

        case 'range':
          return (
            <div className="range-container">
              <input
                id={field.id}
                type="range"
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`field-range ${error ? 'error' : ''}`}
                min={field.min || 0}
                max={field.max || 100}
              />
              <span className="range-value">{value}</span>
            </div>
          );

        default:
          // Fallback to text input
          return (
            <input
              id={field.id}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`field-input ${error ? 'error' : ''}`}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            />
          );
      }
    };

    return (
      <div key={field.id} className="form-field">
        <label htmlFor={field.id} className="field-label">
          {field.label}
          {isRequired && <span className="required-indicator">*</span>}
        </label>
        {renderInput()}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  };

  return (
    <div className="rule-creation-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <button 
            className="back-button"
            onClick={() => navigate('/games')}
          >
            <ArrowLeft size={20} />
            <span>Back to Games</span>
          </button>
          
          <div className="header-content">
            <div className="header-icon">
              <Settings size={32} />
            </div>
            <div className="header-text">
              <h1 className="page-title">Create Game Rule</h1>
              <p className="page-subtitle">Configure rules for "{gameTitle}"</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="rule-form">
            <div className="form-section">
              <h2 className="section-title">Rule Configuration</h2>
              <div className="fields-grid">
                {fields.map(renderField)}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/games')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Creating Rule...' : 'Create Rule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RuleCreation;
