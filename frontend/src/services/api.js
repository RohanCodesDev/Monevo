const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result;
  } catch (error) {
    console.warn(`[API] Network error or server unavailable for ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  checkHealth: async () => {
    return request('/health');
  },

  getTransactions: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;
    return request(endpoint);
  },

  getTransactionById: async (id) => {
    return request(`/transactions/${id}`);
  },

  createTransaction: async (data) => {
    return request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTransaction: async (id, data) => {
    return request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTransaction: async (id) => {
    return request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
