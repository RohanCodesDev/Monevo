import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import { api } from '../services/api.js';

const TransactionContext = createContext(null);
const BUDGETS_STORAGE_KEY = 'monevo_category_budgets';
const THEME_STORAGE_KEY = 'monevo_theme';
const TOKEN_KEY = 'monevo_auth_token';
const USER_KEY = 'monevo_auth_user';

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('saved-locally');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  // Category Budgets
  const [budgets, setBudgets] = useState(() => {
    try {
      const data = localStorage.getItem(BUDGETS_STORAGE_KEY);
      return data ? JSON.parse(data) : {
        Food: 10000,
        Shopping: 8000,
        Bills: 5000,
        Entertainment: 4000,
      };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setCategoryBudget = useCallback((category, limit) => {
    setBudgets((prev) => {
      const updated = { ...prev, [category]: parseFloat(limit) || 0 };
      localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  // Sync / fetch transactions
  const loadTransactions = useCallback(async (isUserChange = false) => {
    if (isUserChange) {
      setTransactions([]);
    } else {
      const localData = storage.getTransactions();
      setTransactions(localData);
    }
    
    setIsLoading(true);

    try {
      setSyncStatus('syncing');
      const res = await api.getTransactions();
      if (res && res.success && Array.isArray(res.data)) {
        setTransactions(res.data);
        storage.saveTransactions(res.data);
        setSyncStatus('synced');
      } else {
        setSyncStatus('saved-locally');
      }
    } catch (err) {
      setSyncStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions(true);
  }, [currentUser]);

  // Auth actions
  const loginUser = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.success && res.data) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        storage.clearTransactions();
        setCurrentUser(res.data.user);
        addToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login error' };
    }
  }, [addToast]);

  const registerUser = useCallback(async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      if (res && res.success && res.data) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        storage.clearTransactions();
        setCurrentUser(res.data.user);
        addToast(`Account created! Welcome, ${res.data.user.name}!`, 'success');
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration error' };
    }
  }, [addToast]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    storage.clearTransactions();
    setCurrentUser(null);
    setTransactions([]);
    addToast('Logged out. Session cleared.', 'info');
  }, [addToast]);

  // CRUD: Add Transaction
  const addTransaction = useCallback(async (data) => {
    const tempId = `local-${Date.now()}`;
    const newTx = {
      id: tempId,
      ...data,
      amount: parseFloat(data.amount),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      storage.saveTransactions(updated);
      return updated;
    });
    setSyncStatus('saved-locally');
    addToast('Transaction recorded', 'success');

    try {
      setSyncStatus('syncing');
      const res = await api.createTransaction(data);
      if (res && res.success && res.data) {
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
    setTransactions((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...data, amount: parseFloat(data.amount) } : item
      );
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Transaction updated', 'success');

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
    setTransactions((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Transaction removed', 'info');

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

  // Financial calculations for selected month and previous month comparison
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

    // Previous month comparison
    const prevYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    const prevMonthIdx = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;

    let prevIncome = 0;
    let prevExpenses = 0;

    transactions.forEach((tx) => {
      if (!tx.date) return;
      const txDate = new Date(tx.date);
      if (txDate.getFullYear() === prevYear && txDate.getMonth() === prevMonthIdx) {
        const amt = parseFloat(tx.amount) || 0;
        if (tx.type === 'income') prevIncome += amt;
        else if (tx.type === 'expense') prevExpenses += amt;
      }
    });

    const expenseChangePct = prevExpenses > 0
      ? Math.round(((expenses - prevExpenses) / prevExpenses) * 100)
      : null;

    const incomeChangePct = prevIncome > 0
      ? Math.round(((income - prevIncome) / prevIncome) * 100)
      : null;

    return {
      income,
      expenses,
      balance,
      categoryTotals,
      prevIncome,
      prevExpenses,
      expenseChangePct,
      incomeChangePct,
    };
  }, [monthlyTransactions, transactions, currentDate]);

  const value = {
    transactions,
    monthlyTransactions,
    currentDate,
    metrics,
    syncStatus,
    isLoading,
    toasts,
    theme,
    toggleTheme,
    budgets,
    setCategoryBudget,
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
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
