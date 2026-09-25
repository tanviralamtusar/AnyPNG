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
- `POST /upscale`, `POST /remove-background` — gated by `verify_licensed_device` (Supabase user JWT + the `X-License` entitlement token). The old static-bearer path is gone: `SECRET_TOKEN` shipped inside the extension and was therefore public.
- `POST /remove-watermark` — gated by `verify_watermark_token`, which takes a Supabase user JWT plus the `X-License` entitlement, calls `_verify_supabase_user` (validates against Supabase Auth), then `_consume_inpaint_credit` (atomic compare-and-swap decrement against `profiles.credits` via the Supabase REST API using the service-role key, with retry on concurrent-write conflicts). The legacy static-token path only works when `ALLOW_LEGACY_SERVICE_TOKEN=1`. **Note: the route itself does not currently exist in `main.py`** — only its dependency does, so the extension's `callWatermarkBackend` would 404 against this backend.
- `POST /inpaint/authorize` — issues a short-lived signed permit (`_make_inpaint_permit`, HMAC via `INPAINT_PERMIT_SECRET`) after validating the Supabase session and consuming a credit, so the local WebGPU editor can prove it's allowed to run without ever uploading the image.
- `WS /youtube/extract` is the **default YouTube path, the browser relay**:
  - The first message is `{type:"start", token, license, url, kind, height}`; the relay verifies the license entitlement before doing any work.
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

Required env vars (see `backend/.env.example`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INPAINT_PERMIT_SECRET`, `LICENSE_TOKEN_SECRET`. The service-role key and both secrets must never be shipped in the extension — only the anon key and Supabase user JWTs travel to the client.

`backend/supabase_rest.py` holds the shared PostgREST/service-role helper and `backend/licensing.py` the licensing logic; `backend/Dockerfile` copies all three Python files.

## Licensing (`backend/licensing.py`, `extension/scripts/license.js`)

One key per purchase, claimed by one account, active on **one device at a time**. Nothing in the extension works without it — including the purely local image conversions.

- Tables `public.licenses` and `public.license_events` have RLS on with **no policies**: only the backend's service-role key reaches them.
- Every state change runs in a Postgres function under a row lock, so two devices racing to activate resolve to one winner: `claim_license` (activate/takeover), `touch_license` (entitlement check + heartbeat), `release_license` (deactivate), `mint_license` (idempotent per `provider`+`order_id`). EXECUTE is revoked from `PUBLIC`; only `service_role` may call them.
- Moving a key to a new device takes over automatically, but only once per `LICENSE_SWITCH_COOLDOWN_HOURS` (24 by default). Deactivating counts as that switch so it cannot be used to bypass the cooldown; re-binding the device you just deactivated is exempt, tracked via `previous_device_id`.
- `POST /license/status|activate|deactivate` take a Supabase JWT and a client-generated `device_id`, and return a short-lived HMAC **entitlement token** (`LICENSE_TOKEN_SECRET`) that protected endpoints verify instead of hitting the database. Its TTL is both the offline grace period and the worst case before a revoked or moved license locks a stale device out.
- `POST /license/webhook/{provider}` is a **stub**: it refuses unless `LICENSE_WEBHOOK_SECRET` is set, and its signature check and payload mapping must be completed for the chosen payment provider before going live.
- Admin panel at `GET /admin` (`backend/admin.html`, copied in by the Dockerfile). The page itself is unauthenticated HTML holding no secrets; the operator pastes `SECRET_TOKEN` into it and it lives in that tab's `sessionStorage`. Every action calls a `verify_admin_token`-gated endpoint: `GET /license/admin/licenses` (search by key, email, order or device), `GET /license/admin/users` (accounts joined to profiles and licenses), `GET /license/admin/events` (audit trail), `POST /license/admin/mint`, `/issue`, `/revoke`, `/release`, `/ban`.
  - **revoke** kills a key permanently; there is deliberately no un-revoke in the panel, so a misclick cannot be undone by another misclick (`update licenses set status='active' where key='…'` if you ever need to).
  - **release** unbinds the device *and* clears `last_switch_at`, so a user who lost a machine can re-activate immediately instead of waiting out the cooldown. This is the normal support action.
  - The **Users** tab lists every `auth.users` row with whichever license it holds, and can ban/unban. It shows no credit balance: the shipped extension has no credit system.
  - **issue** (`admin_issue_license`) mints a key already claimed by that account, so only they can redeem it; they still enter it in the extension, which is what binds the device. It refuses with 409 if the account already holds a non-revoked key, since a second live key would make `touch_license`’s choice arbitrary.
  - **ban** is Supabase Auth, not the license tables: it blocks sign-in entirely via `PUT /auth/v1/admin/users/{id}` with `ban_duration`. It is reversible from the same button.
- The device id is a `crypto.randomUUID()` in `chrome.storage.local` — deliberately never `storage.sync`, which would copy it to every machine on the Chrome profile. It is spoofable by anyone editing extension storage; this is licensing friction plus an audit trail, not DRM.

## Extension architecture (`extension/`)

Manifest V3, no bundler — scripts are plain JS loaded directly by the manifest. Key files:
- `manifest.json` — permissions, context menus registration point, content scripts, CSP.
- `scripts/license.js` — shared by the service worker (`importScripts`) and the pages (`<script>`). Owns the backend URL (`RIGHTMATE_API_URL`), the Supabase constants, the session refresh (`rmGetSession`), the per-install device id, the entitlement cache, and `rmGetLicenseState` / `rmActivateLicense` / `rmDeactivateLicense` / `rmAuthHeaders`.
- `scripts/background.js` — the service worker; owns all context-menu creation (`createContextMenus`, plus `refreshLicenseMenus`, which greys the tools out when unlicensed) and click handling (`chrome.contextMenus.onClicked`, gated by `ensureLicensed`), the watermark billing flow (`callWatermarkBackend`), and the Google Drive bulk-download queue. Protected calls take their headers from `requireAuthHeaders()`. `SUPABASE_URL`/`SUPABASE_ANON_KEY` are still duplicated as top-level consts in `dashboard.js`, `forgot-password.js`, `login.js`, `signup.js`, `settings.js` — if you rotate the anon key or Supabase project, update `license.js` and every one of those files.
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
- `pages/license.html` + `scripts/license-page.js` — key entry, the current binding, takeover and deactivate.
- `pages/` + matching `scripts/*.js` — the extension's UI surfaces (popup, options/settings, login/signup/forgot-password, dashboard, user profile, processing status). `popup.html` is the router: signed out goes to `login.html`, unlicensed to `license.html`, otherwise `dashboard.html`; `login.js` and `signup.js` hand off to it. The remaining auth pages still manage their own Supabase session refresh.
- `inpaint/` — build output of the root Vite project (the WebGPU local inpainting editor). Present for historical/dev reasons; the shipped watermark-removal context-menu action calls the backend `/remove-watermark` endpoint directly and does not open this editor.

### Context menu → action flow (background.js)

`createContextMenus()` removes and rebuilds all menu items on install/startup (needed so extension updates don't collide with stale ids from a previous version). The single `chrome.contextMenus.onClicked` listener branches on `info.menuItemId`:
Every branch is preceded by `ensureLicensed()`, which opens `pages/license.html` and stops the action when this device is not licensed.
- `watermark_png` — fetches the image, requires a signed-in Supabase session, then POSTs to `/remove-watermark` with the user's access token and entitlement (server deducts a credit).
- `upscale_png` / `remove_bg_png` — background removal tries the on-device offscreen model first and falls back to the server `/remove-background` endpoint on failure; upscaling always calls the server `/upscale` endpoint. Both send the user's JWT plus `X-License`.
- `download_<format>` (`imageFormatFromMenuId`) — fully local conversion via the offscreen document; never touches the backend, but is still license-gated.
- `open_license` — only visible while unlicensed; opens the activation page.

## Extension versioning

For every change to extension functionality or extension-distributed assets, increment the patch version in `extension/manifest.json` before delivery.

## Local WebGPU inpainting demo (`src/`)

TypeScript modules used by `src/main.ts`: `image-utils.ts` (ImageData/canvas/blob conversions and compositing), `mask-utils.ts` (mask thresholding, bounds, heuristic watermark-region detection), `crop-utils.ts` (padded-crop geometry for feeding a fixed-size model), `ocr-detector.ts` (Tesseract.js-based repeated-text detection to auto-locate watermarks), `webgpu-provider.ts` (loads the bundled LaMa ONNX model via onnxruntime-web/transformers.js and runs inference on WebGPU). Tests in `tests/` exercise the pure geometry/compositing functions in `image-utils.ts`, `mask-utils.ts`, and `crop-utils.ts` directly (no DOM; a minimal `ImageData` polyfill is defined at the top of the test file since vitest runs in a `node` environment).
