# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

AnyPNG is a Chrome (MV3) extension that adds AI image/video tools to the right-click menu: format conversion (PNG/WebP/AVIF), AI upscaling, background removal, watermark removal, and video downloading. It talks to a self-hosted FastAPI backend for server-side AI work and to Supabase for auth/credits. It also contains a standalone Vite/WebGPU local-inpainting web app used for development experiments (its build output is copied into the extension but is **not** used by the extension's context-menu workflow — see README's "One-click watermark removal" section).

The repo has three largely independent parts:
- `extension/` — the actual Chrome extension (plain JS, no bundler). This is what ships.
- `src/` + `tests/` — a Vite/TypeScript WebGPU in-browser inpainting demo, built with `npm run build`/`vitest`. Output is emitted into `extension/inpaint/` but the shipped context-menu flow calls the backend instead.
- `backend/` — a FastAPI server (`backend/main.py`) deployed separately (see `backend/Dockerfile`) that does the actual AI/video work.

## Commands

Root (TypeScript/Vite project under `src/`):
- `npm run dev` — Vite dev server for the local WebGPU inpainting demo (`index.html` / `src/main.ts`).
- `npm run build` — `tsc -b && vite build`; builds into `extension/inpaint/` (outDir set in `vite.config.ts`).
- `npm run test` — runs `vitest run` (config: `vitest.config.ts`, node environment).
- Run a single test file: `npx vitest run tests/image-utils.test.ts`.
- There is no lint script configured.

Backend (`backend/`, Python/FastAPI):
- Install: `pip install -r backend/requirements.txt`
- Run locally: `uvicorn main:app --host 0.0.0.0 --port 8000` (from `backend/`)
- Docker: `docker build -t anypng-backend backend/` then run with the env vars below.
- No test suite exists for the backend.

Extension: no build step. Load `extension/` directly via `chrome://extensions` → Developer mode → "Load unpacked". After editing `extension/scripts/background.js` or `manifest.json`, reload the extension in `chrome://extensions`.

## Backend architecture (`backend/main.py`)

Single-file FastAPI app exposing:
- `GET /ping` — health check.
- `POST /upscale`, `POST /remove-background` — gated by the static bearer `SECRET_TOKEN` (`verify_token`).
- `POST /remove-watermark` — gated by `verify_watermark_token`, which accepts either the legacy static token OR a Supabase user JWT. When a Supabase JWT is used, it calls `_verify_supabase_user` (validates against Supabase Auth) then `_consume_inpaint_credit` (atomic compare-and-swap decrement against `profiles.credits` via the Supabase REST API using the service-role key, with retry on concurrent-write conflicts).
- `POST /inpaint/authorize` — issues a short-lived signed permit (`_make_inpaint_permit`, HMAC via `INPAINT_PERMIT_SECRET`) after validating the Supabase session and consuming a credit, so the local WebGPU editor can prove it's allowed to run without ever uploading the image.
- `POST /download-video` — proxies to `yt_dlp` with platform allowlisting (`_is_allowed_video_url`), format fallback probing, and cookie-file support for authenticated platforms.

Watermark removal on the server uses Gemini via `google-genai` (`run_gemini_image_edit`); background removal uses `rembg` (optional import — the app stays bootable without it). Image editing model choice is restricted to `ALLOWED_AI_MODELS`, which **must be kept in sync with the dropdown in `extension/pages/settings.html`**.

Required env vars (see `backend/.env.example`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INPAINT_PERMIT_SECRET`. The service-role key and permit secret must never be shipped in the extension — only the anon key and Supabase user JWTs travel to the client.

## Extension architecture (`extension/`)

Manifest V3, no bundler — scripts are plain JS loaded directly by the manifest. Key files:
- `manifest.json` — permissions, context menus registration point, content scripts, CSP.
- `scripts/background.js` — the service worker; owns all context-menu creation (`createContextMenus`) and click handling (`chrome.contextMenus.onClicked`), the Supabase session lifecycle (`getValidSession`, token refresh), the watermark billing flow (`callWatermarkBackend`), and video-download orchestration. `API_CONFIG` here holds the deployed backend URL and the static `basicToken`; `SUPABASE_URL`/`SUPABASE_ANON_KEY` are duplicated as top-level consts across `background.js`, `dashboard.js`, `forgot-password.js`, `login.js`, `popup.js`, `signup.js`, `settings.js` — if you rotate the anon key or Supabase project, update it in every one of those files.
- `scripts/content.js` — runs on all pages; resolves the actual image URL under the cursor for the context-menu handler (`resolveContextImageUrlViaContentScript` in background.js messages this).
- `scripts/offscreen.js` + `pages/offscreen.html` — an offscreen document (required because MV3 service workers have no DOM/canvas) that does local, on-device work: image format conversion (canvas + bundled libavif WASM for AVIF), on-device background removal (via bundled transformers.js/onnxruntime-web models in `scripts/transformers/`), and video/audio remuxing (`mp4box.min.js`/`mp4-muxer.js`) for platforms where video and audio streams are captured separately.
- `scripts/youtube-fab.js` — a floating action button injected only on YouTube for video downloads.
- `pages/` + matching `scripts/*.js` — the extension's UI surfaces (popup, options/settings, login/signup/forgot-password, dashboard, user profile, processing status). Each auth-related page independently manages its own Supabase session refresh.
- `inpaint/` — build output of the root Vite project (the WebGPU local inpainting editor). Present for historical/dev reasons; the shipped watermark-removal context-menu action calls the backend `/remove-watermark` endpoint directly and does not open this editor.

### Context menu → action flow (background.js)

`createContextMenus()` removes and rebuilds all menu items on install/startup (needed so extension updates don't collide with stale ids from a previous version). The single `chrome.contextMenus.onClicked` listener branches on `info.menuItemId`:
- `watermark_png` — fetches the image, requires a signed-in Supabase session, then POSTs to `/remove-watermark` with the user's access token (server deducts a credit).
- `upscale_png` / `remove_bg_png` — background removal tries the on-device offscreen model first and falls back to the server `/remove-background` endpoint on failure; upscaling always calls the server `/upscale` endpoint. Both use the static `basicToken`, not user auth.
- `download_<format>` (`imageFormatFromMenuId`) — fully local conversion via the offscreen document; never touches the backend.
- `download_video` / `video_quality_*` — video download cascade: direct URL download, or for platforms with dedicated handling (`detectVideoPlatform`), capture + remux locally, falling back to the backend's yt-dlp endpoint (`downloadViaBackend`) when needed.

## Extension versioning

For every change to extension functionality or extension-distributed assets, increment the patch version in `extension/manifest.json` before delivery.

## Local WebGPU inpainting demo (`src/`)

TypeScript modules used by `src/main.ts`: `image-utils.ts` (ImageData/canvas/blob conversions and compositing), `mask-utils.ts` (mask thresholding, bounds, heuristic watermark-region detection), `crop-utils.ts` (padded-crop geometry for feeding a fixed-size model), `ocr-detector.ts` (Tesseract.js-based repeated-text detection to auto-locate watermarks), `webgpu-provider.ts` (loads the bundled LaMa ONNX model via onnxruntime-web/transformers.js and runs inference on WebGPU). Tests in `tests/` exercise the pure geometry/compositing functions in `image-utils.ts`, `mask-utils.ts`, and `crop-utils.ts` directly (no DOM; a minimal `ImageData` polyfill is defined at the top of the test file since vitest runs in a `node` environment).
