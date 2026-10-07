import React from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import './SummaryCards.css';

export const SummaryCards = () => {
  const { metrics } = useTransactions();
  const { balance, income, expenses } = metrics;

  return (
    <div className="summary-cards-grid">
      {/* Balance Card (Hero) */}
      <div className="summary-card balance-card">
        <div className="card-header">
          <span className="card-label">Total Balance</span>
          <div className="card-icon-badge">
            <Wallet size={16} />
          </div>
        </div>
        <div className="card-value-wrapper">
          <h3 className={`card-value balance-value ${balance < 0 ? 'negative' : ''}`}>
            {formatCurrency(balance)}
          </h3>
        </div>
        <div className="card-footer">
          <span className="card-subtext">
            {income > 0 || expenses > 0
              ? `${formatCurrency(income)} in · ${formatCurrency(expenses)} out`
              : 'No activity this month'}
          </span>
        </div>
      </div>

      {/* Income Card */}
      <div className="summary-card income-card">
        <div className="card-header">
          <span className="card-label">Income</span>
          <div className="card-icon-badge income-badge">
            <ArrowUpRight size={16} />
          </div>
        </div>
        <div className="card-value-wrapper">
          <h3 className="card-value income-value">
            {formatCurrency(income)}
          </h3>
        </div>
        <div className="card-footer">
          <span className="card-subtext">Recorded incoming cash</span>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="summary-card expense-card">
        <div className="card-header">
          <span className="card-label">Expenses</span>
          <div className="card-icon-badge expense-badge">
            <ArrowDownRight size={16} />
          </div>
        </div>
        <div className="card-value-wrapper">
          <h3 className="card-value expense-value">
            {formatCurrency(expenses)}
          </h3>
        </div>
        <div className="card-footer">
          <span className="card-subtext">Recorded spending</span>
        </div>
      </div>
    </div>
  );
};
