import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import './GameEditModal.css';

interface GameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  gameTitle: string;
  gameDescription: string;
  isLoading?: boolean;
}

const GameEditModal: React.FC<GameEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  gameTitle,
  gameDescription,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(gameTitle || '');
      setDescription(gameDescription || '');
    }
  }, [isOpen, gameTitle, gameDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim() });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="game-edit-modal-overlay" onClick={handleClose}>
      <div className="game-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-edit-modal-header">
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              <Edit3 size={22} className="modal-icon" />
            </div>
            <div className="modal-title-section">
              <h3 className="modal-title">Edit Game Information</h3>
              <p className="modal-subtitle">Update the game title and description</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={isLoading}
            type="button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="game-edit-form">
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="game-title" className="form-label">
                <span className="label-text">Game Title</span>
                <span className="label-required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="game-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`form-input ${title.trim() ? 'has-value' : ''}`}
                  placeholder="Enter a descriptive game title"
                  required
                  disabled={isLoading}
                  maxLength={100}
                />
                <div className="input-border"></div>
              </div>
              <div className="input-footer">
                <div className="input-hint">
                  <span className={title.length > 80 ? 'text-warning' : ''}>
                    {title.length}/100 characters
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <label htmlFor="game-description" className="form-label">
                <span className="label-text">Description</span>
                <span className="label-optional">optional</span>
              </label>
              <div className="textarea-wrapper">
                <textarea
                  id="game-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`form-textarea ${description.trim() ? 'has-value' : ''}`}
                  placeholder="Provide additional details about the game..."
                  disabled={isLoading}
                  rows={2}
                  maxLength={500}
                />
                <div className="textarea-border"></div>
              </div>
              <div className="input-footer">
                <div className="input-hint">
                  <span className={description.length > 400 ? 'text-warning' : ''}>
                    {description.length}/500 characters
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameEditModal;
