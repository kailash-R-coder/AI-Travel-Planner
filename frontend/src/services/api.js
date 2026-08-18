const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Universal fetch wrapper with automatic JWT authorization header injection.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || (Array.isArray(data.detail) ? data.detail[0].msg : 'An unexpected error occurred');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    register: (name, email, password) =>
      request('/auth/register', { method: 'POST', body: { name, email, password } }),
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),
    getMe: () => request('/auth/me', { method: 'GET' }),
  },
  trips: {
    generate: (tripData) =>
      request('/trips/generate', { method: 'POST', body: tripData }),
    list: () => request('/trips/', { method: 'GET' }),
    get: (id) => request(`/trips/${id}`, { method: 'GET' }),
    update: (id, data) =>
      request(`/trips/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/trips/${id}`, { method: 'DELETE' }),
  },
  itinerary: {
    addItem: (tripId, itemData) =>
      request(`/trips/${tripId}/items/`, { method: 'POST', body: itemData }),
    updateItem: (tripId, itemId, data) =>
      request(`/trips/${tripId}/items/${itemId}`, { method: 'PUT', body: data }),
    deleteItem: (tripId, itemId) =>
      request(`/trips/${tripId}/items/${itemId}`, { method: 'DELETE' }),
  },
  places: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/places/${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    recommend: (queryData) =>
      request('/places/recommend', { method: 'POST', body: queryData }),
    get: (id) => request(`/places/${id}`, { method: 'GET' }),
  },
  weather: {
    get: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/weather/${query ? `?${query}` : ''}`, { method: 'GET' });
    },
  },
  chat: {
    ask: (data) => request('/chat/ask', { method: 'POST', body: data }),
    getHistory: (tripId) => request(`/chat/history/${tripId}`, { method: 'GET' }),
  },
};
