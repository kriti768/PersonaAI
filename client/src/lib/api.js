const headers = { 'Content-Type': 'application/json' };

const STORAGE_KEYS = {
  token: 'personaai-token',
  mode: 'personaai-mode',
  user: 'personaai-demo-user',
  conversations: 'personaai-demo-conversations',
  insights: 'personaai-demo-insights'
};

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

function getMode() {
  return localStorage.getItem(STORAGE_KEYS.mode) || 'api';
}

function setMode(mode) {
  localStorage.setItem(STORAGE_KEYS.mode, mode);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildDemoInsights(messages = []) {
  const userMessages = messages.filter((item) => item.role === 'user');
  const latest = userMessages[userMessages.length - 1]?.content || '';
  const combined = userMessages.map((item) => item.content.toLowerCase()).join(' ');
  const emotionalStability = combined.includes('stress') || combined.includes('anxious') ? 54 : 71;
  const thinkingStyle = combined.includes('understand') || combined.includes('why') ? 77 : 64;
  const engagementLevel = Math.min(92, 48 + userMessages.length * 7);

  return {
    id: 'demo-insight',
    userId: 'demo-user',
    traits: ['Reflective', 'Self-aware', thinkingStyle > 70 ? 'Analytical' : 'Emotion-led'],
    behavioralPatterns: [
      latest ? `Recent reflection centers on: "${latest.slice(0, 60)}${latest.length > 60 ? '...' : ''}"` : 'You tend to open with emotionally honest language.',
      'Your conversations suggest a desire to understand patterns rather than just vent.',
      'PersonaAI is showing suggestion-based insights here in demo mode.'
    ],
    sentimentHistory: userMessages.slice(-8).map((item, index) => ({
      point: `M${index + 1}`,
      value: item.content.toLowerCase().includes('sad') || item.content.toLowerCase().includes('stress') ? -1 : 1
    })),
    emotionHistory: userMessages.slice(-8).map((item, index) => ({
      point: `M${index + 1}`,
      tone: item.content.toLowerCase().includes('sad') ? 'stressed' : item.content.toLowerCase().includes('calm') ? 'calm' : 'reflective'
    })),
    communicationStyle: thinkingStyle > 70 ? 'Curious and exploratory' : 'Thoughtful and expressive',
    emotionalStability,
    thinkingStyle,
    engagementLevel,
    summary: 'Demo mode is active, so these insights are generated locally in the browser. They are still framed as reflective suggestions, not diagnoses.',
    updatedAt: new Date().toISOString()
  };
}

function buildDemoUser(overrides = {}) {
  const conversations = readJson(STORAGE_KEYS.conversations, []);
  const insights = buildDemoInsights(conversations.flatMap((item) => item.messages || []));

  return {
    id: 'demo-user',
    name: overrides.name || 'Guest User',
    email: overrides.email || 'guest@personaai.demo',
    preferences: {
      profilingEnabled: true,
      consentGiven: true,
      aiMode: 'Reflective',
      theme: 'Night Bloom',
      ...(overrides.preferences || {})
    },
    profile: {
      headline: 'Demo mode lets you enter the app instantly and explore the experience.',
      summary: insights.summary,
      communicationStyle: insights.communicationStyle,
      emotionalStability: insights.emotionalStability,
      thinkingStyle: insights.thinkingStyle,
      engagementLevel: insights.engagementLevel,
      traits: insights.traits,
      behavioralPatterns: insights.behavioralPatterns,
      recentInsights: [
        'Demo mode is active, so auth is intentionally relaxed.',
        'Chat and dashboard still update using browser-local state.',
        'Switch back to the live API anytime the backend is stable.'
      ],
      sentimentHistory: insights.sentimentHistory,
      emotionHistory: insights.emotionHistory
    }
  };
}

function ensureDemoState(userOverrides = {}) {
  const existingUser = readJson(STORAGE_KEYS.user, null);
  const user = existingUser || buildDemoUser(userOverrides);
  writeJson(STORAGE_KEYS.user, user);

  if (!localStorage.getItem(STORAGE_KEYS.conversations)) {
    writeJson(STORAGE_KEYS.conversations, []);
  }

  const conversations = readJson(STORAGE_KEYS.conversations, []);
  const insights = buildDemoInsights(conversations.flatMap((item) => item.messages || []));
  writeJson(STORAGE_KEYS.insights, insights);
  return { user: buildDemoUser(user), insights };
}

function demoReply(content) {
  const lowered = content.toLowerCase();
  if (lowered.includes('sad') || lowered.includes('tired') || lowered.includes('stress')) {
    return 'I hear a lot of weight in that. Even naming it this clearly is a form of self-awareness. We can slow down and look at what feels heaviest first.';
  }
  if (lowered.includes('understand') || lowered.includes('why')) {
    return 'That sounds like a thoughtful question rather than a quick feeling. One thing I notice is that you want meaning, not just reassurance. What part of this feels most important to understand?';
  }
  return 'That gives us something real to work with. I am hearing reflection, emotional honesty, and a desire to make sense of your inner pattern. If you want, go one layer deeper.';
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

  const raw = await response.text();
  let data = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {
      message: raw?.slice(0, 180) || 'Unexpected non-JSON response from server.'
    };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }

  return data;
}

const demoApi = {
  async signup(payload) {
    setMode('demo');
    const token = createId('demo_token');
    localStorage.setItem(STORAGE_KEYS.token, token);
    const state = ensureDemoState({ name: payload.name, email: payload.email });
    return { token, user: state.user };
  },
  async login(payload) {
    setMode('demo');
    const token = createId('demo_token');
    localStorage.setItem(STORAGE_KEYS.token, token);
    const state = ensureDemoState({ email: payload.email, name: payload.email?.split('@')[0] || 'Guest User' });
    return { token, user: state.user };
  },
  async me() {
    const state = ensureDemoState();
    return { user: state.user };
  },
  async listConversations() {
    return { conversations: readJson(STORAGE_KEYS.conversations, []) };
  },
  async createConversation() {
    const conversations = readJson(STORAGE_KEYS.conversations, []);
    const conversation = {
      id: createId('conversation'),
      userId: 'demo-user',
      title: 'New reflection',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    conversations.unshift(conversation);
    writeJson(STORAGE_KEYS.conversations, conversations);
    ensureDemoState();
    return { conversation };
  },
  async getConversation(id) {
    const conversations = readJson(STORAGE_KEYS.conversations, []);
    const conversation = conversations.find((item) => item.id === id);
    if (!conversation) {
      throw new Error('Conversation not found.');
    }
    return { conversation };
  },
  async sendMessage(payload) {
    const conversations = readJson(STORAGE_KEYS.conversations, []);
    let conversation = conversations.find((item) => item.id === payload.conversationId);

    if (!conversation) {
      conversation = {
        id: payload.conversationId || createId('conversation'),
        userId: 'demo-user',
        title: 'New reflection',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      conversations.unshift(conversation);
    }

    const userMessage = {
      id: createId('msg_user'),
      role: 'user',
      content: payload.content,
      createdAt: new Date().toISOString()
    };
    const assistantMessage = {
      id: createId('msg_assistant'),
      role: 'assistant',
      content: demoReply(payload.content),
      createdAt: new Date().toISOString()
    };

    conversation.messages = [...conversation.messages, userMessage, assistantMessage];
    conversation.updatedAt = new Date().toISOString();
    conversation.title = conversation.messages.find((item) => item.role === 'user')?.content.slice(0, 48) || 'New reflection';

    writeJson(STORAGE_KEYS.conversations, conversations);
    const state = ensureDemoState();

    return {
      conversation,
      message: assistantMessage,
      analysis: { profile: state.user.profile },
      provider: 'demo',
      model: 'browser-fallback'
    };
  },
  async getInsights() {
    const state = ensureDemoState();
    return { insights: readJson(STORAGE_KEYS.insights, buildDemoInsights()), profile: state.user.profile };
  },
  async updateProfile(payload) {
    const current = ensureDemoState().user;
    const nextUser = {
      ...current,
      ...(payload.name ? { name: payload.name } : {}),
      preferences: {
        ...current.preferences,
        ...(payload.preferences || {})
      }
    };
    writeJson(STORAGE_KEYS.user, nextUser);
    const state = ensureDemoState(nextUser);
    return { user: state.user };
  },
  async exportData() {
    const state = ensureDemoState();
    return {
      exportedAt: new Date().toISOString(),
      data: {
        user: state.user,
        conversations: readJson(STORAGE_KEYS.conversations, []),
        insights: readJson(STORAGE_KEYS.insights, buildDemoInsights())
      }
    };
  },
  async deleteData() {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.conversations);
    localStorage.removeItem(STORAGE_KEYS.insights);
    localStorage.removeItem(STORAGE_KEYS.token);
    setMode('demo');
    return { message: 'Demo data deleted.' };
  }
};

async function withFallback(method, ...args) {
  if (getMode() === 'demo') {
    return demoApi[method](...args);
  }

  try {
    return await {
      signup: () => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(args[0]) }),
      login: () => request('/api/auth/login', { method: 'POST', body: JSON.stringify(args[0]) }),
      me: () => request('/api/auth/me'),
      listConversations: () => request('/api/chat/conversations'),
      createConversation: () => request('/api/chat/conversations', { method: 'POST' }),
      getConversation: () => request(`/api/chat/conversations/${args[0]}`),
      sendMessage: () => request('/api/chat/message', { method: 'POST', body: JSON.stringify(args[0]) }),
      getInsights: () => request('/api/insights'),
      updateProfile: () => request('/api/profile', { method: 'PATCH', body: JSON.stringify(args[0]) }),
      exportData: () => request('/api/privacy/export'),
      deleteData: () => request('/api/privacy/delete', { method: 'DELETE' })
    }[method]();
  } catch (error) {
    if (['signup', 'login', 'me', 'listConversations', 'createConversation', 'getConversation', 'sendMessage', 'getInsights', 'updateProfile', 'exportData', 'deleteData'].includes(method)) {
      return demoApi[method](...args);
    }
    throw error;
  }
}

export const api = {
  signup: (payload) => withFallback('signup', payload),
  login: (payload) => withFallback('login', payload),
  me: () => withFallback('me'),
  listConversations: () => withFallback('listConversations'),
  createConversation: () => withFallback('createConversation'),
  getConversation: (id) => withFallback('getConversation', id),
  sendMessage: (payload) => withFallback('sendMessage', payload),
  getInsights: () => withFallback('getInsights'),
  updateProfile: (payload) => withFallback('updateProfile', payload),
  exportData: () => withFallback('exportData'),
  deleteData: () => withFallback('deleteData')
};
