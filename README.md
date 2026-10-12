<div align="center">

# 🌟 Fine-Ai (Nexus Ultra)
### Next-Generation ChatGPT-Style OpenRouter Free Hub, 4K Image & AI Video Studio

[![Live Demo](https://img.shields.io/badge/Demo-Live_on_GitHub_Pages-6366f1?style=for-the-badge&logo=github)](https://fine-lk.github.io/Fine-Ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![OpenRouter](https://img.shields.io/badge/API-OpenRouter_Free_Tier-06b6d4?style=for-the-badge)](https://openrouter.ai)
[![Flux.1](https://img.shields.io/badge/Image_Gen-Flux.1_4K_Ultra-ec4899?style=for-the-badge)](https://pollinations.ai)
[![CogVideoX](https://img.shields.io/badge/Video_Gen-CogVideoX_%26_Wan-f59e0b?style=for-the-badge)](https://pollinations.ai)

**[🌐 Click Here to Open Live App](https://fine-lk.github.io/Fine-Ai/)**

---

<p align="center">
  A premium, high-performance web interface designed for <b>OpenRouter Free Models</b>, featuring <b>unlimited file & image uploads</b>, <b>real-time streaming markdown</b>, <b>4K image creation (Flux.1)</b>, and <b>cinematic AI video generation</b>. Zero backend servers required — 100% hosted on <b>GitHub Pages</b>!
</p>

</div>

---

## 📑 Table of Contents (පටුන)

- [✨ Core Features](#-core-features)
- [🚀 Quick Start Guide (English)](#-quick-start-guide-english)
  - [1. Getting Your Free OpenRouter Key](#1-getting-your-free-openrouter-key)
  - [2. Testing & Connecting API Key](#2-testing--connecting-api-key)
  - [3. Chatting & Model Switching](#3-chatting--model-switching)
  - [4. Unlimited File & Image Uploads](#4-unlimited-file--image-uploads)
  - [5. 4K Image Generation Studio](#5-4k-image-generation-studio)
  - [6. AI Video Generation Studio](#6-ai-video-generation-studio)
- [🇱🇰 සිංහල මාර්ගෝපදේශය (Sinhala User Guide)](#-සිංහල-මාර්ගෝපදේශය-sinhala-user-guide)
  - [නොමිලේ OpenRouter API Key එකක් ගන්නා ආකාරය](#1-නොමිලේ-openrouter-api-key-එකක්-ගන්නා-ආකාරය)
  - [Key එක දමා Test කරන ආකාරය](#2-key-එක-දමා-test-කරන-ආකාරය)
  - [Images & Files Upload කිරීම](#3-images--files-upload-කිරීම)
  - [4K Images සහ AI Videos Generate කිරීම](#4-4k-images-සහ-ai-videos-generate-කිරීම)
- [⚡ Available Free Models](#-available-free-models)
- [🛠️ Local Setup & Development](#️-local-setup--development)
- [🔒 Security & Privacy](#-security--privacy)
- [📄 License](#-license)

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **ChatGPT Ultra Dark UX** | Sleek Obsidian glassmorphism theme, collapsible sidebar, session history, and silky smooth transitions. |
| **API Connection Tester** | Built-in network latency tester (ms), key validity verifier, and account rate-limit indicator. |
| **Dynamic Free Models** | Auto-fetches and filters all active `:free` models directly from OpenRouter API. |
| **Multimodal Uploads** | Unlimited drag-and-drop file uploads (Images, PDFs, TXT, JSON, CSV, Python, JS). |
| **Streaming Responses** | Real-time SSE token streaming with typewriter cursor effect. |
| **Code Highlighting** | JetBrains Mono syntax highlighting with 1-click **Copy Code** button. |
| **4K Image Studio** | Ultra-high-resolution image generation powered by Flux.1 & SDXL Turbo with presets and aspect ratios. |
| **AI Video Studio** | Text-to-Video generation using CogVideoX and Wan AI with video player & instant download. |
| **🧠 AI Skills Hub & Creator** | Pre-built specialized personas (Code Architect, 4K Prompt Engineer, Data Analyst, Sinhala Master, Academic Researcher) + Create your own custom skills! |
| **100% Client-Side Privacy** | API keys and conversations are stored exclusively in your browser's `localStorage`. |

---

## 🚀 Quick Start Guide (English)

### 1. Getting Your Free OpenRouter Key
1. Go to [OpenRouter.ai Keys](https://openrouter.ai/settings/keys).
2. Sign in with your Google or GitHub account.
3. Click **"Create Key"** and give it a name (e.g., `Fine-AI`).
4. Copy your generated key (`sk-or-v1-...`).
*(OpenRouter provides free tier access to models ending with `:free` with 0 billing required).*

### 2. Testing & Connecting API Key
1. Open the [Fine-Ai Live App](https://fine-lk.github.io/Fine-Ai/).
2. Click **Settings & API Key (⚙️)** in the sidebar or top navigation.
3. Paste your OpenRouter API key into the input field.
4. Click **"Test API Connection"**:
   - 🟢 **Success**: Shows your connection latency (e.g. `42 ms`), key label, and free-tier confirmation.
   - 🔴 **Failed**: Explains if the key is mistyped or network blocked.
5. Click **"Save Settings"**.

### 3. Chatting & Model Switching
- **Switch Models**: Click the top model badge (`Gemini 2.0 Flash Exp | FREE`) to open the model picker dropdown. Search or pick from top free models like **DeepSeek R1**, **Meta Llama 3.3 70B**, or **Qwen 2.5 Coder**.
- **Chat**: Type questions, prompts, or code requests. The AI streams answers with syntax-highlighted code blocks.
- **Sessions**: Conversations are automatically grouped and saved in the sidebar. Click **"+ New Chat"** to start a fresh thread.

### 4. Unlimited File & Image Uploads
- Click the **Paperclip (📎)** icon or drag and drop any file directly onto the composer bar.
- **Images**: Vision-capable models (`Gemini 2.0 Flash Exp`, `Llama 3.2 3B Vision`) will analyze, OCR, and describe your images.
- **Documents & Code**: Upload `.txt`, `.py`, `.js`, `.json`, `.pdf`, `.csv` files for code review, summarization, or debugging.

### 5. 4K Image Generation Studio
You can create stunning 4K images in two ways:
- **Direct in Chat**: Type `/image <prompt>` (e.g., `/image Cyberpunk neon city in rain, 8k cinematic`).
- **Image Studio Tab**: Click **Image Studio (Flux)** in the sidebar:
  - Enter your prompt and optional negative prompt.
  - Choose style: `Flux.1 Ultra`, `Photorealistic`, `Anime & Manga`, `3D Render`, or `SDXL Turbo`.
  - Select aspect ratio: `1:1 Square`, `16:9 Landscape`, `9:16 Mobile Reels`, `4:3`, or `3:2`.
  - Click **Generate Image** -> Preview -> Download with 1-click!

### 6. AI Video Generation Studio
Generate motion video clips from text:
- **Direct in Chat**: Type `/video <prompt>` (e.g., `/video An astronaut floating in space looking at earth`).
- **Video Studio Tab**: Click **Video Studio (AI)** in the sidebar:
  - Enter your motion prompt.
  - Select model (`CogVideoX` or `Wan 2.1`).
  - Click **Generate AI Video** -> Play inline or Download MP4!

### 7. 🧠 AI Skills Hub & Custom Skills Creator
Supercharge your AI by equipping it with specialized expert personas or create your own custom skills:
- **Browse Pre-Built Skills**: Click **AI Skills Hub** in the sidebar. Select from:
  - 💻 **Code Architect & Bug Hunter**: Senior principal software engineer, clean architecture & bug fixes.
  - 🎨 **4K Prompt Engineer & Visualizer**: Generates hyper-detailed lighting, lenses, and camera prompts for Flux/Midjourney.
  - 📊 **Data Analyst & CSV Visualizer**: Executive summaries, statistical analysis, and Python chart generation.
  - 🇱🇰 **Sinhala Master Translator**: Natural, idiomatically accurate Sinhala translations and cultural nuance.
  - 🔬 **Academic Researcher**: Literature synthesis, rigorous methodology reviews, and APA/IEEE citations.
  - ✍️ **Viral Copywriter & SEO Wizard**: High-converting hooks, threads, and SEO articles.
  - 🛡️ **Cybersecurity Specialist**: Code audits, OWASP Top 10 vulnerabilities, and remediation advice.
- **Activate a Skill**: Click **"⚡ Activate Skill"** on any card. When active, a glowing pill appears in the top nav and chat composer.
- **Create Custom Skill**: Click **"+ Create Custom Skill"** to define your own persona:
  - Name, Emoji avatar, Category, and Specialized System Instructions!
  - Saved automatically to your browser and available across all chats.

---

## 🇱🇰 සිංහල මාර්ගෝපදේශය (Sinhala User Guide)

### 1. නොමිලේ OpenRouter API Key එකක් ගන්නා ආකාරය
1. [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) වෙත පිවිසෙන්න.
2. ඔබගේ Google හෝ GitHub ගිණුමෙන් Sign in වන්න.
3. **"Create Key"** බොත්තම ක්ලික් කර නමක් ලබාදී Key එක Copy කරගන්න (`sk-or-v1-...`).
*(OpenRouter මඟින් `:free` ලේබලය සහිත මාදිලි සඳහා සම්පූර්ණයෙන්ම නොමිලේ සේවාව සපයයි).*

### 2. Key එක දමා Test කරන ආකාරය
1. [Fine-Ai වෙබ් අඩවියට](https://fine-lk.github.io/Fine-Ai/) පිවිසෙන්න.
2. Sidebar එකේ පහළ ඇති **Settings & API Key (⚙️)** ක්ලික් කරන්න.
3. ඔබ ලබාගත් API Key එක Paste කරන්න.
4. **"Test API Connection"** බොත්තම ක්ලික් කරන්න:
   - කොළ පැහැයෙන් ලකුණු වී Ping Latency එක (උදා: `45 ms`) පෙන්වයි නම් ඔබගේ Key එක සාර්ථකව සම්බන්ධ වී ඇත.
5. **"Save Settings"** ක්ලික් කරන්න.

### 3. Images & Files Upload කිරීම
- පහළ ඇති **Paperclip (📎)** අයිකනය ක්ලික් කර ඕනෑම Image, Document, PDF හෝ Code files ප්‍රමාණයක් සීමාවකින් තොරව (Unlimited) Upload කළ හැක.
- පින්තූර Upload කර ඒවා පිළිබඳ ප්‍රශ්න ඇසීමට `google/gemini-2.0-flash-exp:free` වැනි Multimodal මාදිලි භාවිතා කරන්න.

### 4. 4K Images සහ AI Videos Generate කිරීම
- **Images සෑදීම**:
  - Chat එකේ `/image <විස්තරය>` ටයිප් කරන්න (උදා: `/image a majestic lion wearing golden royal armor, 4k cinematic photorealistic`).
  - නැතහොත් වම්පස **Image Studio (Flux)** tab එකට ගොස් Aspect Ratio (16:9, 1:1, 9:16) සහ Styles තෝරා Generate කර Download කරගන්න.
- **AI Videos සෑදීම**:
  - Chat එකේ `/video <විස්තරය>` ටයිප් කරන්න (උදා: `/video futuristic supercar driving through neon city night rain`).
  - නැතහොත් **Video Studio (AI)** tab එකෙන් CogVideoX / Wan තාක්ෂණයෙන් AI Video clips සාදා Download කරගන්න.

### 5. 🧠 AI Skills භාවිතා කිරීම සහ අලුත් Custom Skills සෑදීම
- **Skills සක්‍රීය කිරීම**:
  - Sidebar එකේ **AI Skills Hub** ක්ලික් කරන්න.
  - කැමති Skill එකක ඇති **"⚡ Activate Skill"** ක්ලික් කරන්න (උදා: `Code Architect`, `Sinhala Master`, `Prompt Engineer`, `Data Analyst`).
  - දැන් Chat කරන විට AI මඟින් එම ක්ෂේත්‍රයේ ප්‍රවීණයෙකු (Expert Specialist) ලෙස පිළිතුරු සපයයි.
- **අලුත් Custom Skills සෑදීම**:
  - **"+ Create Custom Skill"** ක්ලික් කරන්න.
  - Skill Name, Emoji එකක්, Category එකක් සහ ඔබ කැමති විශේෂ උපදෙස් (System Prompt) ලියා Save කරන්න.
  - එය ක්ෂණිකව සක්‍රීය වී ඔබගේ Chat වලට යොදාගත හැක!

---

## ⚡ Available Free Models

OpenRouter හි ඇති සියලුම Free මාදිලි ස්වයංක්‍රීයව මෙහි ක්‍රියාත්මක වේ:

| Model ID | Provider | Context Window | Vision Support | Best For |
| :--- | :--- | :--- | :--- | :--- |
| `google/gemini-2.0-flash-exp:free` | Google | 1,048,576 tokens | 👁️ Yes (Multimodal) | All-round speed, vision & analysis |
| `google/gemini-2.0-pro-exp-02-05:free` | Google | 2,097,152 tokens | 👁️ Yes (Multimodal) | Deep reasoning & long documents |
| `deepseek/deepseek-r1:free` | DeepSeek | 65,536 tokens | No | Advanced logic, math & reasoning |
| `deepseek/deepseek-chat:free` | DeepSeek | 65,536 tokens | No | General conversation & writing |
| `meta-llama/llama-3.3-70b-instruct:free` | Meta | 131,072 tokens | No | Top-tier open-source intelligence |
| `qwen/qwen-2.5-coder-32b-instruct:free` | Alibaba Qwen | 32,768 tokens | No | Coding, debugging & script generation |
| `mistralai/mistral-small-24b-instruct-2501:free` | Mistral AI | 32,768 tokens | No | High-speed multilingual replies |
| `meta-llama/llama-3.2-3b-instruct:free` | Meta | 131,072 tokens | 👁️ Yes (Multimodal) | Lightweight fast vision queries |

---

## 🛠️ Local Setup & Development

If you want to clone and run the project locally on your machine:

```bash
# 1. Clone repository
git clone https://github.com/Fine-Lk/Fine-Ai.git
cd Fine-Ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Build production bundle:
```bash
npm run build
```

---

## 🔒 Security & Privacy

- **Client-Side Only**: This application runs 100% in your browser. There is no middleman backend server.
- **Direct Connections**: Requests are sent directly to `https://openrouter.ai` and `https://pollinations.ai` via HTTPS.
- **Local Storage**: Your API Key and conversation logs are stored solely inside your browser's `localStorage` and never logged or shared.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.

---

<div align="center">
  <b>Developed with ❤️ by <a href="https://github.com/Fine-Lk">Fine-Lk (Sadith Rashmika)</a></b>
  <br>
  <sub>Powered by OpenRouter Free Tier & Pollinations AI</sub>
</div>
