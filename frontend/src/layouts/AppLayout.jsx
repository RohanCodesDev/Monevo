import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { ToastContainer } from '../components/ToastContainer.jsx';
import { LayoutDashboard, Receipt, Plus } from 'lucide-react';
import { TransactionModal } from '../components/TransactionModal.jsx';
import './AppLayout.css';

export const AppLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="app-shell">
      <Header onOpenAddModal={handleOpenAdd} />

      <main className="main-content">
        <Outlet context={{ onOpenAddModal: handleOpenAdd, onOpenEditModal: handleOpenEdit }} />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>

        <button
          type="button"
          className="mobile-fab"
          onClick={handleOpenAdd}
          aria-label="Add Transaction"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <NavLink
          to="/transactions"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Receipt size={20} />
          <span>History</span>
        </NavLink>
      </nav>

      {/* Transaction Modal (Add / Edit) */}
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          initialData={editingTransaction}
          onClose={handleCloseModal}
        />
      )}

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
