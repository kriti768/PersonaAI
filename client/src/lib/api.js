const headers = { 'Content-Type': 'application/json' };

function getToken() {
  return localStorage.getItem('personaai-token');
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export const api = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),
  listConversations: () => request('/api/chat/conversations'),
  createConversation: () => request('/api/chat/conversations', { method: 'POST' }),
  getConversation: (id) => request(`/api/chat/conversations/${id}`),
  sendMessage: (payload) => request('/api/chat/message', { method: 'POST', body: JSON.stringify(payload) }),
  getInsights: () => request('/api/insights'),
  updateProfile: (payload) => request('/api/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
  exportData: () => request('/api/privacy/export'),
  deleteData: () => request('/api/privacy/delete', { method: 'DELETE' })
};
