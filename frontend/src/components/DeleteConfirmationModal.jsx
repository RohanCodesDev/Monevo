import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import './DeleteConfirmationModal.css';

export const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon">
          <AlertTriangle size={24} />
        </div>
        <h3 className="delete-modal-title">Delete transaction?</h3>
        <p className="delete-modal-desc">
          This action cannot be undone and will permanently remove this record.
        </p>
        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-modal btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal btn-danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
