import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import { api } from '../services/api.js';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Selected month anchor
  const [syncStatus, setSyncStatus] = useState('saved-locally'); // 'saved-locally' | 'syncing' | 'synced' | 'offline'
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial load: LocalStorage first, then attempt backend fetch & sync
  useEffect(() => {
    const localData = storage.getTransactions();
    setTransactions(localData);
    setIsLoading(false);

    const syncWithBackend = async () => {
      try {
        setSyncStatus('syncing');
        const res = await api.getTransactions();
        if (res && res.success && Array.isArray(res.data)) {
          // If backend has data, use backend as authoritative, but merge any unsynced local-only items if needed
          if (res.data.length > 0) {
            setTransactions(res.data);
            storage.saveTransactions(res.data);
          } else if (localData.length > 0) {
            // Backend is empty, push local transactions to backend
            for (const item of localData) {
              try {
                await api.createTransaction({
                  type: item.type,
                  amount: item.amount,
                  category: item.category,
                  description: item.description,
                  date: item.date,
                });
              } catch (err) {
                console.warn('Could not sync local item:', item.id);
              }
            }
          }
          setSyncStatus('synced');
        } else {
          setSyncStatus('saved-locally');
        }
      } catch (err) {
        setSyncStatus('offline');
      }
    };

    syncWithBackend();
  }, []);

  // CRUD: Add Transaction
  const addTransaction = useCallback(async (data) => {
    const tempId = `local-${Date.now()}`;
    const newTx = {
      id: tempId,
      ...data,
      amount: parseFloat(data.amount),
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic update in UI and LocalStorage
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      storage.saveTransactions(updated);
      return updated;
    });
    setSyncStatus('saved-locally');
    addToast('Transaction recorded', 'success');

    // 2. Sync to Backend
    try {
      setSyncStatus('syncing');
      const res = await api.createTransaction(data);
      if (res && res.success && res.data) {
        // Reconcile temp ID with permanent DB ID
        setTransactions((prev) => {
          const reconciled = prev.map((item) =>
            item.id === tempId ? res.data : item
          );
          storage.saveTransactions(reconciled);
          return reconciled;
        });
        setSyncStatus('synced');
      }
    } catch (err) {
      setSyncStatus('offline');
      addToast('Saved locally (server offline)', 'warning');
    }
  }, [addToast]);

  // CRUD: Update Transaction
  const updateTransaction = useCallback(async (id, data) => {
    // 1. Optimistic update
    setTransactions((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...data, amount: parseFloat(data.amount) } : item
      );
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Transaction updated', 'success');

    // 2. Backend update if not a local-only temporary ID
    if (!id.startsWith('local-')) {
      try {
        setSyncStatus('syncing');
        const res = await api.updateTransaction(id, data);
        if (res && res.success && res.data) {
          setTransactions((prev) => {
            const synced = prev.map((item) => (item.id === id ? res.data : item));
            storage.saveTransactions(synced);
            return synced;
          });
          setSyncStatus('synced');
        }
      } catch (err) {
        setSyncStatus('offline');
        addToast('Updated locally (server offline)', 'warning');
      }
    }
  }, [addToast]);

  // CRUD: Delete Transaction
  const deleteTransaction = useCallback(async (id) => {
    // 1. Optimistic delete
    setTransactions((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Transaction removed', 'info');

    // 2. Backend delete
    if (!id.startsWith('local-')) {
      try {
        setSyncStatus('syncing');
        await api.deleteTransaction(id);
        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('offline');
        addToast('Deleted locally (server offline)', 'warning');
      }
    }
  }, [addToast]);

  // Month navigation
  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const setMonth = useCallback((year, monthIndex) => {
    setCurrentDate(new Date(year, monthIndex, 1));
  }, []);

  // Filtered transactions for selected month
  const monthlyTransactions = useMemo(() => {
    const selYear = currentDate.getFullYear();
    const selMonth = currentDate.getMonth();

    return transactions.filter((tx) => {
      if (!tx.date) return false;
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === selYear && txDate.getMonth() === selMonth;
    });
  }, [transactions, currentDate]);

  // Financial calculations for selected month
  const metrics = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryTotals = {};

    monthlyTransactions.forEach((tx) => {
      const amount = parseFloat(tx.amount) || 0;
      if (tx.type === 'income') {
        income += amount;
      } else if (tx.type === 'expense') {
        expenses += amount;
        const cat = tx.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      }
    });

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance,
      categoryTotals,
    };
  }, [monthlyTransactions]);

  const value = {
    transactions,
    monthlyTransactions,
    currentDate,
    metrics,
    syncStatus,
    isLoading,
    toasts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    nextMonth,
    prevMonth,
    setMonth,
    addToast,
    removeToast,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
