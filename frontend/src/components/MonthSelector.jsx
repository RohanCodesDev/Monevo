import React, { useState, useRef, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatMonthYear } from '../utils/formatters.js';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar, ChevronDown } from 'lucide-react';
import './MonthSelector.css';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MonthSelector = () => {
  const { currentDate, nextMonth, prevMonth, setMonth } = useTransactions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selYear = currentDate.getFullYear();
  const selMonthIdx = currentDate.getMonth();

  const isCurrentMonth = () => {
    const now = new Date();
    return now.getFullYear() === selYear && now.getMonth() === selMonthIdx;
  };

  const handleResetToCurrent = () => {
    const now = new Date();
    setMonth(now.getFullYear(), now.getMonth());
    setIsDropdownOpen(false);
  };

  const handleSelectMonth = (mIdx) => {
    setMonth(selYear, mIdx);
    setIsDropdownOpen(false);
  };

  const handleYearChange = (delta) => {
    setMonth(selYear + delta, selMonthIdx);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  return (
    <div className="month-selector-bar">
      <div className="month-controls" ref={dropdownRef}>
        <button
          type="button"
          onClick={prevMonth}
          className="month-btn-nav"
          aria-label="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          className="current-month-display-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="Select month"
        >
          <Calendar size={15} className="month-cal-icon" />
          <h2 className="current-month-display">
            {formatMonthYear(currentDate)}
          </h2>
          <ChevronDown size={14} className={`month-chevron ${isDropdownOpen ? 'rotate' : ''}`} />
        </button>

        <button
          type="button"
          onClick={nextMonth}
          className="month-btn-nav"
          aria-label="Next Month"
        >
          <ChevronRight size={18} />
        </button>

        {/* Quick Month Grid Popover */}
        {isDropdownOpen && (
          <div className="month-popover-menu" role="menu">
            <div className="popover-year-header">
              <button
                type="button"
                onClick={() => handleYearChange(-1)}
                className="btn-year-arrow"
              >
                ‹
              </button>
              <span className="popover-year-text">{selYear}</span>
              <button
                type="button"
                onClick={() => handleYearChange(1)}
                className="btn-year-arrow"
              >
                ›
              </button>
            </div>

            <div className="popover-months-grid">
              {MONTH_NAMES.map((name, idx) => (
                <button
                  key={name}
                  type="button"
                  className={`btn-month-cell ${idx === selMonthIdx ? 'selected' : ''}`}
                  onClick={() => handleSelectMonth(idx)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
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
