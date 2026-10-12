// OpenRouter API client for Models, Authentication Testing, and Chat Completions

export const FALLBACK_FREE_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Google: Gemini 2.0 Flash Exp (Free)', context_length: 1048576, isVision: true },
  { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Google: Gemini 2.0 Pro Exp (Free)', context_length: 2097152, isVision: true },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek: R1 Reasoning (Free)', context_length: 65536, isVision: false },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek: V3 Chat (Free)', context_length: 65536, isVision: false },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Meta: Llama 3.3 70B Instruct (Free)', context_length: 131072, isVision: false },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen: 2.5 Coder 32B (Free)', context_length: 32768, isVision: false },
  { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral: Small 24B Instruct (Free)', context_length: 32768, isVision: false },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Meta: Llama 3.2 3B Instruct (Free)', context_length: 131072, isVision: true },
  { id: 'meta-llama/llama-3.2-1b-instruct:free', name: 'Meta: Llama 3.2 1B Instruct (Free)', context_length: 131072, isVision: false },
  { id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free', name: 'Dolphin 3.0 R1 Mistral 24B (Free)', context_length: 32768, isVision: false }
];

export const OpenRouterAPI = {
  /**
   * Test the OpenRouter API Key connection and retrieve account info
   */
  async testConnection(apiKey) {
    if (!apiKey) {
      return { ok: false, message: 'API key is missing. Please enter your OpenRouter key.' };
    }

    const startTime = performance.now();
    try {
      // Endpoint 1: Auth Key Details
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Nexus AI Studio'
        }
      });

      const latency = Math.round(performance.now() - startTime);

      if (res.status === 401) {
        return { ok: false, latency, message: 'Invalid API Key. Please verify your OpenRouter key.' };
      }

      if (res.ok) {
        const data = await res.json();
        return {
          ok: true,
          latency,
          message: 'Connection successful! API key is valid and connected.',
          details: data.data || {}
        };
      }

      // If /auth/key returns 404 or other status, test with a lightweight models call
      const modelRes = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Nexus AI Studio'
        }
      });

      if (modelRes.ok) {
        return {
          ok: true,
          latency,
          message: 'Connection successful! OpenRouter responded successfully.',
          details: { is_free_tier: true }
        };
      }

      return {
        ok: false,
        latency,
        message: `Connection failed (HTTP ${res.status}). Check network or API key.`
      };
    } catch (err) {
      return {
        ok: false,
        latency: Math.round(performance.now() - startTime),
        message: `Network Error: ${err.message}. Please check your internet connection.`
      };
    }
  },

  /**
   * Fetch all models and filter all free models (:free) dynamically
   */
  async fetchModels(apiKey = '') {
    try {
      const headers = {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Nexus AI Studio'
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch('https://openrouter.ai/api/v1/models', { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const allModels = json.data || [];

      // Filter free models (ends with :free or prompt pricing = 0)
      const freeModels = allModels.filter(m => {
        const isFreeSuffix = m.id.endsWith(':free');
        const isZeroPrice = m.pricing && parseFloat(m.pricing.prompt || '1') === 0 && parseFloat(m.pricing.completion || '1') === 0;
        return isFreeSuffix || isZeroPrice;
      }).map(m => ({
        id: m.id,
        name: m.name || m.id,
        context_length: m.context_length || 32768,
        description: m.description || '',
        isVision: m.architecture?.modality?.includes('image') || m.id.includes('flash') || m.id.includes('vl') || m.id.includes('pro-exp'),
        pricing: m.pricing
      }));

      // Sort with popular ones on top
      freeModels.sort((a, b) => {
        const aPop = a.id.includes('gemini-2.0') || a.id.includes('deepseek') || a.id.includes('llama-3.3') ? 1 : 0;
        const bPop = b.id.includes('gemini-2.0') || b.id.includes('deepseek') || b.id.includes('llama-3.3') ? 1 : 0;
        return bPop - aPop;
      });

      return {
        freeModels: freeModels.length > 0 ? freeModels : FALLBACK_FREE_MODELS,
        allModels
      };
    } catch (err) {
      console.warn('Failed to fetch dynamic models, using fallback list:', err);
      return {
        freeModels: FALLBACK_FREE_MODELS,
        allModels: FALLBACK_FREE_MODELS
      };
    }
  },

  /**
   * Format message payload including text and base64 uploaded files/images
   */
  formatMessage(role, content, attachments = []) {
    // If no attachments, send simple string
    if (!attachments || attachments.length === 0) {
      return { role, content };
    }

    // Multimodal content array
    const parts = [];

    // Separate images from text/document attachments
    const images = attachments.filter(a => a.type.startsWith('image/'));
    const docFiles = attachments.filter(a => !a.type.startsWith('image/'));

    let fullText = content || '';

    // Append document content if available
    if (docFiles.length > 0) {
      const docSummaries = docFiles.map(d => {
        return `--- File: ${d.name} (${d.type}) ---\n${d.textContent || '[Binary file content]'}\n--- End of File ---`;
      }).join('\n\n');
      fullText = (fullText ? fullText + '\n\n' : '') + docSummaries;
    }

    if (fullText) {
      parts.push({ type: 'text', text: fullText });
    }

    // Add image items for multimodal models
    images.forEach(img => {
      parts.push({
        type: 'image_url',
        image_url: {
          url: img.dataUrl
        }
      });
    });

    return { role, content: parts.length === 1 && parts[0].type === 'text' ? parts[0].text : parts };
  },

  /**
   * Send chat completion with SSE streaming
   */
  async streamChat({
    apiKey,
    model,
    messages,
    settings = {},
    signal,
    onDelta,
    onDone,
    onError
  }) {
    if (!apiKey) {
      onError(new Error('OpenRouter API key is not set. Please click Settings (⚙️) to enter your API key.'));
      return;
    }

    const payloadMessages = [];

    // System prompt if provided
    if (settings.systemPrompt) {
      payloadMessages.push({
        role: 'system',
        content: settings.systemPrompt
      });
    }

    // Append formatted conversation messages
    payloadMessages.push(...messages);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Nexus AI Studio'
        },
        body: JSON.stringify({
          model: model || 'google/gemini-2.0-flash-exp:free',
          messages: payloadMessages,
          stream: true,
          temperature: settings.temperature ?? 0.7,
          max_tokens: settings.maxTokens ?? 4096,
          top_p: settings.topP ?? 0.9
        }),
        signal
      });

      if (!response.ok) {
        let errDetails = '';
        try {
          const errJson = await response.json();
          errDetails = errJson.error?.message || JSON.stringify(errJson);
        } catch {
          errDetails = await response.text();
        }

        let userMsg = `OpenRouter Error (${response.status}): ${errDetails}`;
        if (response.status === 401) {
          userMsg = 'API Key is invalid or expired. Please update it in Settings.';
        } else if (response.status === 402) {
          userMsg = `Model ${model} requires credits or is currently unavailable on free tier. Please switch to another free model like "google/gemini-2.0-flash-exp:free" or "deepseek/deepseek-r1:free".`;
        } else if (response.status === 429) {
          userMsg = 'Free tier rate limit reached. Please wait a few seconds and try again, or switch to a different free model.';
        }

        throw new Error(userMsg);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue; // comments/keepalive

          if (trimmed === 'data: [DONE]') {
            onDone(accumulatedText);
            return;
          }

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const data = JSON.parse(dataStr);
              const delta = data.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedText += delta;
                onDelta(delta, accumulatedText);
              }
            } catch {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      onDone(accumulatedText);
    } catch (err) {
      if (err.name === 'AbortError') {
        onDone(null, true); // aborted
      } else {
        onError(err);
      }
    }
  }
};
