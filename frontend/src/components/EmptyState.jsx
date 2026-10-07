import React from 'react';
import { Plus, ReceiptText } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({ title, description, onAction, actionLabel = 'Add Transaction' }) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <ReceiptText size={28} />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {onAction && (
        <button
          type="button"
          className="empty-state-btn"
          onClick={onAction}
        >
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
