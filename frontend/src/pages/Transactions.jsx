import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext.jsx';
import { TransactionItem } from '../components/TransactionItem.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { formatCurrency, formatMonthYear } from '../utils/formatters.js';
import { Search, Filter, Plus, Calendar, ArrowUpDown } from 'lucide-react';
import './Transactions.css';

export const Transactions = () => {
  const { onOpenAddModal, onOpenEditModal } = useOutletContext();
  const { transactions, monthlyTransactions, currentDate } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'income' | 'expense'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [useMonthFilter, setUseMonthFilter] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Available categories based on dataset
  const availableCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.category) set.add(tx.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Base list depending on month filter toggle
  const baseList = useMonthFilter ? monthlyTransactions : transactions;

  // Filtered & sorted list
  const filteredList = useMemo(() => {
    return baseList
      .filter((tx) => {
        // Type filter
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchDesc = (tx.description || '').toLowerCase().includes(q);
          const matchCat = (tx.category || '').toLowerCase().includes(q);
          const matchAmount = tx.amount.toString().includes(q);
          return matchDesc || matchCat || matchAmount;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [baseList, selectedType, selectedCategory, searchQuery, sortOrder]);

  // Aggregate totals for the filtered view
  const { totalIn, totalOut } = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    filteredList.forEach((tx) => {
      const amt = parseFloat(tx.amount) || 0;
      if (tx.type === 'income') totalIn += amt;
      else if (tx.type === 'expense') totalOut += amt;
    });
    return { totalIn, totalOut };
  }, [filteredList]);

  return (
    <div className="transactions-page">
      {/* Page Header */}
      <div className="tx-page-header">
        <div>
          <h1 className="tx-page-title">Transactions</h1>
          <p className="tx-page-desc">
            {useMonthFilter
              ? `Showing records for ${formatMonthYear(currentDate)}`
              : 'Showing all historical records'}
          </p>
        </div>

        <button
          type="button"
          className="btn-add-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="tx-filters-container">
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-controls-group">
          {/* Type Filter Buttons */}
          <div className="type-filter-tabs">
            <button
              type="button"
              className={`type-tab ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`type-tab ${selectedType === 'income' ? 'active' : ''}`}
              onClick={() => setSelectedType('income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`type-tab ${selectedType === 'expense' ? 'active' : ''}`}
              onClick={() => setSelectedType('expense')}
            >
              Expenses
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Month Toggle Button */}
          <button
            type="button"
            className={`btn-filter-toggle ${useMonthFilter ? 'active' : ''}`}
            onClick={() => setUseMonthFilter(!useMonthFilter)}
            title="Toggle between selected month and all time"
          >
            <Calendar size={14} />
            <span>{useMonthFilter ? 'This Month' : 'All Time'}</span>
          </button>

          {/* Sort Order Toggle */}
          <button
            type="button"
            className="btn-filter-toggle"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title={`Sort: ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
          >
            <ArrowUpDown size={14} />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Summary strip for filtered view */}
      {filteredList.length > 0 && (
        <div className="filtered-summary-strip">
          <span className="strip-count">{filteredList.length} transaction{filteredList.length === 1 ? '' : 's'}</span>
          <div className="strip-totals">
            {totalIn > 0 && <span className="strip-in">+{formatCurrency(totalIn)}</span>}
            {totalOut > 0 && <span className="strip-out">−{formatCurrency(totalOut)}</span>}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="tx-list-section">
        {filteredList.length === 0 ? (
          <EmptyState
            title={
              searchQuery || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'No matching transactions'
                : 'No transactions found'
            }
            description={
              searchQuery || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters to see more results.'
                : 'Start tracking by creating your first transaction.'
            }
            onAction={onOpenAddModal}
            actionLabel="Add Transaction"
          />
        ) : (
          <div className="transactions-stack">
            {filteredList.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={onOpenEditModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
