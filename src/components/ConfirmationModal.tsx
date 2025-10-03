import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'warning' | 'info' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <div className="confirmation-modal-title">
            <AlertCircle className={`confirmation-modal-icon ${type}`} size={24} />
            <h3>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="confirmation-modal-close"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="confirmation-modal-content">
          <p>{message}</p>
        </div>
        
        <div className="confirmation-modal-actions">
          <button
            onClick={onClose}
            className="confirmation-modal-button cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`confirmation-modal-button confirm ${type}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
