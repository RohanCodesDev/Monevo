import React from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import './MonthlyOverview.css';

export const MonthlyOverview = () => {
  const { metrics } = useTransactions();
  const { income, expenses } = metrics;

  const totalFlow = income + expenses;
  const incomePercent = totalFlow > 0 ? Math.round((income / totalFlow) * 100) : 0;
  const expensePercent = totalFlow > 0 ? Math.round((expenses / totalFlow) * 100) : 0;

  const maxVal = Math.max(income, expenses, 1);
  const incomeBarWidth = `${Math.min(100, Math.round((income / maxVal) * 100))}%`;
  const expenseBarWidth = `${Math.min(100, Math.round((expenses / maxVal) * 100))}%`;

  return (
    <div className="insight-card monthly-overview-card">
      <div className="insight-card-header">
        <h3 className="insight-card-title">Monthly Overview</h3>
        <span className="insight-card-badge">Comparison</span>
      </div>

      {totalFlow === 0 ? (
        <div className="insight-empty">
          <p>No transactions recorded for this period yet.</p>
        </div>
      ) : (
        <div className="overview-content">
          {/* Proportional Ratio Bar */}
          <div className="ratio-bar-container">
            <div className="ratio-bar" role="progressbar" aria-label="Income vs Expense ratio">
              <div
                className="ratio-segment segment-income"
                style={{ width: `${incomePercent}%` }}
                title={`Income: ${incomePercent}%`}
              />
              <div
                className="ratio-segment segment-expense"
                style={{ width: `${expensePercent}%` }}
                title={`Expense: ${expensePercent}%`}
              />
            </div>
            <div className="ratio-labels">
              <span className="ratio-label-income">{incomePercent}% Income</span>
              <span className="ratio-label-expense">{expensePercent}% Expenses</span>
            </div>
          </div>

          {/* Metric Comparison Bars */}
          <div className="metric-bars-list">
            <div className="metric-bar-item">
              <div className="metric-bar-meta">
                <span className="metric-name">Total Income</span>
                <span className="metric-val text-income">+{formatCurrency(income)}</span>
              </div>
              <div className="metric-track">
                <div
                  className="metric-fill fill-income"
                  style={{ width: incomeBarWidth }}
                />
              </div>
            </div>

            <div className="metric-bar-item">
              <div className="metric-bar-meta">
                <span className="metric-name">Total Expenses</span>
                <span className="metric-val text-expense">−{formatCurrency(expenses)}</span>
              </div>
              <div className="metric-track">
                <div
                  className="metric-fill fill-expense"
                  style={{ width: expenseBarWidth }}
                />
              </div>
            </div>
          </div>

          <div className="savings-rate-summary">
            <span className="savings-rate-label">Net Savings Rate</span>
            <span className={`savings-rate-val ${income >= expenses ? 'positive' : 'negative'}`}>
              {income > 0 ? `${Math.round(((income - expenses) / income) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
