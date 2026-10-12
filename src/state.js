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

  // ================= AI SKILLS SYSTEM =================
  getSkills() {
    try {
      const stored = localStorage.getItem('nexus_ai_skills');
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  },

  saveSkills(skills) {
    localStorage.setItem('nexus_ai_skills', JSON.stringify(skills));
  },

  getActiveSkillId() {
    return localStorage.getItem('nexus_active_skill_id') || null;
  },

  setActiveSkillId(skillId) {
    if (skillId) {
      localStorage.setItem('nexus_active_skill_id', skillId);
    } else {
      localStorage.removeItem('nexus_active_skill_id');
    }
  },

  getActiveSkill() {
    const activeId = this.getActiveSkillId();
    if (!activeId) return null;
    const skills = this.getSkills();
    return skills.find(s => s.id === activeId) || null;
  },

  addCustomSkill(skill) {
    const skills = this.getSkills();
    const newSkill = {
      id: 'skill_' + Date.now(),
      isCustom: true,
      createdAt: new Date().toISOString(),
      ...skill
    };
    skills.push(newSkill);
    this.saveSkills(skills);
    return newSkill;
  },

  deleteCustomSkill(skillId) {
    let skills = this.getSkills();
    skills = skills.filter(s => s.id !== skillId);
    this.saveSkills(skills);
    if (this.getActiveSkillId() === skillId) {
      this.setActiveSkillId(null);
    }
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.MEDIA_ITEMS);
    localStorage.removeItem('nexus_active_skill_id');
  }
};

export const DEFAULT_SKILLS = [
  {
    id: 'code-architect',
    name: 'Code Architect & Bug Hunter',
    icon: '💻',
    category: 'Coding',
    description: 'Expert senior software engineer. Writes clean code, refactors, finds edge-case bugs, and designs architecture.',
    prompt: 'You are an elite Senior Principal Software Engineer and System Architect. Always write production-grade, modular, self-contained, and bug-free code with clear comments, edge-case validation, and concise explanations.'
  },
  {
    id: 'prompt-engineer',
    name: '4K Prompt Engineer & Visualizer',
    icon: '🎨',
    category: 'Creative',
    description: 'Transforms simple visual ideas into hyper-detailed 8K photorealistic prompts for Flux.1, Midjourney, and Stable Diffusion.',
    prompt: 'You are a Master Prompt Engineer for AI image generators (Flux.1, Midjourney, SDXL). Expand any user concept into vivid, descriptive, photographic prompts specifying lighting (e.g. volumetric, golden hour), lenses (85mm, f/1.4), materials, camera angles, color grading, and textures.'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst & CSV Visualizer',
    icon: '📊',
    category: 'Analysis',
    description: 'Extracts deep insights, statistics, KPIs, and Python pandas/matplotlib code from uploaded datasets and numbers.',
    prompt: 'You are a Chief Data Scientist and Quantitative Analyst. Analyze all provided data critically. Structure answers with Executive Summaries, Key Metrics, Trends/Outliers, and provide executable Python (pandas/plotly) scripts for visual chart generation.'
  },
  {
    id: 'sinhala-master',
    name: 'Sinhala Master Translator',
    icon: '🇱🇰',
    category: 'Language',
    description: 'Provides 100% natural, idiomatically accurate Sinhala translations, cultural nuances, and fluent Sinhala responses.',
    prompt: 'You are an expert bilingual Sinhala and English linguist and writer. Translate concepts with cultural nuance, natural grammar, and clear modern phrasing. Explain technical terms with understandable local analogies.'
  },
  {
    id: 'researcher',
    name: 'Academic Researcher & Reviewer',
    icon: '🔬',
    category: 'Research',
    description: 'Performs scientific reviews, dissects research papers, synthesizes complex literature, and formats references in APA/IEEE.',
    prompt: 'You are a Distinguished Academic Research Fellow. Provide rigorous, evidence-based evaluations. Break down complex methodology, compare hypotheses, highlight limitations, and cite structured references in standard scholarly format.'
  },
  {
    id: 'seo-copywriter',
    name: 'Viral Copywriter & SEO Wizard',
    icon: '✍️',
    category: 'Writing',
    description: 'Crafts high-converting viral hooks, engaging LinkedIn/Twitter threads, SEO-optimized articles, and marketing copy.',
    prompt: 'You are a World-Class Viral Copywriter and Growth Marketer. Write punchy, persuasive copy with hypnotic hooks, bullet points, psychological triggers, and SEO keywords that maximize engagement and conversions.'
  },
  {
    id: 'cyber-security',
    name: 'Cybersecurity & Audit Specialist',
    icon: '🛡️',
    category: 'Security',
    description: 'Audits source code for OWASP Top 10 vulnerabilities, security leaks, misconfigurations, and advises secure patterns.',
    prompt: 'You are a Certified Senior Cybersecurity Auditor and Ethical Penetration Tester. Analyze all code for vulnerabilities (SQLi, XSS, CSRF, insecure tokens, SSRF). Provide immediate remediation code snippets and defense-in-depth strategies.'
  }
];

