// Application State Management with localStorage persistence

const STORAGE_KEYS = {
  API_KEY: 'nexus_openrouter_api_key',
  SELECTED_MODEL: 'nexus_selected_model',
  SETTINGS: 'nexus_settings',
  SESSIONS: 'nexus_sessions',
  ACTIVE_SESSION_ID: 'nexus_active_session_id',
  MEDIA_ITEMS: 'nexus_generated_media'
};

const DEFAULT_SETTINGS = {
  systemPrompt: "You are an intelligent, helpful, and creative AI assistant. Provide clear, accurate, and structured answers with code formatting when applicable.",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.9,
  defaultFreeModel: 'google/gemini-2.0-flash-exp:free'
};

export const State = {
  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },

  setApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, (key || '').trim());
  },

  getSelectedModel() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || DEFAULT_SETTINGS.defaultFreeModel;
  },

  setSelectedModel(modelId) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  },

  getSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSessions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getActiveSessionId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  },

  setActiveSessionId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    }
  },

  getActiveSession() {
    const sessions = this.getSessions();
    const activeId = this.getActiveSessionId();
    return sessions.find(s => s.id === activeId) || null;
  },

  createSession(title = 'New Conversation') {
    const sessions = this.getSessions();
    const newSession = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    sessions.unshift(newSession);
    this.saveSessions(sessions);
    this.setActiveSessionId(newSession.id);
    return newSession;
  },

  deleteSession(id) {
    let sessions = this.getSessions();
    sessions = sessions.filter(s => s.id !== id);
    this.saveSessions(sessions);

    if (this.getActiveSessionId() === id) {
      const nextSession = sessions[0] || null;
      this.setActiveSessionId(nextSession ? nextSession.id : null);
    }
  },

  updateSessionMessages(sessionId, messages, titleUpdate = null) {
    const sessions = this.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.messages = messages;
      session.updatedAt = new Date().toISOString();
      if (titleUpdate) {
        session.title = titleUpdate;
      }
      this.saveSessions(sessions);
    }
  },

  getMediaItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDIA_ITEMS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addMediaItem(item) {
    const items = this.getMediaItems();
    items.unshift({
      id: 'media_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...item
    });
    // Keep last 40 items
    if (items.length > 40) items.length = 40;
    localStorage.setItem(STORAGE_KEYS.MEDIA_ITEMS, JSON.stringify(items));
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.MEDIA_ITEMS);
  }
};
