import { marked } from 'marked';
import hljs from 'highlight.js';
import { Icons } from './icons.js';
import { State } from './state.js';
import { OpenRouterAPI, FALLBACK_FREE_MODELS } from './api.js';
import { MediaGen } from './media.js';

// Configure marked with highlight.js
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

// App Controller State
const appState = {
  activeTab: 'chat', // 'chat' | 'image-studio' | 'video-studio'
  inputMode: 'chat', // 'chat' | 'image' | 'video'
  currentModel: State.getSelectedModel(),
  availableModels: FALLBACK_FREE_MODELS,
  pendingAttachments: [], // [{ name, size, type, dataUrl, textContent }]
  isGenerating: false,
  abortController: null,
  activeSession: null
};

// DOM Elements Cache
const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  renderIcons();
  setupEventListeners();
  loadSessions();
  setupSettingsUI();
  initModels();
  checkApiKeyStatus();
});

function initDOMElements() {
  DOM.sidebar = document.getElementById('sidebar');
  DOM.toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  DOM.closeSidebarBtn = document.getElementById('closeSidebarBtn');
  DOM.newChatBtn = document.getElementById('newChatBtn');
  DOM.clearAllChatsBtn = document.getElementById('clearAllChatsBtn');
  DOM.sessionsList = document.getElementById('sessionsList');
  DOM.openSettingsBtn = document.getElementById('openSettingsBtn');
  DOM.topSettingsBtn = document.getElementById('topSettingsBtn');

  // Top Nav & Model Picker
  DOM.modelSelectBtn = document.getElementById('modelSelectBtn');
  DOM.modelDropdownMenu = document.getElementById('modelDropdownMenu');
  DOM.currentModelName = document.getElementById('currentModelName');
  DOM.modelSearchInput = document.getElementById('modelSearchInput');
  DOM.modelListScroll = document.getElementById('modelListScroll');
  DOM.refreshModelsBtn = document.getElementById('refreshModelsBtn');
  DOM.topNavStatusDot = document.getElementById('topNavStatusDot');
  DOM.topNavStatusText = document.getElementById('topNavStatusText');
  DOM.sidebarStatusDot = document.getElementById('sidebarStatusDot');
  DOM.sidebarStatusLabel = document.getElementById('sidebarStatusLabel');
  DOM.sidebarStatusSub = document.getElementById('sidebarStatusSub');

  // Panels
  DOM.navChatBtn = document.getElementById('navChatBtn');
  DOM.navImageBtn = document.getElementById('navImageBtn');
  DOM.navVideoBtn = document.getElementById('navVideoBtn');
  DOM.chatPanel = document.getElementById('chatPanel');
  DOM.imageStudioPanel = document.getElementById('imageStudioPanel');
  DOM.videoStudioPanel = document.getElementById('videoStudioPanel');

  // Chat Views & Composer
  DOM.chatViewport = document.getElementById('chatViewport');
  DOM.welcomeScreen = document.getElementById('welcomeScreen');
  DOM.messagesContainer = document.getElementById('messagesContainer');
  DOM.scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
  DOM.attachmentsPreviewStrip = document.getElementById('attachmentsPreviewStrip');
  DOM.fileUploadInput = document.getElementById('fileUploadInput');
  DOM.attachFileBtn = document.getElementById('attachFileBtn');
  DOM.chatPromptInput = document.getElementById('chatPromptInput');
  DOM.sendPromptBtn = document.getElementById('sendPromptBtn');
  DOM.composerContainer = document.getElementById('composerContainer');
  DOM.composerModeChip = document.getElementById('composerModeChip');
  DOM.composerModeChipText = document.getElementById('composerModeChipText');
  DOM.clearModeChipBtn = document.getElementById('clearModeChipBtn');

  // Mode Pills
  DOM.modePills = document.querySelectorAll('.mode-pill');

  // Settings Modal
  DOM.settingsModal = document.getElementById('settingsModal');
  DOM.closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  DOM.cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  DOM.saveSettingsBtn = document.getElementById('saveSettingsBtn');
  DOM.settingsApiKeyInput = document.getElementById('settingsApiKeyInput');
  DOM.toggleKeyVisibilityBtn = document.getElementById('toggleKeyVisibilityBtn');
  DOM.testConnectionBtn = document.getElementById('testConnectionBtn');
  DOM.testResultBox = document.getElementById('testResultBox');
  DOM.testResultBadge = document.getElementById('testResultBadge');
  DOM.testResultLatency = document.getElementById('testResultLatency');
  DOM.testResultMessage = document.getElementById('testResultMessage');
  DOM.defaultModelSelect = document.getElementById('defaultModelSelect');
  DOM.freeModelsBadgesWrap = document.getElementById('freeModelsBadgesWrap');
  DOM.systemPromptInput = document.getElementById('systemPromptInput');
  DOM.temperatureInput = document.getElementById('temperatureInput');
  DOM.temperatureVal = document.getElementById('temperatureVal');
  DOM.maxTokensInput = document.getElementById('maxTokensInput');
  DOM.maxTokensVal = document.getElementById('maxTokensVal');
  DOM.modalClearAllDataBtn = document.getElementById('modalClearAllDataBtn');
  DOM.modalRefreshModelsBtn = document.getElementById('modalRefreshModelsBtn');

  // Image Studio
  DOM.imgStudioPrompt = document.getElementById('imgStudioPrompt');
  DOM.imgStudioNegPrompt = document.getElementById('imgStudioNegPrompt');
  DOM.imgStudioStyle = document.getElementById('imgStudioStyle');
  DOM.imgStudioRatio = document.getElementById('imgStudioRatio');
  DOM.generateImgBtn = document.getElementById('generateImgBtn');
  DOM.downloadImgBtn = document.getElementById('downloadImgBtn');
  DOM.imgPreviewCanvas = document.getElementById('imgPreviewCanvas');

  // Video Studio
  DOM.videoStudioPrompt = document.getElementById('videoStudioPrompt');
  DOM.videoStudioModel = document.getElementById('videoStudioModel');
  DOM.generateVideoBtn = document.getElementById('generateVideoBtn');
  DOM.downloadVideoBtn = document.getElementById('downloadVideoBtn');
  DOM.videoPreviewCanvas = document.getElementById('videoPreviewCanvas');

  // Lightbox
  DOM.mediaLightbox = document.getElementById('mediaLightbox');
  DOM.closeLightboxBtn = document.getElementById('closeLightboxBtn');
  DOM.lightboxImg = document.getElementById('lightboxImg');
  DOM.lightboxVideo = document.getElementById('lightboxVideo');
}

function renderIcons() {
  const iconMappings = {
    logoIconContainer: Icons.sparkles,
    newChatIcon: Icons.plus,
    navChatIcon: Icons.chat,
    navImageIcon: Icons.image,
    navVideoIcon: Icons.video,
    clearAllChatsBtn: Icons.trash,
    settingsIcon: Icons.settings,
    toggleSidebarBtn: Icons.menu,
    closeSidebarBtn: Icons.close,
    modelCpuIcon: Icons.cpu,
    modelChevronIcon: Icons.chevronDown,
    modelSearchIcon: Icons.search,
    refreshModelsBtn: Icons.refresh,
    pillChatIcon: Icons.chat,
    pillImageIcon: Icons.image,
    pillVideoIcon: Icons.video,
    topSettingsBtn: Icons.settings,
    welcomeSparkleIcon: Icons.sparkles,
    scrollToBottomBtn: Icons.chevronDown,
    composerPaperclipIcon: Icons.paperclip,
    composerSendIcon: Icons.send,
    studioImageIcon: Icons.image,
    generateImgIcon: Icons.sparkles,
    downloadImgIcon: Icons.download,
    emptyImgIcon: Icons.image,
    studioVideoIcon: Icons.video,
    generateVideoIcon: Icons.sparkles,
    downloadVideoIcon: Icons.download,
    emptyVideoIcon: Icons.video,
    modalSettingsIcon: Icons.settings,
    closeSettingsModalBtn: Icons.close,
    boxKeyIcon: Icons.key,
    eyeKeyIcon: Icons.eye,
    testKeyIcon: Icons.zap,
    boxCpuIcon: Icons.layers,
    modalRefreshIcon: Icons.refresh,
    boxParamsIcon: Icons.cpu,
    boxTrashIcon: Icons.trash
  };

  for (const [id, svg] of Object.entries(iconMappings)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svg;
  }
}

function setupEventListeners() {
  // Sidebar Toggles
  DOM.toggleSidebarBtn.addEventListener('click', () => DOM.sidebar.classList.toggle('open'));
  DOM.closeSidebarBtn.addEventListener('click', () => DOM.sidebar.classList.remove('open'));

  // Tab Navigation
  DOM.navChatBtn.addEventListener('click', () => switchTab('chat'));
  DOM.navImageBtn.addEventListener('click', () => switchTab('image-studio'));
  DOM.navVideoBtn.addEventListener('click', () => switchTab('video-studio'));

  // Mode Pills in Top Nav
  DOM.modePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.dataset.mode;
      setInputMode(mode);
    });
  });

  DOM.clearModeChipBtn.addEventListener('click', () => setInputMode('chat'));

  // New Chat
  DOM.newChatBtn.addEventListener('click', () => {
    createNewChatSession();
    if (window.innerWidth <= 868) DOM.sidebar.classList.remove('open');
  });

  // Clear All Chats
  DOM.clearAllChatsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all chat history?')) {
      State.clearAllData();
      loadSessions();
      createNewChatSession();
    }
  });

  // Model Picker Dropdown
  DOM.modelSelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    DOM.modelDropdownMenu.classList.toggle('hidden');
    if (!DOM.modelDropdownMenu.classList.contains('hidden')) {
      DOM.modelSearchInput.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!DOM.modelDropdownMenu.contains(e.target) && !DOM.modelSelectBtn.contains(e.target)) {
      DOM.modelDropdownMenu.classList.add('hidden');
    }
  });

  DOM.modelSearchInput.addEventListener('input', (e) => {
    renderModelDropdownList(e.target.value);
  });

  DOM.refreshModelsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    refreshModelsList();
  });

  // Settings Modal Triggers
  DOM.openSettingsBtn.addEventListener('click', openSettingsModal);
  DOM.topSettingsBtn.addEventListener('click', openSettingsModal);
  DOM.closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
  DOM.cancelSettingsBtn.addEventListener('click', closeSettingsModal);
  DOM.saveSettingsBtn.addEventListener('click', saveSettingsFromModal);
  DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) closeSettingsModal();
  });

  // Settings Key Visibility & Testing
  DOM.toggleKeyVisibilityBtn.addEventListener('click', () => {
    const isPass = DOM.settingsApiKeyInput.type === 'password';
    DOM.settingsApiKeyInput.type = isPass ? 'text' : 'password';
  });

  DOM.testConnectionBtn.addEventListener('click', runKeyConnectionTest);
  DOM.modalRefreshModelsBtn.addEventListener('click', refreshModelsList);
  DOM.modalClearAllDataBtn.addEventListener('click', () => {
    if (confirm('Clear all conversation history and cached media?')) {
      State.clearAllData();
      loadSessions();
      createNewChatSession();
      alert('Local data cleared successfully.');
    }
  });

  // Sliders range input update
  DOM.temperatureInput.addEventListener('input', (e) => DOM.temperatureVal.textContent = e.target.value);
  DOM.maxTokensInput.addEventListener('input', (e) => DOM.maxTokensVal.textContent = e.target.value);

  // File Upload Handlers (Unlimited)
  DOM.attachFileBtn.addEventListener('click', () => DOM.fileUploadInput.click());
  DOM.fileUploadInput.addEventListener('change', handleFilesSelected);

  // Drag and Drop files onto composer
  DOM.composerContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.composerContainer.style.borderColor = 'var(--accent-primary)';
  });
  DOM.composerContainer.addEventListener('dragleave', () => {
    DOM.composerContainer.style.borderColor = 'var(--border-color)';
  });
  DOM.composerContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.composerContainer.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  });

  // Textarea auto-resize and Enter to send
  DOM.chatPromptInput.addEventListener('input', handleTextareaInput);
  DOM.chatPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  });

  DOM.sendPromptBtn.addEventListener('click', handleSendPrompt);

  // Prompt Starters
  document.querySelectorAll('.starter-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      const action = card.dataset.action;
      if (action === 'image') {
        setInputMode('image');
      } else if (action === 'video') {
        setInputMode('video');
      }
      DOM.chatPromptInput.value = prompt;
      handleTextareaInput();
      handleSendPrompt();
    });
  });

  // Studio Action Handlers
  DOM.generateImgBtn.addEventListener('click', handleStudioImageGen);
  DOM.generateVideoBtn.addEventListener('click', handleStudioVideoGen);

  // Lightbox Close
  DOM.closeLightboxBtn.addEventListener('click', closeLightbox);
  DOM.mediaLightbox.addEventListener('click', (e) => {
    if (e.target === DOM.mediaLightbox) closeLightbox();
  });

  // Scroll to bottom
  DOM.scrollToBottomBtn.addEventListener('click', scrollToBottom);
  DOM.chatViewport.addEventListener('scroll', () => {
    const isNearBottom = DOM.chatViewport.scrollHeight - DOM.chatViewport.scrollTop - DOM.chatViewport.clientHeight < 120;
    DOM.scrollToBottomBtn.classList.toggle('hidden', isNearBottom);
  });
}

/* ============================================================
   TABS & MODE SWITCHING
   ============================================================ */
function switchTab(tabId) {
  appState.activeTab = tabId;

  DOM.navChatBtn.classList.toggle('active', tabId === 'chat');
  DOM.navImageBtn.classList.toggle('active', tabId === 'image-studio');
  DOM.navVideoBtn.classList.toggle('active', tabId === 'video-studio');

  DOM.chatPanel.classList.toggle('active', tabId === 'chat');
  DOM.imageStudioPanel.classList.toggle('active', tabId === 'image-studio');
  DOM.videoStudioPanel.classList.toggle('active', tabId === 'video-studio');
}

function setInputMode(mode) {
  appState.inputMode = mode;

  DOM.modePills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.mode === mode);
  });

  if (mode === 'chat') {
    DOM.composerModeChip.classList.add('hidden');
    DOM.chatPromptInput.placeholder = 'Ask anything, type /image or /video, or drop files here...';
  } else if (mode === 'image') {
    DOM.composerModeChip.classList.remove('hidden');
    DOM.composerModeChipText.textContent = '🎨 Mode: Generate Image';
    DOM.chatPromptInput.placeholder = 'Describe the image you want to generate (Flux.1 Ultra)...';
  } else if (mode === 'video') {
    DOM.composerModeChip.classList.remove('hidden');
    DOM.composerModeChipText.textContent = '🎬 Mode: Generate Video';
    DOM.chatPromptInput.placeholder = 'Describe the scene and motion to generate an AI video...';
  }
}

/* ============================================================
   MODELS MANAGEMENT
   ============================================================ */
async function initModels() {
  updateCurrentModelUI(appState.currentModel);
  renderModelDropdownList();

  // Load models dynamically in background
  await refreshModelsList();
}

async function refreshModelsList() {
  const apiKey = State.getApiKey();
  const { freeModels } = await OpenRouterAPI.fetchModels(apiKey);
  if (freeModels && freeModels.length > 0) {
    appState.availableModels = freeModels;
    renderModelDropdownList();
    populateDefaultModelSelect();
  }
}

function updateCurrentModelUI(modelId) {
  appState.currentModel = modelId;
  State.setSelectedModel(modelId);

  const modelObj = appState.availableModels.find(m => m.id === modelId);
  const displayName = modelObj ? modelObj.name : modelId.split('/')[1] || modelId;
  DOM.currentModelName.textContent = displayName;
}

function renderModelDropdownList(filterQuery = '') {
  DOM.modelListScroll.innerHTML = '';
  const query = filterQuery.toLowerCase().trim();

  const filtered = appState.availableModels.filter(m => {
    return m.id.toLowerCase().includes(query) || (m.name && m.name.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    DOM.modelListScroll.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">No matching free models found.</div>`;
    return;
  }

  filtered.forEach(m => {
    const isSelected = m.id === appState.currentModel;
    const item = document.createElement('div');
    item.className = `model-option-item ${isSelected ? 'selected' : ''}`;
    item.innerHTML = `
      <div class="model-opt-header">
        <span class="model-opt-name">${escapeHtml(m.name || m.id)}</span>
        <span class="model-tag-free">FREE</span>
      </div>
      <div class="model-opt-id">${escapeHtml(m.id)}</div>
      <div class="model-badges-line">
        <span class="model-pill-badge">${formatContextLength(m.context_length)} ctx</span>
        ${m.isVision ? `<span class="model-pill-badge vision">👁️ Vision Ready</span>` : ''}
      </div>
    `;

    item.addEventListener('click', () => {
      updateCurrentModelUI(m.id);
      DOM.modelDropdownMenu.classList.add('hidden');
    });

    DOM.modelListScroll.appendChild(item);
  });
}

function formatContextLength(ctx) {
  if (!ctx) return '32k';
  if (ctx >= 1000000) return `${Math.round(ctx / 1000000)}M`;
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}k`;
  return `${ctx}`;
}

/* ============================================================
   SESSIONS & CHAT HISTORY
   ============================================================ */
function loadSessions() {
  const sessions = State.getSessions();
  let active = State.getActiveSession();

  if (!active) {
    if (sessions.length > 0) {
      active = sessions[0];
      State.setActiveSessionId(active.id);
    } else {
      active = State.createSession();
    }
  }

  appState.activeSession = active;
  renderSessionsSidebar();
  renderActiveSessionMessages();
}

function createNewChatSession() {
  const newSession = State.createSession();
  appState.activeSession = newSession;
  appState.pendingAttachments = [];
  renderAttachmentsPreview();
  renderSessionsSidebar();
  renderActiveSessionMessages();
  switchTab('chat');
  DOM.chatPromptInput.focus();
}

function switchSession(sessionId) {
  State.setActiveSessionId(sessionId);
  appState.activeSession = State.getActiveSession();
  appState.pendingAttachments = [];
  renderAttachmentsPreview();
  renderSessionsSidebar();
  renderActiveSessionMessages();
  switchTab('chat');
}

function renderSessionsSidebar() {
  DOM.sessionsList.innerHTML = '';
  const sessions = State.getSessions();

  if (sessions.length === 0) {
    DOM.sessionsList.innerHTML = `<div style="padding: 12px 8px; color: var(--text-muted); font-size: 11px;">No previous chats</div>`;
    return;
  }

  sessions.forEach(s => {
    const isActive = appState.activeSession && appState.activeSession.id === s.id;
    const item = document.createElement('div');
    item.className = `session-item ${isActive ? 'active' : ''}`;
    item.innerHTML = `
      <span class="session-title">${escapeHtml(s.title || 'Conversation')}</span>
      <button class="session-delete-btn" title="Delete conversation">${Icons.trash}</button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.session-delete-btn')) return;
      switchSession(s.id);
      if (window.innerWidth <= 868) DOM.sidebar.classList.remove('open');
    });

    const delBtn = item.querySelector('.session-delete-btn');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      State.deleteSession(s.id);
      loadSessions();
    });

    DOM.sessionsList.appendChild(item);
  });
}

function renderActiveSessionMessages() {
  DOM.messagesContainer.innerHTML = '';
  const messages = appState.activeSession?.messages || [];

  if (messages.length === 0) {
    DOM.welcomeScreen.classList.remove('hidden');
  } else {
    DOM.welcomeScreen.classList.add('hidden');
    messages.forEach(msg => appendMessageToUI(msg, false));
    scrollToBottom();
  }
}

/* ============================================================
   ATTACHMENTS & FILE HANDLING (UNLIMITED)
   ============================================================ */
function handleFilesSelected(e) {
  if (e.target.files && e.target.files.length > 0) {
    processFileList(e.target.files);
    e.target.value = '';
  }
}

async function processFileList(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isImage = file.type.startsWith('image/');

    const attachmentItem = {
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      dataUrl: null,
      textContent: null
    };

    if (isImage) {
      attachmentItem.dataUrl = await readFileAsDataURL(file);
    } else {
      // If code/text/pdf
      try {
        attachmentItem.textContent = await readFileAsText(file);
      } catch {
        attachmentItem.textContent = `[File uploaded: ${file.name} (${file.size} bytes)]`;
      }
    }

    appState.pendingAttachments.push(attachmentItem);
  }

  renderAttachmentsPreview();
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function renderAttachmentsPreview() {
  DOM.attachmentsPreviewStrip.innerHTML = '';
  if (appState.pendingAttachments.length === 0) {
    DOM.attachmentsPreviewStrip.classList.add('hidden');
    return;
  }

  DOM.attachmentsPreviewStrip.classList.remove('hidden');

  appState.pendingAttachments.forEach((att, idx) => {
    const pill = document.createElement('div');
    pill.className = 'preview-pill';

    if (att.dataUrl) {
      pill.innerHTML = `
        <img src="${att.dataUrl}" alt="thumb" />
        <span>${escapeHtml(att.name)}</span>
        <button class="preview-remove-btn" title="Remove">&times;</button>
      `;
    } else {
      pill.innerHTML = `
        <span>📄</span>
        <span>${escapeHtml(att.name)}</span>
        <button class="preview-remove-btn" title="Remove">&times;</button>
      `;
    }

    pill.querySelector('.preview-remove-btn').addEventListener('click', () => {
      appState.pendingAttachments.splice(idx, 1);
      renderAttachmentsPreview();
    });

    DOM.attachmentsPreviewStrip.appendChild(pill);
  });
}

function handleTextareaInput() {
  DOM.chatPromptInput.style.height = 'auto';
  DOM.chatPromptInput.style.height = Math.min(DOM.chatPromptInput.scrollHeight, 180) + 'px';
}

/* ============================================================
   PROMPT DISPATCH & EXECUTION (CHAT, IMAGE, VIDEO)
   ============================================================ */
async function handleSendPrompt() {
  if (appState.isGenerating) {
    // User clicked Stop
    if (appState.abortController) {
      appState.abortController.abort();
    }
    return;
  }

  const text = DOM.chatPromptInput.value.trim();
  const attachments = [...appState.pendingAttachments];

  if (!text && attachments.length === 0) return;

  // Clear inputs
  DOM.chatPromptInput.value = '';
  DOM.chatPromptInput.style.height = 'auto';
  appState.pendingAttachments = [];
  renderAttachmentsPreview();
  DOM.welcomeScreen.classList.add('hidden');

  // Detect Mode or Slash Commands
  let effectiveMode = appState.inputMode;
  let cleanText = text;

  if (text.startsWith('/image ')) {
    effectiveMode = 'image';
    cleanText = text.replace('/image ', '').trim();
  } else if (text.startsWith('/video ')) {
    effectiveMode = 'video';
    cleanText = text.replace('/video ', '').trim();
  }

  // 1. Create and render User Message
  const userMessage = {
    role: 'user',
    content: text,
    attachments,
    createdAt: new Date().toISOString()
  };

  appState.activeSession.messages.push(userMessage);

  // If first message, update session title
  let titleUpdate = null;
  if (appState.activeSession.messages.length === 1) {
    titleUpdate = (cleanText || attachments[0]?.name || 'Chat').slice(0, 32);
    appState.activeSession.title = titleUpdate;
  }

  State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages, titleUpdate);
  renderSessionsSidebar();
  appendMessageToUI(userMessage);

  // Dispatch based on mode
  if (effectiveMode === 'image') {
    await executeImageGenInChat(cleanText);
  } else if (effectiveMode === 'video') {
    await executeVideoGenInChat(cleanText);
  } else {
    await executeChatCompletion();
  }
}

/**
 * Handle AI Image Generation inline within chat
 */
async function executeImageGenInChat(prompt) {
  setGeneratingState(true);

  const botMsg = {
    role: 'assistant',
    content: `🎨 Generating 4K image for: *"${escapeHtml(prompt)}"* with Flux.1...`,
    media: null,
    model: 'flux-ultra',
    createdAt: new Date().toISOString()
  };

  appState.activeSession.messages.push(botMsg);
  const msgEl = appendMessageToUI(botMsg);

  try {
    const result = await MediaGen.generateImage({ prompt });
    botMsg.content = `✨ Here is your generated 4K image for: **${prompt}**`;
    botMsg.media = result;
    State.addMediaItem(result);
    State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);

    // Update message card
    updateMessageMediaCard(msgEl, botMsg);
  } catch (err) {
    botMsg.content = `❌ Image Generation Error: ${err.message}`;
    State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);
    updateMessageContent(msgEl, botMsg.content);
  } finally {
    setGeneratingState(false);
  }
}

/**
 * Handle AI Video Generation inline within chat
 */
async function executeVideoGenInChat(prompt) {
  setGeneratingState(true);

  const botMsg = {
    role: 'assistant',
    content: `🎬 Generating AI Video for: *"${escapeHtml(prompt)}"* with CogVideoX / Wan...`,
    media: null,
    model: 'cogvideox',
    createdAt: new Date().toISOString()
  };

  appState.activeSession.messages.push(botMsg);
  const msgEl = appendMessageToUI(botMsg);

  try {
    const result = await MediaGen.generateVideo({ prompt });
    botMsg.content = `🎬 Here is your AI generated video for: **${prompt}**`;
    botMsg.media = result;
    State.addMediaItem(result);
    State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);

    updateMessageMediaCard(msgEl, botMsg);
  } catch (err) {
    botMsg.content = `❌ Video Generation Error: ${err.message}`;
    State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);
    updateMessageContent(msgEl, botMsg.content);
  } finally {
    setGeneratingState(false);
  }
}

/**
 * Handle OpenRouter AI Chat Completion with streaming
 */
async function executeChatCompletion() {
  const apiKey = State.getApiKey();
  if (!apiKey) {
    appendMessageToUI({
      role: 'assistant',
      content: `⚠️ **OpenRouter API Key Missing**\n\nPlease click on **Settings & API Key** (or the ⚙️ icon) to enter your OpenRouter API key. Free models like \`google/gemini-2.0-flash-exp:free\`, \`deepseek/deepseek-r1:free\`, and \`meta-llama/llama-3.3-70b-instruct:free\` require a key to authenticate.`,
      model: 'system'
    });
    openSettingsModal();
    return;
  }

  setGeneratingState(true);
  appState.abortController = new AbortController();

  // Create empty assistant message
  const assistantMsg = {
    role: 'assistant',
    content: '',
    model: appState.currentModel,
    createdAt: new Date().toISOString()
  };

  appState.activeSession.messages.push(assistantMsg);
  const msgEl = appendMessageToUI(assistantMsg);
  const contentBodyEl = msgEl.querySelector('.message-body');

  // Format messages payload
  const formattedPayload = appState.activeSession.messages
    .slice(0, -1) // exclude current assistant msg
    .map(m => OpenRouterAPI.formatMessage(m.role, m.content, m.attachments));

  let streamingText = '';

  await OpenRouterAPI.streamChat({
    apiKey,
    model: appState.currentModel,
    messages: formattedPayload,
    settings: State.getSettings(),
    signal: appState.abortController.signal,
    onDelta: (delta, accumulated) => {
      streamingText = accumulated;
      assistantMsg.content = streamingText;
      contentBodyEl.innerHTML = marked.parse(streamingText) + `<span class="typing-cursor"></span>`;
      attachCodeCopyButtons(contentBodyEl);
      scrollToBottom();
    },
    onDone: (finalText, aborted) => {
      if (aborted) {
        assistantMsg.content = (streamingText || '') + ' *(Generation stopped by user)*';
      } else {
        assistantMsg.content = finalText || streamingText || 'No response generated.';
      }
      contentBodyEl.innerHTML = marked.parse(assistantMsg.content);
      attachCodeCopyButtons(contentBodyEl);
      State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);
      setGeneratingState(false);
    },
    onError: (err) => {
      assistantMsg.content = `⚠️ **Error:** ${err.message}`;
      contentBodyEl.innerHTML = marked.parse(assistantMsg.content);
      State.updateSessionMessages(appState.activeSession.id, appState.activeSession.messages);
      setGeneratingState(false);
    }
  });
}

function setGeneratingState(generating) {
  appState.isGenerating = generating;
  if (generating) {
    DOM.sendPromptBtn.innerHTML = Icons.stop;
    DOM.sendPromptBtn.classList.add('stop');
    DOM.sendPromptBtn.title = 'Stop generating';
  } else {
    DOM.sendPromptBtn.innerHTML = Icons.send;
    DOM.sendPromptBtn.classList.remove('stop');
    DOM.sendPromptBtn.title = 'Send prompt';
    appState.abortController = null;
  }
}

/* ============================================================
   MESSAGE UI RENDERING & CODE COPY
   ============================================================ */
function appendMessageToUI(msg, shouldScroll = true) {
  const isUser = msg.role === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user' : 'assistant'}`;

  // Attachments display for user
  let attachmentsHTML = '';
  if (msg.attachments && msg.attachments.length > 0) {
    const images = msg.attachments.filter(a => a.type?.startsWith('image/'));
    const files = msg.attachments.filter(a => !a.type?.startsWith('image/'));

    attachmentsHTML += `<div class="message-attachments-display">`;
    images.forEach(img => {
      attachmentsHTML += `
        <div class="message-image-bubble" data-img-url="${img.dataUrl}">
          <img src="${img.dataUrl}" alt="Attachment" />
        </div>
      `;
    });
    files.forEach(f => {
      attachmentsHTML += `
        <div class="attachment-chip">
          <span>📄</span>
          <span class="attachment-chip-name">${escapeHtml(f.name)}</span>
        </div>
      `;
    });
    attachmentsHTML += `</div>`;
  }

  // Media card for image/video generation
  let mediaCardHTML = '';
  if (msg.media) {
    mediaCardHTML = buildMediaCardHTML(msg.media);
  }

  const modelBadge = msg.model ? `<span class="message-model-badge">${escapeHtml(msg.model.split('/')[1] || msg.model)}</span>` : '';

  row.innerHTML = `
    <div class="message-avatar">
      ${isUser ? 'U' : Icons.sparkles}
    </div>
    <div class="message-content-wrapper">
      <div class="message-header">
        <span class="sender-name">${isUser ? 'You' : 'Nexus AI'}</span>
        ${modelBadge}
      </div>
      ${attachmentsHTML}
      <div class="message-body">${marked.parse(msg.content || '')}</div>
      ${mediaCardHTML}
    </div>
  `;

  // Click image to enlarge in lightbox
  row.querySelectorAll('.message-image-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
      openLightbox(bubble.dataset.imgUrl, 'image');
    });
  });

  // Attach media buttons
  setupMediaCardEvents(row, msg.media);
  attachCodeCopyButtons(row);

  DOM.messagesContainer.appendChild(row);

  if (shouldScroll) {
    scrollToBottom();
  }

  return row;
}

function updateMessageContent(msgEl, newContent) {
  const bodyEl = msgEl.querySelector('.message-body');
  if (bodyEl) {
    bodyEl.innerHTML = marked.parse(newContent);
    attachCodeCopyButtons(bodyEl);
  }
}

function updateMessageMediaCard(msgEl, msg) {
  updateMessageContent(msgEl, msg.content);
  const wrapper = msgEl.querySelector('.message-content-wrapper');
  if (msg.media && wrapper) {
    const existingCard = wrapper.querySelector('.generated-media-card');
    if (existingCard) existingCard.remove();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = buildMediaCardHTML(msg.media);
    const newCard = tempDiv.firstElementChild;
    wrapper.appendChild(newCard);
    setupMediaCardEvents(msgEl, msg.media);
  }
}

function buildMediaCardHTML(media) {
  if (media.type === 'image') {
    return `
      <div class="generated-media-card">
        <div class="media-preview-container">
          <img src="${media.url}" alt="${escapeHtml(media.prompt)}" class="clickable-media" />
        </div>
        <div class="media-card-footer">
          <div class="media-info">
            <span class="media-prompt">${escapeHtml(media.prompt)}</span>
            <span class="media-model-tag">Flux.1 Ultra • 4K</span>
          </div>
          <button class="btn btn-sm btn-secondary download-media-btn" data-url="${media.url}" data-name="nexus-${media.seed}.png">
            ${Icons.download} Download
          </button>
        </div>
      </div>
    `;
  } else if (media.type === 'video') {
    return `
      <div class="generated-media-card">
        <div class="media-preview-container">
          <video src="${media.url}" controls autoplay loop muted playsinline class="clickable-media"></video>
        </div>
        <div class="media-card-footer">
          <div class="media-info">
            <span class="media-prompt">${escapeHtml(media.prompt)}</span>
            <span class="media-model-tag">CogVideoX • AI Motion</span>
          </div>
          <button class="btn btn-sm btn-secondary download-media-btn" data-url="${media.url}" data-name="nexus-${media.seed}.mp4">
            ${Icons.download} Download
          </button>
        </div>
      </div>
    `;
  }
  return '';
}

function setupMediaCardEvents(parentEl, media) {
  if (!media) return;

  const downloadBtn = parentEl.querySelector('.download-media-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      MediaGen.downloadMedia(downloadBtn.dataset.url, downloadBtn.dataset.name);
    });
  }

  const mediaEl = parentEl.querySelector('.clickable-media');
  if (mediaEl && media.type === 'image') {
    mediaEl.addEventListener('click', () => {
      openLightbox(media.url, 'image');
    });
  }
}

function attachCodeCopyButtons(container) {
  const codeBlocks = container.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    if (pre.querySelector('.code-header')) return; // already added

    const code = pre.querySelector('code');
    const lang = code?.className.replace('language-', '') || 'code';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <span>${escapeHtml(lang)}</span>
      <button class="code-copy-btn">${Icons.copy} Copy</button>
    `;

    const copyBtn = header.querySelector('.code-copy-btn');
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.innerText);
      copyBtn.innerHTML = `${Icons.check} Copied!`;
      setTimeout(() => {
        copyBtn.innerHTML = `${Icons.copy} Copy`;
      }, 2000);
    });

    pre.insertBefore(header, pre.firstChild);
  });
}

function scrollToBottom() {
  DOM.chatViewport.scrollTo({
    top: DOM.chatViewport.scrollHeight,
    behavior: 'smooth'
  });
}

/* ============================================================
   STUDIO TABS GENERATION (IMAGE & VIDEO)
   ============================================================ */
async function handleStudioImageGen() {
  const prompt = DOM.imgStudioPrompt.value.trim();
  if (!prompt) {
    alert('Please enter a description for the image.');
    return;
  }

  const style = DOM.imgStudioStyle.value;
  const ratio = DOM.imgStudioRatio.value;
  const negPrompt = DOM.imgStudioNegPrompt.value.trim();

  DOM.generateImgBtn.disabled = true;
  DOM.generateImgBtn.innerHTML = `<span>Generating 4K Image...</span>`;
  DOM.imgPreviewCanvas.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
      <span class="status-dot warning" style="width:16px; height:16px;"></span>
      <p style="font-size:13px; color:var(--text-secondary);">Rendering 4K visual with Flux.1...</p>
    </div>
  `;

  try {
    const result = await MediaGen.generateImage({
      prompt,
      negativePrompt: negPrompt,
      model: style,
      aspectRatio: ratio
    });

    DOM.imgPreviewCanvas.innerHTML = `<img src="${result.url}" alt="${escapeHtml(prompt)}" id="currentStudioImgPreview" />`;
    DOM.downloadImgBtn.classList.remove('hidden');
    DOM.downloadImgBtn.onclick = () => MediaGen.downloadMedia(result.url, `flux-${Date.now()}.png`);

    document.getElementById('currentStudioImgPreview').onclick = () => openLightbox(result.url, 'image');

    State.addMediaItem(result);
  } catch (err) {
    DOM.imgPreviewCanvas.innerHTML = `<div style="color:var(--accent-rose); padding:20px; text-align:center;">Failed: ${err.message}</div>`;
  } finally {
    DOM.generateImgBtn.disabled = false;
    DOM.generateImgBtn.innerHTML = `${Icons.sparkles} <span>Generate Image</span>`;
  }
}

async function handleStudioVideoGen() {
  const prompt = DOM.videoStudioPrompt.value.trim();
  if (!prompt) {
    alert('Please enter a description for the video.');
    return;
  }

  const model = DOM.videoStudioModel.value;

  DOM.generateVideoBtn.disabled = true;
  DOM.generateVideoBtn.innerHTML = `<span>Creating AI Video...</span>`;
  DOM.videoPreviewCanvas.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
      <span class="status-dot warning" style="width:16px; height:16px;"></span>
      <p style="font-size:13px; color:var(--text-secondary);">Generating motion frames with ${model}...</p>
    </div>
  `;

  try {
    const result = await MediaGen.generateVideo({ prompt, model });

    DOM.videoPreviewCanvas.innerHTML = `<video src="${result.url}" controls autoplay loop playsinline id="currentStudioVideoPreview"></video>`;
    DOM.downloadVideoBtn.classList.remove('hidden');
    DOM.downloadVideoBtn.onclick = () => MediaGen.downloadMedia(result.url, `video-${Date.now()}.mp4`);

    State.addMediaItem(result);
  } catch (err) {
    DOM.videoPreviewCanvas.innerHTML = `<div style="color:var(--accent-rose); padding:20px; text-align:center;">Failed: ${err.message}</div>`;
  } finally {
    DOM.generateVideoBtn.disabled = false;
    DOM.generateVideoBtn.innerHTML = `${Icons.sparkles} <span>Generate AI Video</span>`;
  }
}

/* ============================================================
   SETTINGS & API KEY TESTING
   ============================================================ */
function setupSettingsUI() {
  const settings = State.getSettings();
  DOM.settingsApiKeyInput.value = State.getApiKey();
  DOM.systemPromptInput.value = settings.systemPrompt || '';
  DOM.temperatureInput.value = settings.temperature ?? 0.7;
  DOM.temperatureVal.textContent = settings.temperature ?? 0.7;
  DOM.maxTokensInput.value = settings.maxTokens ?? 4096;
  DOM.maxTokensVal.textContent = settings.maxTokens ?? 4096;

  populateDefaultModelSelect();
}

function populateDefaultModelSelect() {
  DOM.defaultModelSelect.innerHTML = '';
  DOM.freeModelsBadgesWrap.innerHTML = '';

  appState.availableModels.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name || m.id} (Free)`;
    if (m.id === appState.currentModel) opt.selected = true;
    DOM.defaultModelSelect.appendChild(opt);

    // Free Model Quick Select Badges
    const badgeBtn = document.createElement('button');
    badgeBtn.type = 'button';
    badgeBtn.className = `free-model-badge-btn ${m.id === appState.currentModel ? 'active' : ''}`;
    badgeBtn.textContent = m.id.split('/')[1] || m.id;
    badgeBtn.title = m.name || m.id;
    badgeBtn.addEventListener('click', () => {
      DOM.defaultModelSelect.value = m.id;
      updateCurrentModelUI(m.id);
      document.querySelectorAll('.free-model-badge-btn').forEach(b => b.classList.remove('active'));
      badgeBtn.classList.add('active');
    });
    DOM.freeModelsBadgesWrap.appendChild(badgeBtn);
  });
}

function openSettingsModal() {
  DOM.settingsApiKeyInput.value = State.getApiKey();
  DOM.settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
  DOM.settingsModal.classList.add('hidden');
  DOM.testResultBox.classList.add('hidden');
}

function saveSettingsFromModal() {
  const newKey = DOM.settingsApiKeyInput.value.trim();
  State.setApiKey(newKey);

  const selectedDefault = DOM.defaultModelSelect.value;
  if (selectedDefault) {
    updateCurrentModelUI(selectedDefault);
  }

  const updatedSettings = {
    systemPrompt: DOM.systemPromptInput.value.trim(),
    temperature: parseFloat(DOM.temperatureInput.value),
    maxTokens: parseInt(DOM.maxTokensInput.value, 10),
    topP: 0.9,
    defaultFreeModel: selectedDefault
  };

  State.saveSettings(updatedSettings);
  checkApiKeyStatus();
  closeSettingsModal();
}

async function runKeyConnectionTest() {
  const testKey = DOM.settingsApiKeyInput.value.trim();
  DOM.testResultBox.classList.remove('hidden', 'success', 'error');
  DOM.testResultBadge.textContent = 'TESTING...';
  DOM.testResultBadge.style.color = 'var(--accent-amber)';
  DOM.testResultLatency.textContent = '';
  DOM.testResultMessage.textContent = 'Connecting to OpenRouter API endpoint...';
  DOM.testConnectionBtn.disabled = true;

  const result = await OpenRouterAPI.testConnection(testKey);
  DOM.testConnectionBtn.disabled = false;

  if (result.ok) {
    DOM.testResultBox.classList.add('success');
    DOM.testResultBadge.textContent = 'SUCCESS (200 OK)';
    DOM.testResultBadge.style.color = 'var(--accent-emerald)';
    DOM.testResultLatency.textContent = `${result.latency} ms`;
    
    let extra = '';
    if (result.details?.label) extra += `Key Label: ${result.details.label}. `;
    if (result.details?.is_free_tier !== undefined) extra += `Free Tier: ${result.details.is_free_tier ? 'Active' : 'Custom'}. `;

    DOM.testResultMessage.textContent = `${result.message} ${extra}`;
    updateStatusIndicators(true, `${result.latency}ms Connected`);
  } else {
    DOM.testResultBox.classList.add('error');
    DOM.testResultBadge.textContent = 'FAILED';
    DOM.testResultBadge.style.color = 'var(--accent-rose)';
    DOM.testResultLatency.textContent = result.latency ? `${result.latency} ms` : '';
    DOM.testResultMessage.textContent = result.message;
    updateStatusIndicators(false, 'Key Error');
  }
}

async function checkApiKeyStatus() {
  const key = State.getApiKey();
  if (!key) {
    updateStatusIndicators(false, 'No Key Set');
    return;
  }

  updateStatusIndicators('testing', 'Checking...');
  const res = await OpenRouterAPI.testConnection(key);
  if (res.ok) {
    updateStatusIndicators(true, `Connected (${res.latency}ms)`);
  } else {
    updateStatusIndicators(false, 'Invalid Key');
  }
}

function updateStatusIndicators(state, text) {
  const isOk = state === true;
  const isTesting = state === 'testing';

  const dotClass = isOk ? 'success' : isTesting ? 'warning' : 'danger';

  DOM.topNavStatusDot.className = `status-dot ${dotClass}`;
  DOM.topNavStatusText.textContent = text;

  DOM.sidebarStatusDot.className = `status-dot ${dotClass}`;
  DOM.sidebarStatusLabel.textContent = isOk ? 'OpenRouter Connected' : isTesting ? 'Testing Connection...' : 'API Key Required';
  DOM.sidebarStatusSub.textContent = text;
}

/* ============================================================
   LIGHTBOX MODAL
   ============================================================ */
function openLightbox(url, type) {
  DOM.mediaLightbox.classList.remove('hidden');
  if (type === 'image') {
    DOM.lightboxImg.src = url;
    DOM.lightboxImg.classList.remove('hidden');
    DOM.lightboxVideo.classList.add('hidden');
    DOM.lightboxVideo.pause();
  } else {
    DOM.lightboxVideo.src = url;
    DOM.lightboxVideo.classList.remove('hidden');
    DOM.lightboxImg.classList.add('hidden');
    DOM.lightboxVideo.play();
  }
}

function closeLightbox() {
  DOM.mediaLightbox.classList.add('hidden');
  DOM.lightboxImg.src = '';
  DOM.lightboxVideo.src = '';
  DOM.lightboxVideo.pause();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
