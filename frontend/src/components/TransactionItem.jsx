import React, { useState } from 'react';
import { CategoryIcon } from './CategoryIcon.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import './TransactionItem.css';

export const TransactionItem = ({ transaction, onEdit }) => {
  const { deleteTransaction } = useTransactions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="transaction-row">
        <div className="transaction-left">
          <div className={`tx-icon-badge ${isIncome ? 'income' : 'expense'}`}>
            <CategoryIcon category={transaction.category} size={16} />
          </div>

          <div className="tx-details">
            <span className="tx-title">
              {transaction.description || transaction.category}
            </span>
            <div className="tx-meta">
              <span className="tx-category-badge">{transaction.category}</span>
              <span className="tx-separator">·</span>
              <span className="tx-date">{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>

        <div className="transaction-right">
          <span className={`tx-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
            {isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}
          </span>

          <div className="tx-actions">
            <button
              type="button"
              className="tx-btn-action"
              onClick={() => onEdit(transaction)}
              aria-label="Edit transaction"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              className="tx-btn-action tx-btn-delete"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete transaction"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
};
