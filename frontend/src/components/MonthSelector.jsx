import React from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatMonthYear } from '../utils/formatters.js';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import './MonthSelector.css';

export const MonthSelector = () => {
  const { currentDate, nextMonth, prevMonth, setMonth } = useTransactions();

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      now.getFullYear() === currentDate.getFullYear() &&
      now.getMonth() === currentDate.getMonth()
    );
  };

  const handleResetToCurrent = () => {
    const now = new Date();
    setMonth(now.getFullYear(), now.getMonth());
  };

  return (
    <div className="month-selector-bar">
      <div className="month-controls">
        <button
          type="button"
          onClick={prevMonth}
          className="month-btn-nav"
          aria-label="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="current-month-display">
          {formatMonthYear(currentDate)}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="month-btn-nav"
          aria-label="Next Month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {!isCurrentMonth() && (
        <button
          type="button"
          onClick={handleResetToCurrent}
          className="month-btn-reset"
          title="Return to this month"
        >
          <RotateCcw size={13} />
          <span>This month</span>
        </button>
      )}
    </div>
  );
};
