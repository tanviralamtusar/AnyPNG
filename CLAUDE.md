# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

AnyPNG is a Chrome (MV3) extension that adds AI image tools to the right-click menu: format conversion (PNG/WebP/AVIF), AI upscaling, background removal, and watermark removal. It talks to a self-hosted FastAPI backend for server-side AI work and to Supabase for auth/credits. It also contains a standalone Vite/WebGPU local-inpainting web app used for development experiments (its build output is copied into the extension but is **not** used by the extension's context-menu workflow — see README's "One-click watermark removal" section).

The repo has three largely independent parts:
- `extension/` — the actual Chrome extension (plain JS, no bundler). This is what ships.
- `src/` + `tests/` — a Vite/TypeScript WebGPU in-browser inpainting demo, built with `npm run build`/`vitest`. Output is emitted into `extension/inpaint/` but the shipped context-menu flow calls the backend instead.
- `backend/` — a FastAPI server (`backend/main.py`) deployed separately (see `backend/Dockerfile`) that does the actual AI image work.

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
- `WS /youtube/extract` is the **default YouTube path, the browser relay**:
  - The first message is `{type:"start", token, url, kind, height}`.
  - yt-dlp runs through `RelayYDL`, whose only request handler, `BrowserRelayRH` (`build_request_director` override), sends every HTTP request to the extension as `{type:"fetch"}` and blocks until `{type:"fetch_result"}` comes back (`asyncio.run_coroutine_threadsafe`).
  - The server replies with `{type:"result", streams:[…]}`: direct https stream URLs, which are locked to the user's IP.
  - YouTube never sees the server, so no bot check; about 3 small requests per video, and the server stores no media.
  - Allowed relay hosts are `YT_RELAY_ALLOWED_HOSTS`, which **must match `RELAY_HOSTS` in `extension/scripts/yt-relay.js`**.
- The server-side job endpoints below are the **fallback** path. They are free but require a Supabase session via `verify_signed_in_user`, which caches results for 60s because clients poll:
  - `POST /youtube/jobs` `{url, kind: mp4|webm|mp3, height}` starts an in-memory `YoutubeJob`. yt-dlp runs in a thread, gated by a global semaphore (`YT_MAX_CONCURRENT`) and a limit of 2 active jobs per user.
  - `GET /youtube/jobs/{id}` returns status and progress, and a signed `download_url` once the job is ready.
  - `GET /youtube/file/{id}?t=` is authorized only by that HMAC token (the key is generated per process), so `chrome.downloads` can fetch it with no header. The job folder is deleted once the file is sent.
  - `DELETE /youtube/jobs/{id}` cancels a job.
  - Cleanup: a startup sweeper deletes jobs older than `YT_JOB_TTL_SECONDS`, and `YT_WORK_ROOT` is wiped on boot.
  - Quality selection uses yt-dlp `format_sort` (`res:<h>`), so the closest quality at or below the request is picked.
  - The Docker image needs `ffmpeg` and `deno`: yt-dlp-ejs uses Deno to solve YouTube's JS challenges.
  - Jobs live in memory, so this requires a **single uvicorn worker**.

Watermark removal on the server uses Gemini via `google-genai` (`run_gemini_image_edit`); background removal uses `rembg` (optional import — the app stays bootable without it). Image editing model choice is restricted to `ALLOWED_AI_MODELS`, which **must be kept in sync with the dropdown in `extension/pages/settings.html`**.

Required env vars (see `backend/.env.example`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INPAINT_PERMIT_SECRET`. The service-role key and permit secret must never be shipped in the extension — only the anon key and Supabase user JWTs travel to the client.

## Extension architecture (`extension/`)

Manifest V3, no bundler — scripts are plain JS loaded directly by the manifest. Key files:
- `manifest.json` — permissions, context menus registration point, content scripts, CSP.
- `scripts/background.js` — the service worker; owns all context-menu creation (`createContextMenus`) and click handling (`chrome.contextMenus.onClicked`), the Supabase session lifecycle (`getValidSession`, token refresh), the watermark billing flow (`callWatermarkBackend`), and the Google Drive bulk-download queue. `API_CONFIG` here holds the deployed backend URL and the static `basicToken`; `SUPABASE_URL`/`SUPABASE_ANON_KEY` are duplicated as top-level consts across `background.js`, `dashboard.js`, `forgot-password.js`, `login.js`, `popup.js`, `signup.js`, `settings.js` — if you rotate the anon key or Supabase project, update it in every one of those files.
- `scripts/content.js` — runs on all pages; resolves the actual image URL under the cursor for the context-menu handler (`resolveContextImageUrlViaContentScript` in background.js messages this).
- `scripts/offscreen.js` + `pages/offscreen.html` — an offscreen document (required because MV3 service workers have no DOM/canvas) that does local, on-device work: image format conversion (canvas + bundled libavif WASM for AVIF) and on-device background removal (via bundled transformers.js/onnxruntime-web models in `scripts/transformers/`).
- `scripts/drive-downloader.js` — injected only on `drive.google.com`; scans a Drive folder page for media files and hands them to `background.js`'s Drive download queue.
- `scripts/youtube-overlay.js` — injected on `youtube.com`; draws a shadow-DOM floating button and panel on watch/Shorts pages, handling YouTube's SPA navigation via `yt-navigate-finish` plus a 1s poll. It talks to `background.js`:
  - `YT_GET_QUALITIES` reads `movie_player.getAvailableQualityLevels()` in the page's MAIN world via `chrome.scripting`, and greys out qualities above the video's maximum.
  - `YT_START_DOWNLOAD` defaults to the relay path. background.js sends `YT_RELAY_START` (target `offscreen-yt`) to `scripts/yt-relay.js` in the offscreen document, which:
    1. answers the `/youtube/extract` relay fetches (host allowlist, `credentials:'omit'`);
    2. downloads the streams in 10 MB ranged chunks into OPFS;
    3. merges or converts them with the bundled ffmpeg.wasm (`vendor/ffmpeg/`, WORKERFS input);
    4. reports `YT_RELAY_PROGRESS` back to background.js.
  - background.js then saves the file from the offscreen blob URL via `chrome.downloads` and asks the offscreen document to clean up once the download completes.
  - A `declarativeNetRequest` session rule rewrites `Origin`/`Referer` to youtube.com for non-tab requests (`tabIds:[-1]`). Without it, YouTube's player API returns 403 because of the `chrome-extension://` origin.
  - When the relay fails, or a merge would exceed ~1.5 GB (the ffmpeg.wasm memory limit), the overlay offers "Try server download", which sends `YT_START_DOWNLOAD` with `mode:'server'`. That creates a server job; background.js polls it and gives the signed URL to `chrome.downloads`.
  - `YT_CANCEL`, `YT_LIST_JOBS`, `YT_DISMISS_JOB` and `OPEN_LOGIN` handle cancelling, restoring jobs after a reload, dismissing finished jobs and opening the login page.
- `pages/` + matching `scripts/*.js` — the extension's UI surfaces (popup, options/settings, login/signup/forgot-password, dashboard, user profile, processing status). Each auth-related page independently manages its own Supabase session refresh.
- `inpaint/` — build output of the root Vite project (the WebGPU local inpainting editor). Present for historical/dev reasons; the shipped watermark-removal context-menu action calls the backend `/remove-watermark` endpoint directly and does not open this editor.

### Context menu → action flow (background.js)

`createContextMenus()` removes and rebuilds all menu items on install/startup (needed so extension updates don't collide with stale ids from a previous version). The single `chrome.contextMenus.onClicked` listener branches on `info.menuItemId`:
- `watermark_png` — fetches the image, requires a signed-in Supabase session, then POSTs to `/remove-watermark` with the user's access token (server deducts a credit).
- `upscale_png` / `remove_bg_png` — background removal tries the on-device offscreen model first and falls back to the server `/remove-background` endpoint on failure; upscaling always calls the server `/upscale` endpoint. Both use the static `basicToken`, not user auth.
- `download_<format>` (`imageFormatFromMenuId`) — fully local conversion via the offscreen document; never touches the backend.

## Extension versioning

For every change to extension functionality or extension-distributed assets, increment the patch version in `extension/manifest.json` before delivery.

## Local WebGPU inpainting demo (`src/`)

TypeScript modules used by `src/main.ts`: `image-utils.ts` (ImageData/canvas/blob conversions and compositing), `mask-utils.ts` (mask thresholding, bounds, heuristic watermark-region detection), `crop-utils.ts` (padded-crop geometry for feeding a fixed-size model), `ocr-detector.ts` (Tesseract.js-based repeated-text detection to auto-locate watermarks), `webgpu-provider.ts` (loads the bundled LaMa ONNX model via onnxruntime-web/transformers.js and runs inference on WebGPU). Tests in `tests/` exercise the pure geometry/compositing functions in `image-utils.ts`, `mask-utils.ts`, and `crop-utils.ts` directly (no DOM; a minimal `ImageData` polyfill is defined at the top of the test file since vitest runs in a `node` environment).
