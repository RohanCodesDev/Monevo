import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { CategoryIcon } from './CategoryIcon.jsx';
import { Settings2, AlertCircle, CheckCircle2 } from 'lucide-react';
import './CategoryBudgets.css';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Travel',
  'Subscriptions',
];

export const CategoryBudgets = () => {
  const { metrics, budgets, setCategoryBudget } = useTransactions();
  const { categoryTotals } = metrics;
  const [editingCategory, setEditingCategory] = useState(null);
  const [limitInput, setLimitInput] = useState('');

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setLimitInput(budgets[category] ? budgets[category].toString() : '');
  };

  const handleSave = (category) => {
    setCategoryBudget(category, limitInput);
    setEditingCategory(null);
  };

  return (
    <div className="insight-card budgets-card">
      <div className="insight-card-header">
        <div>
          <h3 className="insight-card-title">Category Spending Limits</h3>
          <p className="budgets-subtitle">Monitor spending caps & alerts</p>
        </div>
      </div>

      <div className="budgets-grid">
        {DEFAULT_CATEGORIES.map((cat) => {
          const spent = categoryTotals[cat] || 0;
          const limit = budgets[cat] || 0;
          const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const isOver = limit > 0 && spent > limit;
          const isNear = limit > 0 && spent >= limit * 0.85 && !isOver;

          return (
            <div key={cat} className="budget-item">
              <div className="budget-item-top">
                <div className="budget-cat-name">
                  <div className="budget-icon-badge">
                    <CategoryIcon category={cat} size={14} />
                  </div>
                  <span>{cat}</span>
                </div>

                <div className="budget-actions">
                  {editingCategory === cat ? (
                    <div className="budget-edit-input-group">
                      <input
                        type="number"
                        min="0"
                        placeholder="Limit"
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        className="budget-input-field"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSave(cat)}
                        className="btn-save-budget"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="budget-amounts-display">
                      <span className="budget-spent-text">{formatCurrency(spent)}</span>
                      <span className="budget-slash">/</span>
                      <span className="budget-limit-text">
                        {limit > 0 ? formatCurrency(limit) : 'No cap'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="btn-edit-budget"
                        title="Edit monthly limit"
                      >
                        <Settings2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {limit > 0 && (
                <>
                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${
                        isOver ? 'fill-danger' : isNear ? 'fill-warning' : 'fill-normal'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="budget-status-row">
                    <span className="budget-pct">{percentage}% spent</span>
                    {isOver && (
                      <span className="budget-tag tag-danger">
                        <AlertCircle size={12} /> Over by {formatCurrency(spent - limit)}
                      </span>
                    )}
                    {isNear && (
                      <span className="budget-tag tag-warning">
                        <AlertCircle size={12} /> Near limit
                      </span>
                    )}
                    {!isOver && !isNear && (
                      <span className="budget-tag tag-ok">
                        <CheckCircle2 size={12} /> On track
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
