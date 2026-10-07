import React from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.jsx';
import { TransactionItem } from './TransactionItem.jsx';
import { EmptyState } from './EmptyState.jsx';
import { ArrowRight } from 'lucide-react';
import './RecentTransactions.css';

export const RecentTransactions = ({ onEdit, onOpenAdd }) => {
  const { monthlyTransactions } = useTransactions();

  const recentList = monthlyTransactions.slice(0, 5);

  return (
    <div className="recent-transactions-section">
      <div className="section-header">
        <div>
          <h3 className="section-title">Recent Transactions</h3>
          <p className="section-subtitle">Latest activity in the current month</p>
        </div>

        {monthlyTransactions.length > 0 && (
          <Link to="/transactions" className="link-view-all">
            <span>View all ({monthlyTransactions.length})</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {recentList.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Start tracking your money by adding your first income or expense."
          onAction={onOpenAdd}
          actionLabel="Add Transaction"
        />
      ) : (
        <div className="transactions-stack">
          {recentList.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
