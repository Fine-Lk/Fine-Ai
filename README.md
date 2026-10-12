# 🌟 Nexus AI - OpenRouter Free Hub & Creative Studio

ChatGPT-style modern web application designed for OpenRouter Free Tier models, featuring unlimited file & image uploads, 4K image generation (Flux.1), and cinematic AI video generation (CogVideoX / Wan).

Built with **HTML5, Vanilla CSS, and JavaScript**. Zero server required — completely ready for **GitHub Pages** hosting!

---

## 🚀 GitHub Haraha Host Karana Hati (How to Publish & Host on GitHub Pages)

Meya GitHub Pages ekata publish karanna hariyatama steps 3i thiyenne:

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Repository name ekak danna (e.g. `nexus-ai` or `my-chatgpt`).
3. **Public** thiyanna (GitHub Pages free wenne Public repos walata).
4. **"Add a README file" check karanna EPA** (already initialized).
5. Click **"Create repository"**.

### Step 2: Push Your Code from Folder `N`
Open PowerShell or Terminal inside folder `d:\PROJECTS\N` and run:

```bash
# 1. Add your GitHub repository link (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 2. Push to main branch
git push -u origin main
```

*(Note: git credentials login illuwoth GitHub username & Personal Access Token danna).*

---

### Step 3: Enable GitHub Pages (Host Online 🌐)
Repository eka push unata passe:
1. GitHub repository page ekata yanna -> **Settings** tab eka click karanna.
2. Left sidebar eken **Pages** click karanna.
3. **Build and deployment** section eke:
   - **Source**: `Deploy from a branch` select karanna.
   - **Branch**: `main` select karala, folder eka `/ (root)` thiyanna.
   - Click **Save**.
   *(Alternatively: Oyalata automated build ona nam Source eken `GitHub Actions` select kalath hari — workflow eka already hadala thiyenne).*
4. 1-2 minutes walin page eka refresh karama GitHub eken oyage live URL eka labei:
   👉 **`https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`**

---

## ✨ Features & Capabilities

- 🤖 **ChatGPT-Style Ultra Interface**:
  - Dark mode glassmorphism UI with responsive sidebar & chat sessions history.
  - Streaming responses with real-time typing animation.
  - Markdown formatting with syntax-highlighted code blocks & 1-click **Copy Code** buttons.
- 🔑 **Manual OpenRouter API Key Entry & Connection Test**:
  - Open **Settings & API Key** modal to manually enter your key.
  - **Test API Connection** button with live ping latency (ms), validity verification, and free tier status indicator.
  - Keys are saved locally in browser `localStorage` (100% private, never sent to third-party servers).
- ⚡ **All OpenRouter Free Models Included**:
  - Dynamic model loader fetches all active `:free` models directly from OpenRouter API.
  - Includes:
    - `google/gemini-2.0-flash-exp:free` (Multimodal vision ready)
    - `google/gemini-2.0-pro-exp-02-05:free`
    - `deepseek/deepseek-r1:free` (Advanced reasoning)
    - `deepseek/deepseek-chat:free`
    - `meta-llama/llama-3.3-70b-instruct:free`
    - `qwen/qwen-2.5-coder-32b-instruct:free` (Coding specialist)
    - `mistralai/mistral-small-24b-instruct-2501:free`
    - And more!
- 📎 **Unlimited File & Image Uploads**:
  - Drag and drop or attach unlimited images, documents, PDFs, code files.
  - Multimodal vision models automatically analyze uploaded images.
- 🎨 **4K AI Image Generation Studio**:
  - Generate ultra-high-resolution images with Flux.1 & SDXL.
  - 100% Free & Unlimited via Pollinations AI.
  - Aspect ratios: `1:1`, `16:9`, `9:16`, `4:3`, `3:2`.
  - Type `/image <prompt>` directly in chat or use the Image Studio tab.
- 🎬 **AI Video Generation Studio**:
  - Generate cinematic AI videos from text descriptions using CogVideoX & Wan AI.
  - Play inline, loop, or download with 1-click.
  - Type `/video <prompt>` directly in chat or use the Video Studio tab.

---

## 🛠️ Local Development (Optional)

To run or develop locally with Vite:
```bash
npm.cmd install
npm.cmd run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

Production build:
```bash
npm.cmd run build
```
