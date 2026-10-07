import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import './AuthModal.css';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, registerUser } = useTransactions();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isRegister) {
      res = await registerUser(name, email, password);
    } else {
      res = await loginUser(email, password);
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Authentication error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div>
            <h3 className="auth-modal-title">
              {isRegister ? 'Create an Account' : 'Welcome to Monevo'}
            </h3>
            <p className="auth-modal-subtitle">
              {isRegister
                ? 'Sign up to sync your personal financial records across all devices'
                : 'Log in to access your cloud-synchronized expense portfolio'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-field">
              <label className="field-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label className="field-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={loading}
          >
            <span>{loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>

          <div className="auth-switch-prompt">
            <span>
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
            </span>
            <button
              type="button"
              className="btn-switch-mode"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
