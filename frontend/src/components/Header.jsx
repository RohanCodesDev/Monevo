import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.jsx';
import { Plus, Check, CloudOff, RefreshCw } from 'lucide-react';
import './Header.css';

export const Header = ({ onOpenAddModal }) => {
  const { syncStatus } = useTransactions();

  return (
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
          {/* Subtle sync indicator */}
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
  );
};
