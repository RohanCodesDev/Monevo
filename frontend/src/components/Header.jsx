import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.jsx';
import { Plus, Check, CloudOff, RefreshCw, Sun, Moon, User, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal.jsx';
import './Header.css';

export const Header = ({ onOpenAddModal }) => {
  const { syncStatus, theme, toggleTheme, currentUser, logoutUser } = useTransactions();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand-group">
            <NavLink to="/" className="header-logo">
              <span className="logo-icon">M</span>
              <span className="logo-text">MONEVO</span>
            </NavLink>
            <span className="logo-tagline">Your Money, In Motion.</span>
          </div>

          <nav className="header-nav" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Overview
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Transactions
            </NavLink>
          </nav>

          <div className="header-actions">
            {/* User Profile / Auth Toggle */}
            {currentUser ? (
              <div className="user-profile-badge">
                <span className="user-name-label" title={currentUser.email}>
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="btn-logout"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-login-open"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User size={14} />
                <span>Log In</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Sync indicator */}
            <div className={`sync-indicator sync-${syncStatus}`} title={`Sync Status: ${syncStatus}`}>
              {syncStatus === 'synced' && (
                <>
                  <Check size={12} className="sync-icon" />
                  <span className="sync-label">Synced</span>
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw size={12} className="sync-icon spin" />
                  <span className="sync-label">Syncing</span>
                </>
              )}
              {syncStatus === 'saved-locally' && (
                <>
                  <span className="sync-dot"></span>
                  <span className="sync-label">Local</span>
                </>
              )}
              {syncStatus === 'offline' && (
                <>
                  <CloudOff size={12} className="sync-icon" />
                  <span className="sync-label">Offline</span>
                </>
              )}
            </div>

            <button
              type="button"
              className="btn-add-transaction"
              onClick={onOpenAddModal}
              id="add-transaction-button"
              aria-label="Add Transaction"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="btn-text">Add</span>
            </button>
          </div>
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};
