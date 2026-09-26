# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Chrome (MV3) extension that adds image tools to the right-click menu — local format conversion (PNG/WebP/AVIF), AI upscaling and background removal — plus a YouTube downloader and a Google Drive folder downloader. It talks to a self-hosted FastAPI backend for server-side AI work and to Supabase for auth and licensing.

The extension ships as **RightMate** (`manifest.json` `name`), while the repo, the README and some internal identifiers still say **AnyPNG**. Both refer to the same product.

Everything in the extension requires an activated license key. See *Licensing* below.

The repo has three largely independent parts:
- `extension/` — the actual Chrome extension (plain JS, no bundler). This is what ships.
- `backend/` — a FastAPI server deployed separately (see `backend/Dockerfile`) that does the server-side AI work, licensing and YouTube extraction.
- `src/` + `tests/` — a Vite/TypeScript WebGPU in-browser inpainting demo. Built with `npm run build` into `extension/inpaint/`, but **nothing in the shipped extension opens it**. Dev/historical only.

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

Extension: no build step for development. Load `extension/` directly via `chrome://extensions` → Developer mode → "Load unpacked". After editing `extension/scripts/background.js` or `manifest.json`, reload the extension in `chrome://extensions`.
- `npm run build:ext` (`scripts/build-extension.mjs`) — the store build. Copies `extension/` into `dist/extension/` with our own `scripts/*.js` and `styles/*.css` minified by esbuild, and drops `inpaint/`, `assets/`, zips and the orphan pages. Vendored code (`scripts/transformers/`, `vendor/`, `avif_enc.js`) is copied unchanged. Add `-- --zip` for `dist/rightmate-<version>.zip`.
- CRX (self-hosted/enterprise installs only; Chrome on Windows/macOS refuses off-store CRX): after `build:ext`, run `chrome.exe --user-data-dir=<temp profile> --pack-extension=dist\extension --pack-extension-key=keys\rightmate.pem`. `keys/rightmate.pem` fixes the extension ID (`okkblfepcnlghabcdhpiojiimpkdkjgp`). It is gitignored and must be backed up: losing it means a new ID, so existing installs can't update. The Web Store build uses the store's own ID instead.
- Classic scripts are minified with no `format`, so their top-level names survive; `license.js`'s globals depend on that. Only `<script type="module">` files (listed in `MODULE_SCRIPTS`) get `format: 'esm'` — update that set if you add one.

## Backend architecture (`backend/`)

Five files, all copied into the image by the Dockerfile:
- `main.py` — the FastAPI app: routes, auth dependencies, image work, YouTube.
- `licensing.py` — key generation, entitlement tokens, and thin wrappers over the licensing Postgres functions.
- `supabase_rest.py` — the shared PostgREST/Auth request helper and service-role headers. It exists so `main.py` and `licensing.py` can both reach Supabase without importing each other.
- `admin.html` — the admin panel page (see *Licensing*).
- `email-logo.png` — served at `GET /brand/logo.png` for the auth emails.

Auth emails are OTP codes, not links: signup and password reset verify through `POST /auth/verify` (the backend proxy, below) in `signup.js` / `forgot-password.js`. The Supabase templates live in `backend/email-templates/` and are pasted into the dashboard by hand. They must use `{{ .Token }}` and never `{{ .ConfirmationURL }}`, and their logo comes from the backend rather than Supabase Storage; both rules keep the Supabase project URL out of users' inboxes. SMTP is Hostinger (`noreply@oddbirds.dev`).

Routes:
- **Supabase proxy.** The extension never contacts Supabase and ships no Supabase URL or key; everything goes through these routes.
  - `POST /auth/{token|signup|verify|resend|recover}` (token only with `grant_type=password|refresh_token`), `GET /auth/user` and `PUT /auth/user` (only `password`/`data` are forwarded) pass Supabase's status and JSON straight through. They request `X-Supabase-Api-Version: 2024-01-01`, so errors are `{code: "email_not_confirmed", message}` — the string `code` the pages switch on.
  - `GET|PATCH /me/profile` and `GET|PUT /me/rating` read and write `profiles`/`ratings` via PostgREST **as the user** (anon key plus the user's JWT, so RLS applies), with the user id taken from the verified token, never the body.
  - **Rate limits**: Supabase limits auth per client IP, and through the proxy every user would share the server's IP. `_supabase_call` sends `Sb-Forwarded-For` with `SUPABASE_SECRET_KEY` (`sb_secret_…`), which also needs *IP Address Forwarding* enabled under Authentication → Rate Limits. The client IP comes from `--proxy-headers` in the Dockerfile, so port 8000 must only be reachable through the reverse proxy.
- `GET /ping` — health check; returns `API_FEATURES`.
- `GET /extension/version` — unauthenticated; reports `EXTENSION_LATEST_VERSION`, `EXTENSION_MIN_SUPPORTED`, `EXTENSION_DOWNLOAD_URL` and `EXTENSION_RELEASE_NOTES` for the update notifier. Deliberately public: a client whose session expired still needs to learn it is out of date.
- `POST /upscale`, `POST /remove-background` — gated by `verify_licensed_device` (Supabase user JWT **and** the `X-License` entitlement token; it also rejects builds below `EXTENSION_MIN_SUPPORTED` with 426 before doing any auth work, using the `X-Ext-Version` header the extension sends). There is no static-bearer path: `SECRET_TOKEN` used to ship inside the extension and was therefore public.
- `POST /license/status|activate|deactivate` — see *Licensing*.
- `GET /admin` plus the `/license/admin/*` endpoints — see *Licensing*.
- `POST /license/webhook/{provider}` — a stub; see *Licensing*.
- `POST /inpaint/authorize` — issues a short-lived signed permit (`_make_inpaint_permit`, HMAC via `INPAINT_PERMIT_SECRET`) after validating the Supabase session and the license, and consuming a credit. **Nothing calls this** — see *Dead code*.
- `WS /youtube/extract` — the **default YouTube path, the browser relay**:
  - The first message is `{type:"start", token, license, url, kind, height}`; the relay verifies the license entitlement before doing any work.
  - yt-dlp runs through `RelayYDL`, whose only request handler, `BrowserRelayRH` (`build_request_director` override), sends every HTTP request to the extension as `{type:"fetch"}` and blocks until `{type:"fetch_result"}` comes back (`asyncio.run_coroutine_threadsafe`).
  - The server replies with `{type:"result", streams:[…]}`: direct https stream URLs, which are locked to the user's IP.
  - YouTube never sees the server, so no bot check; about 3 small requests per video, and the server stores no media.
  - Allowed relay hosts are `YT_RELAY_ALLOWED_HOSTS`, which **must match `RELAY_HOSTS` in `extension/scripts/yt-relay.js`**.
- The server-side job endpoints below are the **fallback** path:
  - `POST /youtube/jobs` `{url, kind: mp4|webm|mp3, height}` requires `verify_licensed_device` and starts an in-memory `YoutubeJob`. yt-dlp runs in a thread, gated by a global semaphore (`YT_MAX_CONCURRENT`) and a limit of 2 active jobs per user.
  - `GET /youtube/jobs/{id}` and `DELETE /youtube/jobs/{id}` need only `verify_signed_in_user` — the caller already owns the job, and clients poll these.
  - `GET /youtube/file/{id}?t=` is authorized only by an HMAC token (the key is generated per process), so `chrome.downloads` can fetch it with no header. The job folder is deleted once the file is sent.
  - Cleanup: a startup sweeper deletes jobs older than `YT_JOB_TTL_SECONDS`, and `YT_WORK_ROOT` is wiped on boot.
  - Quality selection uses yt-dlp `format_sort` (`res:<h>`), so the closest quality at or below the request is picked.
  - The Docker image needs `ffmpeg` and `deno`: yt-dlp-ejs uses Deno to solve YouTube's JS challenges.
  - Jobs live in memory, so this requires a **single uvicorn worker**.

Auth dependencies, in increasing strictness: `verify_signed_in_user` (valid Supabase JWT) → `verify_licensed_device` (that, plus a valid `X-License` entitlement) → `verify_admin_token` (the static `SECRET_TOKEN` for server-to-server calls, or an `adm.<exp>.<sig>` session token from `POST /license/admin/login`, HMAC-signed with `SECRET_TOKEN`). Verified access tokens are cached for `AUTH_CACHE_SECONDS` (60) in `_auth_cache`.

Upscaling uses Gemini via `google-genai` (`run_gemini_image_edit`); background removal uses `rembg` (optional import — the app stays bootable without it) and falls back to Gemini. Model choice is restricted to `ALLOWED_AI_MODELS`, but the extension no longer sends a `model` field and `settings.html` has no model dropdown, so `DEFAULT_AI_MODEL` is always what runs.

Required env vars (see `backend/.env.example`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `LICENSE_SIGNING_KEY`, and `SECRET_TOKEN` (the admin token — rotate it; the pre-2.4.20 value shipped inside the extension). The Supabase keys and the secrets must never be shipped in the extension — only Supabase user JWTs travel to the client.

## Licensing (`backend/licensing.py`, `extension/scripts/license.js`)

One key per purchase, claimed by one account, active on **one device at a time**. Nothing in the extension works without it — including the purely local image conversions.

- Tables `public.licenses` and `public.license_events` have RLS on with **no policies**: only the backend's service-role key reaches them. The extension never reads them directly.
- Every state change runs in a Postgres function under a row lock, so two devices racing to activate resolve to one winner: `claim_license` (activate/takeover), `touch_license` (entitlement check + heartbeat), `release_license` (user deactivate), `mint_license` (idempotent per `provider`+`order_id`), and the `admin_*` functions. The migrations aren't all in the repo; `backend/sql/` holds the ones added since.
- **Grants gotcha**: this project's default privileges grant EXECUTE on new `public` functions to `anon` and `authenticated` *by name*, so revoking from `PUBLIC` alone is not enough. Every licensing function must be revoked from `public, anon, authenticated` and granted to `service_role`. Verify with `has_function_privilege` and re-run the Supabase security advisors after adding one.
- Moving a key to a new device takes over automatically, but only once per `LICENSE_SWITCH_COOLDOWN_HOURS` (24 by default). A user deactivating counts as that switch, so it cannot be used to bypass the cooldown; re-binding the device you just deactivated is exempt, tracked via `previous_device_id`.
- `POST /license/status|activate|deactivate` take a Supabase JWT and a client-generated `device_id`, and return a short-lived **entitlement token** signed with Ed25519 (`LICENSE_SIGNING_KEY`, a base64url raw private key; `python backend/generate_license_keypair.py` makes a pair). Protected endpoints verify that token instead of hitting the database. `LICENSE_TOKEN_SECRET` now only verifies pre-2.4.29 HMAC tokens during the switch and can be dropped one TTL after deploying. Its TTL (`LICENSE_TOKEN_TTL_SECONDS`, 24h) is both the extension's offline grace period and the worst case before a revoked or moved license locks a stale device out.
- Licensing failures return `detail: {error:"license", reason, message}` so the extension can tell "no key yet" from "this key moved to another device"; other failures return a plain string detail. `apiErrorMessage()` in background.js and `rmErrorFromResponse()` in license.js both handle either shape.
- `POST /license/webhook/{provider}` is a **stub**: it refuses unless `LICENSE_WEBHOOK_SECRET` is set, and its signature check (`_webhook_signature_ok`) and payload mapping must be completed for the chosen payment provider before going live. No provider has been selected yet; keys are created by hand in the admin panel.
- The extension verifies the token itself before unlocking the local-only tools (conversion, on-device background removal, the Drive queue). It checks the signature, `scope`, `exp` and `dev` (the first 32 hex characters of the SHA-256 of the device id) against the public key pinned as `RM_LICENSE_PUBLIC_KEY`. This stops a hand-edited `rmLicense` cache from unlocking anything. Nothing in the cache except the token is trusted, and a token the pinned key rejects reads as `invalid_token`.
  - The check runs in three places on purpose: `rmVerifyEntitlement` in license.js (behind `rmGetLicenseState` and so every page), a per-file re-check in background.js's Drive queue, and an independent `requireEntitlement` in offscreen.js. background.js passes the token and device id to the offscreen document via `offscreenLicense()`, because offscreen documents have no `chrome.storage`.
  - **`RM_LICENSE_PUBLIC_KEY` is duplicated in license.js and offscreen.js, and must match `LICENSE_SIGNING_KEY`.** Rotating the server key without shipping the new public key in both files locks every user out of the local tools.
  - WebCrypto Ed25519 needs Chrome 137, hence `minimum_chrome_version`. Editing the extension's code can still bypass the local checks; the server-backed features cannot be bypassed.
- The device id is a `crypto.randomUUID()` in `chrome.storage.local` — deliberately never `storage.sync`, which would copy it to every machine on the Chrome profile. It is spoofable by anyone editing extension storage; this is licensing friction plus an audit trail, not DRM.

### Admin panel

`GET /admin` serves `backend/admin.html`. The page is unauthenticated HTML holding no secrets; the operator signs in with `ADMIN_USERNAME`/`ADMIN_PASSWORD` via `POST /license/admin/login` (failures rate-limited per client address, in memory), and the returned session token (`ADMIN_SESSION_TTL_SECONDS`, 12h) lives in that tab's `sessionStorage`. Rotating `SECRET_TOKEN` invalidates all sessions. Every action calls a `verify_admin_token`-gated endpoint.

Two tabs:
- **Licenses** — `GET /license/admin/licenses` (search by key, buyer email, account email, order id or device label), with `GET /license/admin/events` behind each row's *History* disclosure.
- **Users** — `GET /license/admin/users`: every `auth.users` row joined to `profiles` and to whichever license the account holds. No credit balance is shown; the shipped extension has no credit system.

Actions:
- **mint** (`POST /license/admin/mint`) — bulk unclaimed keys, 1–100 at a time. Anyone can redeem them.
- **issue** (`/issue`, `admin_issue_license`) — a key already claimed by one account, so only that person can redeem it. They still type it into the extension, which is what binds the device. Returns 409 if the account already holds a non-revoked key, because a second live key would make `touch_license`'s pick arbitrary.
- **revoke** (`/revoke`) — unbinds the device and marks the key revoked.
- **reuse** (`/reuse`, `admin_reuse_license`) — only for revoked keys. *Restore* (`keep_account: true`) makes it `active` again for the same account (409 if that account already holds another live key); *Recycle* (`keep_account: false`) wipes the account, buyer email, device and switch history back to an `unused` key anyone can redeem. Logged as `restore` / `recycle` events.
- **release** (`/release`) — unbinds the device *and* clears `last_switch_at`, so a user who lost a machine can re-activate immediately instead of waiting out the cooldown. The normal support action.
- **ban** (`/ban`) — Supabase Auth, not the license tables: blocks sign-in entirely via `PUT /auth/v1/admin/users/{id}` with `ban_duration`. Reversible from the same button.

## Extension architecture (`extension/`)

Manifest V3, no bundler — scripts are plain JS loaded directly by the manifest. Key files:
- `manifest.json` — permissions, content scripts, CSP, version.
- `scripts/license.js` — loaded by the service worker via `importScripts` **and** by the pages with a plain `<script>`, so it must stay dependency-free and DOM-free. Owns the backend URL (`RIGHTMATE_API_URL`), `rmAuthApi` (every page's auth/profile/rating call to the proxy), the session refresh (`rmGetSession`, which refreshes only within 5 minutes of expiry), the per-install device id, the cached entitlement, and `rmGetLicenseState` / `rmIsLicensed` / `rmAuthHeaders` / `rmActivateLicense` / `rmDeactivateLicense`.
- `scripts/background.js` — the service worker. Owns context-menu creation (`createContextMenus`, plus `refreshLicenseMenus`, which greys the tools out when unlicensed), click handling (`chrome.contextMenus.onClicked`, gated by `ensureLicensed`), the YouTube job registry, and the Google Drive bulk-download queue. Protected calls take their headers from `requireAuthHeaders()`.
- `scripts/update.js` — the version check and toolbar badge; see *Update notifier*.
- `scripts/content.js` — runs on all pages; shows and hides the glass loading overlay (`SHOW_LOADING` / `HIDE_LOADING`).
- `scripts/offscreen.js` + `pages/offscreen.html` — an offscreen document (MV3 service workers have no DOM/canvas) handling `convertImage` (canvas + bundled libavif WASM for AVIF) and `removeBackground` (bundled transformers.js/onnxruntime-web models in `scripts/transformers/`).
- `scripts/drive-downloader.js` — injected only on `drive.google.com`; scans a Drive folder page for media files and hands them to background.js's Drive queue, which refuses when unlicensed.
- `scripts/youtube-overlay.js` — injected on `youtube.com`; a shadow-DOM floating button and panel on watch/Shorts pages, handling SPA navigation via `yt-navigate-finish` plus a 1s poll. It talks to background.js:
  - `YT_GET_QUALITIES` reads `movie_player.getAvailableQualityLevels()` in the page's MAIN world via `chrome.scripting`, greys out qualities above the video's maximum, and also reports `isSignedIn` / `isLicensed` so the panel can show *Sign in* or *Activate your license* instead of *Download*.
  - `YT_START_DOWNLOAD` defaults to the relay path. background.js sends `YT_RELAY_START` (target `offscreen-yt`) to `scripts/yt-relay.js` in the offscreen document, which: 1. answers the `/youtube/extract` relay fetches (host allowlist, `credentials:'omit'`); 2. downloads the streams in 10 MB ranged chunks into OPFS; 3. merges or converts them with the bundled ffmpeg.wasm (`vendor/ffmpeg/`, WORKERFS input); 4. reports `YT_RELAY_PROGRESS` back.
  - background.js then saves the file from the offscreen blob URL via `chrome.downloads` and asks the offscreen document to clean up once the download completes.
  - A `declarativeNetRequest` session rule rewrites `Origin`/`Referer` to youtube.com for non-tab requests (`tabIds:[-1]`). Without it, YouTube's player API returns 403 because of the `chrome-extension://` origin.
  - When the relay fails, or a merge would exceed ~1.5 GB (the ffmpeg.wasm memory limit), the overlay offers "Try server download" — `YT_START_DOWNLOAD` with `mode:'server'`, which creates a server job that background.js polls.
  - `YT_CANCEL`, `YT_LIST_JOBS`, `YT_DISMISS_JOB`, `OPEN_LOGIN` and `OPEN_LICENSE` handle cancelling, restoring jobs after a reload, dismissing finished jobs, and opening the login/license pages.
- `pages/license.html` + `scripts/license-page.js` — key entry (auto-formatted to `RM-XXXX-XXXX-XXXX-XXXX`), current binding, takeover, deactivate, cooldown message.
- `pages/popup.html` + `scripts/popup.js` — the router: signed out → `login.html`, unlicensed → `license.html`, otherwise `dashboard.html`. `login.js` and `signup.js` hand off to it after authenticating.
- `pages/dashboard.html`, `settings.html` (the options page), `login.html`, `signup.html`, `forgot-password.html` — the remaining UI. All of them load `license.js` and use `rmAuthApi` / `rmGetSession`. Settings persists `upscaleFactor`, `conversionQuality`, `driveDownloadFolder` and `driveDownloadConcurrency` in `chrome.storage.sync`, `theme` in `chrome.storage.local`, and saves star ratings through `PUT /me/rating`.
- `inpaint/` — build output of the root Vite project. Nothing in the extension opens it.

### Context menu → action flow (background.js)

`createContextMenus()` removes and rebuilds all menu items on install/startup (needed so extension updates don't collide with stale ids from a previous version). `refreshLicenseMenus()` then enables or disables them based on the cached entitlement. The single `chrome.contextMenus.onClicked` listener branches on `info.menuItemId`, after `ensureLicensed()` — which opens `pages/license.html` and stops the action when this device is not licensed:
- `upscale_png` — POSTs the image to `/upscale` with the user's JWT plus `X-License`.
- `remove_bg_png` — tries the on-device offscreen model first, falling back to the server `/remove-background` endpoint on failure.
- `download_<format>` (`imageFormatFromMenuId`) — fully local conversion via the offscreen document; never touches the backend, but is still license-gated.
- `open_license` — only visible while unlicensed; opens the activation page.

## Dead code — do not build on it

Several things describe features that no longer exist. Check for callers before extending any of them:
- `background.js`: `callWatermarkBackend()`, `authorizeLocalInpaint()`, `storeInpaintBlob()`, `resolveContextImageUrlViaContentScript()` and `DEFAULT_PROMPT` are each referenced exactly once — at their own definition. There is **no watermark feature**: no `watermark_png` menu item, no click handler, and no `/remove-watermark` route on the backend.
- `main.py`: `verify_watermark_token` guards no route. `_consume_inpaint_credit` / `_refund_inpaint_credit` / `INPAINT_CREDIT_COST` and `POST /inpaint/authorize` are the remains of a credit system the extension never calls; `profiles.credits` still exists in the database but nothing spends it. `ALLOW_LEGACY_SERVICE_TOKEN` only affects the unused watermark dependency. `API_FEATURES` still advertises `local_inpaint_credits`.
- `content.js`: the `GET_IMAGE_AT_POINT` handler has no caller; only the loading overlay is live.
- `pages/user_profile.html` and `pages/processing_status.html` are orphans — nothing navigates to them, and neither has a matching script.
- `extension/inpaint/` and the whole `src/` + `tests/` WebGPU demo are unused by the shipped extension. The tests there still pass under `npm run test`.

## Update notifier (`extension/scripts/update.js`)

Chrome only auto-updates extensions it has an `update_url` for, which a "Load unpacked" install never has, and MV3 forbids fetching and running new code. **An extension cannot update itself** — it can only notice it is behind and say so.

- `update.js` is a classic script loaded by the worker via `importScripts('license.js', 'update.js')` and by `dashboard.html` with a `<script>` tag. It reads `RIGHTMATE_API_URL` from license.js, **so license.js must load first**.
- background.js runs `rmCheckForUpdate()` on worker start, on `chrome.runtime.onStartup`, and from a `chrome.alarms` alarm (`RM_UPDATE_ALARM`) every 6 hours — hence the `alarms` permission. The result is cached in `chrome.storage.local` under `rmUpdate`.
- The result drives a toolbar badge (blue `!` for available, red for required) and a banner on the dashboard.
- `requireAuthHeaders()` adds `X-Ext-Version`, so the server can fail closed on ancient builds; `apiErrorMessage()` surfaces the resulting 426 and forces a re-check.
- Failure modes are all biased toward silence: a failed fetch keeps the last known state, an empty `latest` never reads as "behind", and a cache written by a previous build is discarded rather than trusted.
- Set `EXTENSION_LATEST_VERSION` on the backend for every release, or the notifier stays quiet. `EXTENSION_MIN_SUPPORTED` is the hard floor and is off by default — setting it above a version people actually run locks them out of every server-backed feature.

## Extension versioning

For every change to extension functionality or extension-distributed assets, increment the patch version in `extension/manifest.json` before delivery. Backend-only changes (including `admin.html`) do not need a bump.

## Local WebGPU inpainting demo (`src/`)

TypeScript modules used by `src/main.ts`: `image-utils.ts` (ImageData/canvas/blob conversions and compositing), `mask-utils.ts` (mask thresholding, bounds, heuristic watermark-region detection), `crop-utils.ts` (padded-crop geometry for feeding a fixed-size model), `ocr-detector.ts` (Tesseract.js-based repeated-text detection), `webgpu-provider.ts` (loads the bundled LaMa ONNX model via onnxruntime-web/transformers.js and runs inference on WebGPU). Tests in `tests/` exercise the pure geometry/compositing functions in `image-utils.ts`, `mask-utils.ts` and `crop-utils.ts` directly (no DOM; a minimal `ImageData` polyfill is defined at the top of the test file since vitest runs in a `node` environment).
