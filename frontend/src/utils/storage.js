const STORAGE_KEY = 'monevo_transactions';

export const storage = {
  getTransactions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[LocalStorage Error] Failed to read transactions:', error);
      return [];
    }
  },

  saveTransactions: (transactions) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      return true;
    } catch (error) {
      console.error('[LocalStorage Error] Failed to save transactions:', error);
      return false;
    }
  },

  addTransaction: (transaction) => {
    try {
      const transactions = storage.getTransactions();
      const updated = [transaction, ...transactions];
      storage.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('[LocalStorage Error] Failed to add transaction:', error);
      return null;
    }
  },

  updateTransaction: (updatedItem) => {
    try {
      const transactions = storage.getTransactions();
      const updated = transactions.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      storage.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('[LocalStorage Error] Failed to update transaction:', error);
      return null;
    }
  },

  deleteTransaction: (id) => {
    try {
      const transactions = storage.getTransactions();
      const updated = transactions.filter((item) => item.id !== id);
      storage.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('[LocalStorage Error] Failed to delete transaction:', error);
      return null;
    }
  },

  clearTransactions: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('[LocalStorage Error] Failed to clear transactions:', error);
      return false;
    }
  },
};
