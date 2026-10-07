import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { X, Check } from 'lucide-react';
import './TransactionModal.css';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Travel',
  'Subscriptions',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Gift',
  'Investment',
  'Other',
];

export const TransactionModal = ({ isOpen, initialData, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactions();

  const isEditing = Boolean(initialData && initialData.id);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
    } else {
      setType('expense');
      setAmount('');
      setCategory('Food');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // When type changes, ensure valid default category
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      if (!INCOME_CATEGORIES.includes(category)) {
        setCategory(INCOME_CATEGORIES[0]);
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category)) {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!category || !category.trim()) {
      newErrors.category = 'Please select a category';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type,
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date: new Date(date).toISOString(),
    };

    if (isEditing) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card transaction-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Record Transaction'}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Type Toggle Tabs */}
          <div className="type-toggle-group" role="radiogroup" aria-label="Transaction type">
            <button
              type="button"
              className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="form-field">
            <label htmlFor="tx-amount" className="field-label">
              Amount (₹)
            </label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                id="tx-amount"
                type="number"
                step="any"
                min="0.01"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`input-amount ${errors.amount ? 'input-error' : ''}`}
                autoFocus
                required
              />
            </div>
            {errors.amount && <span className="field-error-msg">{errors.amount}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-field">
            <label htmlFor="tx-category" className="field-label">
              Category
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="field-error-msg">{errors.category}</span>}
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="tx-description" className="field-label">
              Description <span className="field-optional">(optional)</span>
            </label>
            <input
              id="tx-description"
              type="text"
              placeholder="e.g. Dinner with team, Groceries, Client invoice"
              value={description}
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Date Picker */}
          <div className="form-field">
            <label htmlFor="tx-date" className="field-label">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              required
            />
            {errors.date && <span className="field-error-msg">{errors.date}</span>}
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal btn-submit"
            >
              <Check size={16} />
              <span>{isEditing ? 'Save Changes' : 'Add Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
