import React, { useState } from 'react';
import { useGameMutations } from '../hooks/useGames';
import type { Game } from '../store/api/gamesApi';
import './GameForm.css';

interface GameFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Game>;
  mode?: 'create' | 'edit';
}

const GameForm: React.FC<GameFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  mode = 'create'
}) => {
  const {
    handleCreateGame,
    handleUpdateGame,
    isCreating,
    isUpdating,
    createError,
    updateError
  } = useGameMutations();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    gameType: initialData?.gameType || 'HOSTED_LINK' as const,
    url: initialData?.url || '',
    status: initialData?.status || 'ACTIVE' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const gameData = {
      ...formData,
      description: formData.description.trim() || null,
    };

    let result;
    if (mode === 'create') {
      result = await handleCreateGame(gameData);
    } else if (initialData?.id) {
      result = await handleUpdateGame(initialData.id, gameData);
    }

    if (result?.success) {
      onSuccess?.();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <div className="game-form-container">
      <form onSubmit={handleSubmit} className="game-form">
        <h2 className="game-form-title">
          {mode === 'create' ? 'Add New Game' : 'Edit Game'}
        </h2>

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${errors.title ? 'form-input-error' : ''}`}
            disabled={isLoading}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gameType" className="form-label">
              Game Type
            </label>
            <select
              id="gameType"
              name="gameType"
              value={formData.gameType}
              onChange={handleInputChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="HOSTED_LINK">Hosted Link</option>
              <option value="UPLOADED_BUILD">Uploaded Build</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DEPRECATED">Deprecated</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            className={`form-input ${errors.url ? 'form-input-error' : ''}`}
            disabled={isLoading}
          />
          {errors.url && <span className="form-error">{errors.url}</span>}
        </div>

        {error && (
          <div className="form-error-message">
            Error: {typeof error === 'object' && 'message' in error 
              ? String(error.message) 
              : String(error)
            }
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Game' : 'Update Game')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;
