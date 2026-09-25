# RightMate 🚀

<p align="center">
  <a href="https://github.com/tanviralamtusar/AnyPNG">
    <img src="extension/icons/Anypng.png" alt="RightMate Project Logo - Professional AI Image Toolset" width="128" height="128" loading="lazy">
  </a>
</p>

**RightMate** (this repo is still named *AnyPNG*) is a Chrome extension that puts a professional image toolset in your browser's right-click menu, plus a YouTube downloader and a Google Drive folder downloader. Server-side AI work runs on your own self-hosted FastAPI backend.

## ✨ Features

- **AI Upscaling** — **2x Dynamic** (balanced) or **4x Ultra** (HD quality), configurable in Settings.
- **Background Removal** — runs **on your device** first using a bundled ONNX model, falling back to the server only when the local model can't run.
- **Local Format Conversion** — convert any web image to **PNG**, **WebP** or **AVIF** without uploading anything. PNG and WebP use the browser's canvas encoder; AVIF uses a bundled libavif (WASM) build, since Chrome's canvas cannot encode AVIF. Transparency is preserved in all three, and lossy quality is configurable in Settings.
- **YouTube Downloads** — a floating button on watch and Shorts pages offers **MP4** or **WebM** up to 4K, or **MP3** audio. By default the download happens **entirely in your browser**: the server only helps resolve the stream URLs, then your browser fetches and muxes the video with a bundled ffmpeg.wasm. YouTube never sees the server, and no media is ever stored on it. A server-side fallback is offered if that fails or a merge would exceed ffmpeg.wasm's ~1.5 GB memory limit.
- **Google Drive Folder Downloads** — on a Drive folder page, scan for images, videos and other files and download each one separately to `Downloads/Drive media`, with progress and stop controls.
- **Loading Overlay** — a glass-morphism overlay keeps you informed during AI processing.
- **Modern UI** — a glassmorphism settings page, account dashboard, and light/dark themes.
- **Self-Hosted** — all AI requests go to your own VPS, so data stays private and costs stay predictable.

## 🔑 Licensing

RightMate is license-key activated. Every feature — including the purely local format conversions — requires an active key.

- Sign in with your account, then enter your key on the license page.
- **One key works on one device at a time.** Activating it on a second device releases the first.
- A key can only be moved between devices **once every 24 hours**, so it can't be quietly shared.
- The extension keeps working offline for up to 24 hours between license checks.
- Lost a machine? Ask support to unbind it — that clears the device *and* the cooldown, so you can activate again right away.

## 🛠️ Installation

1. **Download the latest release** from the [Releases](https://github.com/tanviralamtusar/AnyPNG/releases) page and extract the zip.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right), click **Load unpacked**, and select the extracted `extension` folder.
4. Click the RightMate icon, **sign in**, and enter your license key.
5. Right-click the icon → **Options** to set your upscale engine, conversion quality and Drive download preferences.

## 🖥️ Self-hosting the backend

The extension needs the FastAPI backend in `backend/`.

```bash
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
# or:
docker build -t anypng-backend backend/
```

Copy `backend/.env.example` to `backend/.env` and fill it in. The required values are `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LICENSE_TOKEN_SECRET` and `SECRET_TOKEN`. Generate the secrets with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Never put the service-role key or any secret in the extension — only the Supabase anon key and per-user JWTs belong on the client.

Two deployment notes: YouTube downloads need `ffmpeg` and `deno` in the image (the Dockerfile installs both), and jobs are held in memory, so run a **single uvicorn worker**.

### Admin panel

Your deployment serves a licensing admin panel at `/admin`. It asks for `SECRET_TOKEN` and keeps it in that browser tab only. From there you can:

- create keys in bulk, or **issue** a key directly to one account;
- search licenses and accounts by key, email, order or device;
- **unbind** a device (the usual support fix — it also clears the 24h cooldown);
- **revoke** a key permanently, or **ban** an account from signing in;
- read the full audit history of any key.

Payment-provider webhooks are not wired up yet: `POST /license/webhook/{provider}` is a stub that stays disabled until `LICENSE_WEBHOOK_SECRET` is set and the provider's signature check is implemented. Until then, create keys from the admin panel.

---

*Built with ❤️ for professional image workflows.*
