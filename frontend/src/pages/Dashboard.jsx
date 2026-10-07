import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MonthSelector } from '../components/MonthSelector.jsx';
import { SummaryCards } from '../components/SummaryCards.jsx';
import { MonthlyOverview } from '../components/MonthlyOverview.jsx';
import { SpendingBreakdown } from '../components/SpendingBreakdown.jsx';
import { CategoryBudgets } from '../components/CategoryBudgets.jsx';
import { RecentTransactions } from '../components/RecentTransactions.jsx';
import './Dashboard.css';

export const Dashboard = () => {
  const { onOpenAddModal, onOpenEditModal } = useOutletContext();

  return (
    <div className="dashboard-page">
      <MonthSelector />

      <SummaryCards />

      <div className="dashboard-charts-grid">
        <MonthlyOverview />
        <SpendingBreakdown />
      </div>

      <CategoryBudgets />

      <RecentTransactions
        onEdit={onOpenEditModal}
        onOpenAdd={onOpenAddModal}
      />
    </div>
  );
};

export default Dashboard;
