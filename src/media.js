// Image and Video Generation Engine (100% Free & Unlimited via Pollinations AI / Flux / CogVideo)

export const MediaGen = {
  /**
   * Generate an image using Pollinations AI (Flux / SDXL)
   * Completely free, no API key needed, high resolution
   */
  async generateImage({
    prompt,
    negativePrompt = '',
    model = 'flux', // 'flux', 'flux-realism', 'flux-anime', 'flux-3d', 'turbo'
    aspectRatio = '1:1', // '1:1', '16:9', '9:16', '4:3', '3:2'
    seed = null
  }) {
    if (!prompt || !prompt.trim()) {
      throw new Error('Please enter a prompt to generate an image.');
    }

    // Determine dimensions based on aspect ratio
    let width = 1024;
    let height = 1024;

    switch (aspectRatio) {
      case '16:9':
        width = 1280;
        height = 720;
        break;
      case '9:16':
        width = 720;
        height = 1280;
        break;
      case '4:3':
        width = 1024;
        height = 768;
        break;
      case '3:2':
        width = 1080;
        height = 720;
        break;
      case '1:1':
      default:
        width = 1024;
        height = 1024;
        break;
    }

    const currentSeed = seed || Math.floor(Math.random() * 999999999);
    let enhancedPrompt = prompt.trim();
    if (negativePrompt) {
      enhancedPrompt += ` (negative: ${negativePrompt.trim()})`;
    }

    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${encodeURIComponent(model)}&seed=${currentSeed}&nologo=true&enhance=true`;

    // Pre-test image loading to ensure generation is ready
    await new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        // Resolve anyway after timeout to allow browser streaming
        resolve(imageUrl);
      }, 25000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(imageUrl);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        // Fallback to direct URL if preloading had CORS or delay
        resolve(imageUrl);
      };
      img.src = imageUrl;
    });

    return {
      type: 'image',
      url: imageUrl,
      prompt,
      model,
      aspectRatio,
      width,
      height,
      seed: currentSeed,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Generate an AI Video using Pollinations CogVideoX / Wan2.1
   */
  async generateVideo({
    prompt,
    model = 'cogvideox',
    aspectRatio = '16:9'
  }) {
    if (!prompt || !prompt.trim()) {
      throw new Error('Please enter a prompt to generate a video.');
    }

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 999999999);
    // Pollinations video endpoint
    const videoUrl = `https://video.pollinations.ai/prompt/${encodedPrompt}?model=${encodeURIComponent(model)}&seed=${seed}`;

    return {
      type: 'video',
      url: videoUrl,
      prompt,
      model,
      aspectRatio,
      seed,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Helper to trigger download of media file
   */
  async downloadMedia(url, filename = 'nexus-media') {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct link fallback
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
};
