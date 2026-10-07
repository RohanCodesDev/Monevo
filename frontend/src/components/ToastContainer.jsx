import React from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './ToastContainer.css';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTransactions();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'warning' && <AlertCircle size={16} />}
            {toast.type === 'info' && <Info size={16} />}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
