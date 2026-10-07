import React from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { CategoryIcon } from './CategoryIcon.jsx';
import './SpendingBreakdown.css';

export const SpendingBreakdown = () => {
  const { metrics } = useTransactions();
  const { expenses, categoryTotals } = metrics;

  const categories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 categories

  return (
    <div className="insight-card spending-breakdown-card">
      <div className="insight-card-header">
        <h3 className="insight-card-title">Spending Breakdown</h3>
        <span className="insight-card-badge">By Category</span>
      </div>

      {expenses === 0 || categories.length === 0 ? (
        <div className="insight-empty">
          <p>No expenses recorded this month.</p>
        </div>
      ) : (
        <div className="breakdown-list">
          {categories.map(([category, amount]) => {
            const percentage = Math.round((amount / expenses) * 100);

            return (
              <div key={category} className="breakdown-row">
                <div className="breakdown-meta">
                  <div className="breakdown-category-info">
                    <div className="breakdown-cat-icon">
                      <CategoryIcon category={category} size={14} />
                    </div>
                    <span className="breakdown-cat-name">{category}</span>
                  </div>
                  <div className="breakdown-cat-values">
                    <span className="breakdown-cat-amount">{formatCurrency(amount)}</span>
                    <span className="breakdown-cat-percent">{percentage}%</span>
                  </div>
                </div>

                <div className="breakdown-track">
                  <div
                    className="breakdown-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
