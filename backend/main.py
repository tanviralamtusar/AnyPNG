import os
import pathlib
import re
import asyncio
import base64
import hashlib
import hmac
import io
import json
import secrets
import shutil
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass, field
from io import BytesIO
from typing import Literal
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Depends, Header, HTTPException, Form, Request, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response, FileResponse, HTMLResponse
from pydantic import BaseModel
from starlette.background import BackgroundTask
from PIL import Image

import licensing
from supabase_rest import json_request as _supabase_json_request

try:
    from rembg import new_session, remove as rembg_remove
except ImportError:  # Keep the API bootable until image dependencies are installed.
    new_session = None
    rembg_remove = None

try:
    import yt_dlp
    from yt_dlp.utils import DownloadCancelled
    from yt_dlp.networking.common import RequestHandler, Response as YdlResponse
    from yt_dlp.networking.exceptions import HTTPError as YdlHTTPError, TransportError as YdlTransportError
except ImportError:  # Keep the API bootable without yt-dlp; YouTube endpoints return 503.
    yt_dlp = None
    RequestHandler = object

    class DownloadCancelled(Exception):
        pass

# Load environment variables
load_dotenv()

app = FastAPI(title="Pro Image Tools API")
security = HTTPBearer()

# 🛑 CONFIGURATION
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "my_super_secret_hostinger_token_123!")
# Admin panel sign-in. Both must be set, or POST /license/admin/login refuses.
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
ADMIN_SESSION_TTL_SECONDS = int(os.getenv("ADMIN_SESSION_TTL_SECONDS", str(12 * 3600)))
VERTEX_API_KEY = os.getenv("VERTEX_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
INPAINT_PERMIT_SECRET = os.getenv("INPAINT_PERMIT_SECRET", "")
INPAINT_CREDIT_COST = 1

# The static SECRET_TOKEN ships inside the extension, so it is not a secret.
# Licensing supersedes it; set this to 1 only for a non-extension client.
ALLOW_LEGACY_SERVICE_TOKEN = os.getenv("ALLOW_LEGACY_SERVICE_TOKEN", "0") == "1"

# AI image models the client is allowed to request.
# Keep this list in sync with the dropdown in extension/pages/settings.html.
DEFAULT_AI_MODEL = "gemini-2.5-flash-image"
ALLOWED_AI_MODELS = {
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image",
}

# Initialize Vertex AI GenAI Client
# Express mode: authenticate with an API key (no project/location/ADC needed).
# Standard mode: fall back to project + location using Application Default Credentials.
client = None
if VERTEX_API_KEY:
    client = genai.Client(vertexai=True, api_key=VERTEX_API_KEY)
elif GOOGLE_CLOUD_PROJECT:
    client = genai.Client(
        vertexai=True,
        project=GOOGLE_CLOUD_PROJECT,
        location=GOOGLE_CLOUD_LOCATION,
    )


# 🔒 SECURITY MIDDLEWARE
def _admin_session_signature(exp: int) -> str:
    # Keyed on SECRET_TOKEN, so rotating it also signs out every admin session.
    return hmac.new(SECRET_TOKEN.encode(), f"admin-session.{exp}".encode(), hashlib.sha256).hexdigest()


def _make_admin_session() -> tuple[str, int]:
    exp = int(time.time()) + ADMIN_SESSION_TTL_SECONDS
    return f"adm.{exp}.{_admin_session_signature(exp)}", exp


def _admin_session_ok(token: str) -> bool:
    parts = token.split(".")
    if len(parts) != 3 or parts[0] != "adm" or not parts[1].isdigit():
        return False
    exp = int(parts[1])
    return exp > time.time() and hmac.compare_digest(_admin_session_signature(exp), parts[2])


def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """The static SECRET_TOKEN (server-to-server) or a session token issued by
    POST /license/admin/login (the admin panel)."""
    token = credentials.credentials
    if not (secrets.compare_digest(token, SECRET_TOKEN) or _admin_session_ok(token)):
        raise HTTPException(status_code=401, detail="Invalid Security Token")
    return token


def _license_http_error(exc: "licensing.LicenseError") -> HTTPException:
    """Licensing failures carry a machine-readable reason so the extension can
    tell "no key yet" apart from "this key moved to another device"."""
    return HTTPException(
        status_code=exc.status_code,
        detail={"error": "license", "reason": exc.reason, "message": exc.message, **exc.extra},
    )


# Verified access tokens are cached briefly: clients poll job status and check
# their license often enough that a Supabase round-trip per request adds up.
AUTH_CACHE_SECONDS = 60
_auth_cache: dict[str, tuple[str, float]] = {}


async def _user_id_for_token(token: str) -> str | None:
    """Supabase user id for an access token, or None."""
    key = hashlib.sha256(token.encode()).hexdigest()
    cached = _auth_cache.get(key)
    now = time.time()
    if cached and cached[1] > now:
        return cached[0]
    try:
        user_id = await asyncio.to_thread(_verify_supabase_user, token)
    except (ValueError, RuntimeError) as exc:
        print(f"[auth] access token check failed: {exc}")
        return None
    if len(_auth_cache) > 5000:
        _auth_cache.clear()
    _auth_cache[key] = (user_id, now + AUTH_CACHE_SECONDS)
    return user_id


async def verify_signed_in_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    user_id = await _user_id_for_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Please sign in again.")
    return user_id


async def verify_licensed_device(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    x_license: str = Header(default="", alias="X-License"),
) -> str:
    """Require a signed-in user whose license is active on the calling device.

    The entitlement token is an HMAC issued by /license/status, so this costs no
    database round-trip; the token's lifetime bounds how long a device that lost
    its binding can keep working.
    """
    user_id = await _user_id_for_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Please sign in again.")
    try:
        licensing.verify_entitlement_token(x_license, user_id)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] verification unavailable: {exc}")
        raise HTTPException(status_code=503, detail="License checks are temporarily unavailable.") from exc
    return user_id


async def verify_watermark_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    x_license: str = Header(default="", alias="X-License"),
):
    """Accept the legacy service token or a Supabase user token.

    The extension sends the Supabase token plus its X-License entitlement, so
    this endpoint can check the license and charge the account's credits
    server-side. The legacy static token is only honoured when
    ALLOW_LEGACY_SERVICE_TOKEN is set, because it ships inside the extension.
    """
    token = credentials.credentials
    if token == SECRET_TOKEN:
        if not ALLOW_LEGACY_SERVICE_TOKEN:
            raise HTTPException(status_code=401, detail="Please sign in again.")
        return None
    try:
        user_id = _verify_supabase_user(token)
        licensing.verify_entitlement_token(x_license, user_id)
        _consume_inpaint_credit(user_id)
        return user_id
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=402, detail=str(exc)) from exc
    except Exception as exc:
        print(f"[watermark] authorization failure: {exc}")
        raise HTTPException(status_code=503, detail="Could not verify watermark-removal credits") from exc


def _verify_supabase_user(access_token: str) -> str:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise RuntimeError("Supabase auth is not configured on the API")
    data = _supabase_json_request(
        f"{SUPABASE_URL}/auth/v1/user",
        "GET",
        {"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {access_token}"},
    )
    user_id = data.get("id") if isinstance(data, dict) else None
    if not user_id:
        raise ValueError("Invalid Supabase session")
    return user_id


def _consume_inpaint_credit(user_id: str) -> int:
    """Consume one credit without allowing concurrent requests to overspend.

    The conditional PATCH is an optimistic compare-and-swap: if another request
    changed the row after our read, zero rows are updated and we retry with the
    newer balance.
    """
    if not SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not configured on the API")
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    profile_url = f"{SUPABASE_URL}/rest/v1/profiles"
    for _ in range(4):
        query = urllib.parse.urlencode({"id": f"eq.{user_id}", "select": "credits"})
        rows = _supabase_json_request(f"{profile_url}?{query}", "GET", headers)
        if not isinstance(rows, list) or not rows:
            raise PermissionError("No billing profile exists for this account")
        current = int(rows[0].get("credits") or 0)
        print(f"[inpaint] credit check user={user_id} observed_credits={current}")
        if current < INPAINT_CREDIT_COST:
            raise PermissionError("No inpainting credits remaining")
        update_query = urllib.parse.urlencode({"id": f"eq.{user_id}", "credits": f"eq.{current}"})
        updated = _supabase_json_request(
            f"{profile_url}?{update_query}", "PATCH", headers,
            {"credits": current - INPAINT_CREDIT_COST},
        )
        if isinstance(updated, list) and updated:
            return int(updated[0].get("credits") or 0)
    raise RuntimeError("Credit balance changed repeatedly; please retry")


def _refund_inpaint_credit(user_id: str) -> None:
    """Return a credit when a billed AI request fails before producing output."""
    if not SUPABASE_SERVICE_ROLE_KEY:
        return
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    profile_url = f"{SUPABASE_URL}/rest/v1/profiles"
    for _ in range(4):
        query = urllib.parse.urlencode({"id": f"eq.{user_id}", "select": "credits"})
        rows = _supabase_json_request(f"{profile_url}?{query}", "GET", headers)
        if not isinstance(rows, list) or not rows:
            return
        current = int(rows[0].get("credits") or 0)
        update_query = urllib.parse.urlencode({"id": f"eq.{user_id}", "credits": f"eq.{current}"})
        updated = _supabase_json_request(
            f"{profile_url}?{update_query}", "PATCH", headers,
            {"credits": current + INPAINT_CREDIT_COST},
        )
        if isinstance(updated, list) and updated:
            print(f"[inpaint] refunded failed request user={user_id} credits={current + INPAINT_CREDIT_COST}")
            return
    print(f"[inpaint] could not refund failed request user={user_id}")


def _make_inpaint_permit(user_id: str) -> str:
    if not INPAINT_PERMIT_SECRET:
        raise RuntimeError("INPAINT_PERMIT_SECRET is not configured on the API")
    payload = {"sub": user_id, "scope": "local-inpaint", "exp": int(time.time()) + 300, "jti": str(uuid.uuid4())}
    encoded = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(INPAINT_PERMIT_SECRET.encode(), encoded.encode(), hashlib.sha256).digest()
    return f"{encoded}.{base64.urlsafe_b64encode(signature).decode().rstrip('=')}"


# 🤖 SHARED AI HELPER
def _resolve_model(model: str) -> str:
    """Fall back to the default if the client requested an unknown model."""
    return model if model in ALLOWED_AI_MODELS else DEFAULT_AI_MODEL


def _normalize_mime(content_type: str | None) -> str:
    mime = content_type or "image/png"
    if mime not in ("image/png", "image/jpeg", "image/webp"):
        mime = "image/png"
    return mime


def run_gemini_image_edit(contents: bytes, mime_type: str, prompt: str, model: str) -> Response:
    """Send an image + instruction to Gemini and return the edited image as PNG."""
    if not client:
        raise HTTPException(
            status_code=503,
            detail="AI not configured on server. Set VERTEX_API_KEY (express mode) or GOOGLE_CLOUD_PROJECT.",
        )

    genai_contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_bytes(data=contents, mime_type=mime_type),
                types.Part.from_text(text=prompt),
            ],
        ),
    ]

    config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        response_modalities=["IMAGE", "TEXT"],
        safety_settings=[
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
        ],
    )

    try:
        response = client.models.generate_content(
            model=model,
            contents=genai_contents,
            config=config,
        )
    except Exception as e:
        # The client only sees a summary; the real cause (quota, auth, model name,
        # transport) goes to the server log so a 502 is diagnosable after the fact.
        print(f"[ai] generate_content failed model={model!r}: {type(e).__name__}: {e}")
        raise HTTPException(status_code=502, detail=f"AI Error: {str(e)}")

    # A safety block comes back as zero candidates — indexing straight into [0] would
    # turn that into an unhandled 500 instead of a useful message.
    candidates = getattr(response, "candidates", None) or []
    if not candidates:
        print(f"[ai] no candidates returned model={model!r} "
              f"prompt_feedback={getattr(response, 'prompt_feedback', None)!r}")
        raise HTTPException(
            status_code=502,
            detail="The AI model returned no result. The image may have been rejected by a content filter.",
        )

    parts = getattr(candidates[0].content, "parts", None) or []
    for part in parts:
        if part.inline_data:
            return Response(content=part.inline_data.data, media_type="image/png")

    # Reached when the model replied with text instead of an image — usually a refusal
    # or a truncated response. Log why, plus whatever it said, since that is the single
    # most useful clue and is not visible anywhere else.
    finish_reason = getattr(candidates[0], "finish_reason", None)
    said = " ".join(
        (part.text or "").strip() for part in parts if getattr(part, "text", None)
    ).strip()
    print(f"[ai] no image in response model={model!r} finish_reason={finish_reason!r} "
          f"parts={len(parts)} text={said[:300]!r}")
    raise HTTPException(status_code=502, detail="No image returned by the AI model.")


# Bumped when the client-visible contract changes, so /ping can confirm what is
# actually deployed instead of inferring it from download behaviour.
API_FEATURES = ["cookie_auth", "local_inpaint_credits", "youtube_download", "youtube_relay"]

_background_session = None


def _remove_background_with_matting(contents: bytes) -> bytes:
    """Create a transparent PNG while preserving the input RGB pixels."""
    global _background_session
    if new_session is None or rembg_remove is None:
        raise RuntimeError("rembg is not installed")

    if _background_session is None:
        model_name = os.getenv("BACKGROUND_MODEL", "u2net")
        _background_session = new_session(model_name)

    result = rembg_remove(
        contents,
        session=_background_session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10,
        post_process_mask=True,
    )

    with Image.open(BytesIO(result)) as image:
        output = BytesIO()
        image.convert("RGBA").save(output, format="PNG", optimize=True)
        return output.getvalue()


@app.get("/ping")
async def ping():
    return {"status": "success", "message": "API is Live!", "features": API_FEATURES}


@app.post("/inpaint/authorize")
async def authorize_local_inpaint(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    x_license: str = Header(default="", alias="X-License"),
):
    """Authorize one local inpainting run without receiving the image or mask."""
    try:
        user_id = await asyncio.to_thread(_verify_supabase_user, credentials.credentials)
        licensing.verify_entitlement_token(x_license, user_id)
        remaining = await asyncio.to_thread(_consume_inpaint_credit, user_id)
        permit = _make_inpaint_permit(user_id)
        return {"authorized": True, "permit": permit, "remaining_credits": remaining, "expires_in": 300}
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=402, detail=str(exc)) from exc
    except RuntimeError as exc:
        print(f"[inpaint] authorization configuration/request failure: {exc}")
        raise HTTPException(status_code=503, detail="Credit authorization is temporarily unavailable.") from exc


# LICENSING
#
# Flow: the extension signs in, generates a device id, and calls /license/status.
# If that says it is not licensed, the user enters a key and /license/activate
# binds it to this (account, device). Both return a short-lived entitlement
# token that the protected endpoints verify.


class LicenseActivateRequest(BaseModel):
    key: str
    device_id: str
    device_label: str | None = None


class LicenseDeviceRequest(BaseModel):
    device_id: str


class LicenseMintRequest(BaseModel):
    count: int = 1
    provider: str | None = "manual"
    order_id: str | None = None
    email: str | None = None


@app.post("/license/status")
async def license_status(body: LicenseDeviceRequest, user_id: str = Depends(verify_signed_in_user)):
    try:
        return await asyncio.to_thread(licensing.status_for, user_id, body.device_id)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] status failed: {exc}")
        raise HTTPException(status_code=503, detail="License checks are temporarily unavailable.") from exc


@app.post("/license/activate")
async def license_activate(body: LicenseActivateRequest, user_id: str = Depends(verify_signed_in_user)):
    try:
        return await asyncio.to_thread(
            licensing.activate, body.key, user_id, body.device_id, body.device_label
        )
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] activation failed: {exc}")
        raise HTTPException(status_code=503, detail="Activation is temporarily unavailable.") from exc


@app.post("/license/deactivate")
async def license_deactivate(body: LicenseDeviceRequest, user_id: str = Depends(verify_signed_in_user)):
    try:
        return await asyncio.to_thread(licensing.release, user_id, body.device_id)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] deactivation failed: {exc}")
        raise HTTPException(status_code=503, detail="Deactivation is temporarily unavailable.") from exc


class LicenseKeyRequest(BaseModel):
    key: str
    note: str | None = None


class LicenseBanRequest(BaseModel):
    user_id: str
    banned: bool = True


class LicenseIssueRequest(BaseModel):
    user_id: str
    note: str | None = None


ADMIN_PAGE = pathlib.Path(__file__).with_name("admin.html")


@app.get("/admin", response_class=HTMLResponse)
async def admin_page():
    """The panel itself is public HTML; the operator signs in with
    ADMIN_USERNAME/ADMIN_PASSWORD and the page keeps the resulting session
    token only in sessionStorage."""
    if not ADMIN_PAGE.exists():
        raise HTTPException(status_code=404, detail="Admin page is not deployed.")
    return HTMLResponse(ADMIN_PAGE.read_text(encoding="utf-8"))


class AdminLoginRequest(BaseModel):
    username: str
    password: str


ADMIN_LOGIN_MAX_FAILURES = 10
ADMIN_LOGIN_WINDOW_SECONDS = 15 * 60
_admin_login_failures: dict[str, list[float]] = {}


@app.post("/license/admin/login")
async def admin_login(body: AdminLoginRequest, request: Request):
    """Trades the admin username/password for a session token the panel sends
    as its bearer token. Failed attempts are rate-limited per client address."""
    if not (ADMIN_USERNAME and ADMIN_PASSWORD):
        raise HTTPException(status_code=503, detail="Admin sign-in is not configured (set ADMIN_USERNAME and ADMIN_PASSWORD).")

    client = request.client.host if request.client else "unknown"
    now = time.time()
    recent = [t for t in _admin_login_failures.get(client, []) if now - t < ADMIN_LOGIN_WINDOW_SECONDS]
    if len(recent) >= ADMIN_LOGIN_MAX_FAILURES:
        _admin_login_failures[client] = recent
        raise HTTPException(status_code=429, detail="Too many failed sign-ins. Try again in a few minutes.")

    user_ok = secrets.compare_digest(body.username.strip().encode(), ADMIN_USERNAME.encode())
    pass_ok = secrets.compare_digest(body.password.encode(), ADMIN_PASSWORD.encode())
    if not (user_ok and pass_ok):
        recent.append(now)
        _admin_login_failures[client] = recent
        await asyncio.sleep(1)
        raise HTTPException(status_code=401, detail="Wrong username or password.")

    _admin_login_failures.pop(client, None)
    token, exp = _make_admin_session()
    return {"token": token, "expires_at": exp}


EMAIL_LOGO = pathlib.Path(__file__).with_name("email-logo.png")


@app.get("/brand/logo.png")
async def email_logo():
    """Public logo for the Supabase auth email templates, served from here so
    the emails don't reference the Supabase project URL."""
    if not EMAIL_LOGO.exists():
        raise HTTPException(status_code=404, detail="Logo is not deployed.")
    return FileResponse(EMAIL_LOGO, media_type="image/png", headers={"Cache-Control": "public, max-age=604800"})


@app.get("/license/admin/licenses", dependencies=[Depends(verify_admin_token)])
async def license_admin_list(q: str = "", limit: int = 50, offset: int = 0):
    try:
        return await asyncio.to_thread(licensing.admin_list, q, limit, offset)
    except RuntimeError as exc:
        print(f"[license] admin list failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not read licenses.") from exc


@app.get("/license/admin/events", dependencies=[Depends(verify_admin_token)])
async def license_admin_events(key: str, limit: int = 50):
    try:
        return {"events": await asyncio.to_thread(licensing.admin_events, key, limit)}
    except RuntimeError as exc:
        print(f"[license] admin events failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not read the license history.") from exc


@app.get("/license/admin/users", dependencies=[Depends(verify_admin_token)])
async def license_admin_users(q: str = "", limit: int = 50, offset: int = 0):
    try:
        return await asyncio.to_thread(licensing.admin_users, q, limit, offset)
    except RuntimeError as exc:
        print(f"[license] admin users failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not read accounts.") from exc


@app.post("/license/admin/issue", dependencies=[Depends(verify_admin_token)])
async def license_admin_issue(body: LicenseIssueRequest):
    """Create a key that already belongs to one account."""
    try:
        return await asyncio.to_thread(licensing.admin_issue, body.user_id, body.note)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] admin issue failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not issue a key.") from exc


@app.post("/license/admin/revoke", dependencies=[Depends(verify_admin_token)])
async def license_admin_revoke(body: LicenseKeyRequest):
    """Permanently disable a key. There is no un-revoke here on purpose."""
    try:
        return await asyncio.to_thread(licensing.admin_revoke, body.key, body.note)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] admin revoke failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not revoke that key.") from exc


@app.post("/license/admin/release", dependencies=[Depends(verify_admin_token)])
async def license_admin_release(body: LicenseKeyRequest):
    """Unbind the device and clear the cooldown so the user can activate now."""
    try:
        return await asyncio.to_thread(licensing.admin_release, body.key, body.note)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] admin release failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not release that device.") from exc


@app.post("/license/admin/ban", dependencies=[Depends(verify_admin_token)])
async def license_admin_ban(body: LicenseBanRequest):
    """Block the Supabase account from signing in at all, or lift that block."""
    try:
        return await asyncio.to_thread(licensing.admin_set_ban, body.user_id, body.banned)
    except licensing.LicenseError as exc:
        raise _license_http_error(exc) from exc
    except RuntimeError as exc:
        print(f"[license] admin ban failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not change that account.") from exc


@app.post("/license/admin/mint", dependencies=[Depends(verify_admin_token)])
async def license_admin_mint(body: LicenseMintRequest):
    """Mint keys by hand until a payment provider is wired into the webhook."""
    count = max(1, min(int(body.count or 1), 100))
    try:
        keys = [
            (await asyncio.to_thread(
                licensing.mint, body.provider, body.order_id if count == 1 else None, body.email
            ))["key"]
            for _ in range(count)
        ]
    except RuntimeError as exc:
        print(f"[license] mint failed: {exc}")
        raise HTTPException(status_code=503, detail="Could not create license keys.") from exc
    return {"keys": keys}


def _webhook_signature_ok(provider: str, raw: bytes, headers, secret: str) -> bool:
    """Generic HMAC-SHA256-over-the-raw-body check.

    Lemon Squeezy (X-Signature) and Paddle use this shape; Stripe and Gumroad do
    not, so add their scheme here once a provider is chosen.
    """
    sent = headers.get("x-signature") or headers.get("x-webhook-signature") or ""
    expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
    return bool(sent) and hmac.compare_digest(expected, sent.strip().lower())


@app.post("/license/webhook/{provider}")
async def license_webhook(provider: str, request: Request):
    """Mint a key when a purchase completes.

    No provider has been chosen yet, so this stays disabled unless
    LICENSE_WEBHOOK_SECRET is set. Before going live, add the provider signature
    scheme in _webhook_signature_ok and map its payload fields below: an
    unauthenticated mint endpoint is a free key generator.
    """
    secret = os.getenv("LICENSE_WEBHOOK_SECRET", "")
    if not secret:
        raise HTTPException(status_code=501, detail="Purchase webhooks are not configured yet.")

    raw = await request.body()
    if not _webhook_signature_ok(provider, raw, request.headers, secret):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    try:
        payload = json.loads(raw.decode("utf-8") or "{}")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    order_id = str(payload.get("order_id") or payload.get("id") or "") or None
    email = payload.get("email") or payload.get("buyer_email")
    if not order_id:
        raise HTTPException(status_code=400, detail="Webhook payload has no order id")

    result = await asyncio.to_thread(licensing.mint, provider, order_id, email)
    print(f"[license] webhook provider={provider} order={order_id} {result['status']}")
    return {"status": result["status"], "key": result["key"]}


@app.post("/upscale", dependencies=[Depends(verify_licensed_device)])
async def upscale_image(
    image: UploadFile = File(...),
    scale: str = Form("2"),
    model: str = Form(DEFAULT_AI_MODEL),
):
    contents = await image.read()
    factor = scale if scale in ("2", "4") else "2"
    prompt = (
        f"Upscale and enhance this image to roughly {factor}x its original resolution. "
        "Sharpen fine detail, remove noise and compression artifacts, and reconstruct "
        "realistic texture. Do not change the composition, colors, or content — only "
        "increase clarity and resolution."
    )
    return run_gemini_image_edit(
        contents, _normalize_mime(image.content_type), prompt, _resolve_model(model)
    )


@app.post("/remove-background", dependencies=[Depends(verify_licensed_device)])
async def remove_background_api(
    image: UploadFile = File(...),
    model: str = Form(DEFAULT_AI_MODEL),
):
    contents = await image.read()
    mime_type = _normalize_mime(image.content_type)
    try:
        return Response(
            content=_remove_background_with_matting(contents),
            media_type="image/png",
        )
    except Exception as exc:
        # A fresh deployment may not yet have downloaded its ONNX model.
        print(f"[background] matting failed; falling back to Gemini: {type(exc).__name__}: {exc}")
        prompt = (
            "Remove the background from this image completely, isolating the main "
            "foreground subject. Output the subject on a fully transparent background "
            "as a PNG with an alpha channel. Keep the subject's edges clean and natural."
        )
        return run_gemini_image_edit(
            contents, mime_type, prompt, _resolve_model(model)
        )


# 🎬 YOUTUBE DOWNLOAD
#
# Flow: POST /youtube/jobs starts a background yt-dlp job → the client polls
# GET /youtube/jobs/{id} → when ready, the client downloads GET /youtube/file/{id}?t=...
# directly (chrome.downloads), and the job folder is deleted once the file is sent.
# Nothing is kept: a sweeper removes anything older than YT_JOB_TTL_SECONDS.

YT_ALLOWED_HOSTS = ("youtube.com", "youtu.be")
YT_WORK_ROOT = os.getenv("YT_WORK_ROOT", "/tmp/anypng_yt")
YT_MAX_CONCURRENT = max(1, int(os.getenv("YT_MAX_CONCURRENT", "2")))
YT_MAX_ACTIVE_PER_USER = 2
YT_JOB_TTL_SECONDS = int(os.getenv("YT_JOB_TTL_SECONDS", "1800"))
YT_SWEEP_INTERVAL_SECONDS = 300
YT_FILE_TOKEN_TTL_SECONDS = 600

# Optional Netscape cookies file from a logged-in (throwaway) YouTube account, used to
# get past "Sign in to confirm you're not a bot" on datacenter IPs.
YTDLP_COOKIES_FILE = os.getenv("YTDLP_COOKIES_FILE", "/app/cookies/cookies.txt")
# YouTube's SABR rollout leaves some player clients with no downloadable formats; the
# working set changes over time, so it is tunable without a rebuild (e.g. "default,tv").
YTDLP_PLAYER_CLIENTS = os.getenv("YTDLP_PLAYER_CLIENTS", "").strip()

# Jobs live in memory only, so a per-process key is enough to sign download links.
_YT_FILE_SECRET = secrets.token_bytes(32)

YT_ACTIVE_STATUSES = ("queued", "downloading", "processing")

AUTH_WALL_MARKERS = (
    "sign in to confirm",
    "confirm you're not a bot",
    "this video is only available to",
    "sign in to view",
    "login required",
    "private video",
    "account cookies",
)
# YouTube uses typographic apostrophes (U+2019) in these messages.
_QUOTE_TRANSLATION = str.maketrans({"‘": "'", "’": "'", "ʼ": "'", "“": '"', "”": '"'})


@dataclass
class YoutubeJob:
    id: str
    user_id: str
    url: str
    kind: str
    height: int | None
    dir: str
    created_at: float = field(default_factory=time.time)
    status: str = "queued"
    percent: float = 0.0
    filepath: str | None = None
    filename: str | None = None
    size: int | None = None
    error: str | None = None
    error_code: str | None = None
    cancel: threading.Event = field(default_factory=threading.Event)


class YoutubeJobRequest(BaseModel):
    url: str
    kind: Literal["mp4", "webm", "mp3"]
    height: int | None = None


YT_JOBS: dict[str, YoutubeJob] = {}
_yt_semaphore: asyncio.Semaphore | None = None
_yt_tasks: set[asyncio.Task] = set()


def _is_youtube_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
    except ValueError:
        return False
    host = (parsed.hostname or "").lower()
    if parsed.scheme not in ("http", "https") or not host:
        return False
    return any(host == h or host.endswith("." + h) for h in YT_ALLOWED_HOSTS)


def _is_auth_wall(message: str) -> bool:
    lowered = message.lower().translate(_QUOTE_TRANSLATION)
    return any(marker in lowered for marker in AUTH_WALL_MARKERS)


def _is_format_error(message: str) -> bool:
    return "requested format is not available" in message.lower()


def _ytdlp_base_opts(job: YoutubeJob) -> dict:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "noplaylist": True,
        "socket_timeout": 30,
        "retries": 3,
        "fragment_retries": 3,
        "concurrent_fragment_downloads": 4,
        "paths": {"home": job.dir, "temp": job.dir},
    }
    if YTDLP_PLAYER_CLIENTS:
        clients = [c.strip() for c in YTDLP_PLAYER_CLIENTS.split(",") if c.strip()]
        if clients:
            opts["extractor_args"] = {"youtube": {"player_client": clients}}
    if os.path.isfile(YTDLP_COOKIES_FILE):
        # yt-dlp writes the jar back on close; a per-job copy avoids concurrent jobs
        # racing on the shared file.
        job_cookies = os.path.join(job.dir, ".cookies.txt")
        shutil.copyfile(YTDLP_COOKIES_FILE, job_cookies)
        opts["cookiefile"] = job_cookies
    return opts


def _ytdlp_format_opts(kind: str, height: int | None) -> dict:
    if kind == "mp3":
        return {
            "format": "ba/b",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
        }
    # format_sort picks the closest quality at or below the cap instead of failing
    # when the exact height doesn't exist for this video.
    return {"format": "bv*+ba/b", "format_sort": _video_format_sort(kind, height), "merge_output_format": kind}


def _video_format_sort(kind: str, height: int | None) -> list[str]:
    # For MP4, prefer H.264 at the chosen height (widest player support); YouTube only
    # offers VP9/AV1 above 1080p, and res comes first so those still win there.
    prefs = ["vcodec:h264", "ext:mp4:m4a"] if kind == "mp4" else ["ext:webm:webm"]
    return [f"res:{height}", *prefs] if height else prefs


def _live_match_filter(skip_reason: list[str]):
    """yt-dlp match_filter that skips live streams and records why."""
    def match_filter(info: dict, *, incomplete: bool = False) -> str | None:
        if info.get("is_live") or info.get("live_status") in ("is_live", "is_upcoming", "post_live"):
            skip_reason.append("Live streams and premieres can't be downloaded.")
            return skip_reason[-1]
        return None
    return match_filter


def _log_available_formats(job: YoutubeJob) -> None:
    """Diagnostic only: a format error says nothing about why, so list what was offered."""
    opts = _ytdlp_base_opts(job)
    opts.update({"skip_download": True, "ignore_no_formats_error": True, "allow_unplayable_formats": True})
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(job.url, download=False) or {}
    except Exception as e:
        print(f"[youtube] could not list formats: {type(e).__name__}: {e}")
        return
    formats = info.get("formats") or []
    print(f"[youtube] {len(formats)} raw format(s) offered (live={info.get('is_live')}):")
    for f in formats:
        print(f"    {f.get('format_id')} {f.get('ext')} {f.get('resolution') or f.get('format_note')} "
              f"v={f.get('vcodec')} a={f.get('acodec')} proto={f.get('protocol')} drm={bool(f.get('has_drm'))}")


def _run_youtube_download(job: YoutubeJob) -> None:
    """Blocking; runs in a worker thread. Updates the job in place."""
    finished_streams: set[str] = set()
    skip_reason: list[str] = []

    def progress_hook(d: dict) -> None:
        if job.cancel.is_set():
            raise DownloadCancelled("Cancelled by user")
        info = d.get("info_dict") or {}
        stream_count = len(info.get("requested_formats") or []) or 1
        format_id = str(info.get("format_id"))
        if d.get("status") == "downloading":
            job.status = "downloading"
            total = d.get("total_bytes") or d.get("total_bytes_estimate")
            fraction = (d.get("downloaded_bytes") or 0) / total if total else 0.0
            overall = (len(finished_streams) + min(fraction, 1.0)) / stream_count
            job.percent = round(min(overall, 1.0) * 100, 1)
        elif d.get("status") == "finished":
            finished_streams.add(format_id)

    def postprocessor_hook(d: dict) -> None:
        if job.cancel.is_set():
            raise DownloadCancelled("Cancelled by user")
        if d.get("status") == "started":
            job.status = "processing"
            job.percent = 100.0

    opts = _ytdlp_base_opts(job)
    opts.update(_ytdlp_format_opts(job.kind, job.height))
    opts.update({
        "outtmpl": "%(title).150B [%(id)s].%(ext)s",
        "progress_hooks": [progress_hook],
        "postprocessor_hooks": [postprocessor_hook],
        "match_filter": _live_match_filter(skip_reason),
    })

    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(job.url, download=True) or {}

    if skip_reason:
        raise ValueError(skip_reason[0])

    filepath = None
    for entry in info.get("requested_downloads") or []:
        if entry.get("filepath") and os.path.isfile(entry["filepath"]):
            filepath = entry["filepath"]
    if not filepath:
        # Fallback: the job folder only ever holds this one download.
        candidates = [
            os.path.join(job.dir, name) for name in os.listdir(job.dir)
            if not name.startswith(".") and not name.endswith((".part", ".ytdl"))
        ]
        filepath = max(candidates, key=os.path.getsize, default=None)
    if not filepath:
        raise RuntimeError("yt-dlp produced no output file")

    job.filepath = filepath
    job.filename = os.path.basename(filepath)
    job.size = os.path.getsize(filepath)


async def _run_youtube_job(job: YoutubeJob) -> None:
    global _yt_semaphore
    if _yt_semaphore is None:
        _yt_semaphore = asyncio.Semaphore(YT_MAX_CONCURRENT)
    async with _yt_semaphore:
        if job.cancel.is_set():
            shutil.rmtree(job.dir, ignore_errors=True)
            return
        try:
            await asyncio.to_thread(_run_youtube_download, job)
            if job.cancel.is_set():
                raise DownloadCancelled("Cancelled by user")
            job.status = "ready"
            job.percent = 100.0
            print(f"[youtube] job={job.id} ready file={job.filename!r} size={job.size}")
        except Exception as e:
            message = str(e)
            if job.cancel.is_set() or isinstance(e, DownloadCancelled):
                job.status, job.error_code, job.error = "cancelled", "cancelled", "Download cancelled."
            elif isinstance(e, ValueError):
                job.status, job.error_code, job.error = "error", "live", message
            elif _is_auth_wall(message):
                print(f"[youtube] job={job.id} auth wall (set YTDLP_COOKIES_FILE to a logged-in account): {message}")
                job.status, job.error_code = "error", "auth_required"
                job.error = "YouTube asked the server to sign in. The video may be private or age-restricted."
            elif _is_format_error(message):
                print(f"[youtube] job={job.id} no matching format: {message}")
                await asyncio.to_thread(_log_available_formats, job)
                job.status, job.error_code = "error", "no_formats"
                job.error = "No downloadable format was available for this video."
            else:
                print(f"[youtube] job={job.id} failed: {type(e).__name__}: {message}")
                job.status, job.error_code = "error", "failed"
                job.error = "Could not download this video. It may be private, restricted, or removed."
            shutil.rmtree(job.dir, ignore_errors=True)


def _remove_youtube_job(job_id: str) -> None:
    job = YT_JOBS.pop(job_id, None)
    if job:
        shutil.rmtree(job.dir, ignore_errors=True)


def _make_file_token(job_id: str) -> str:
    exp = int(time.time()) + YT_FILE_TOKEN_TTL_SECONDS
    sig = hmac.new(_YT_FILE_SECRET, f"{job_id}.{exp}".encode(), hashlib.sha256).hexdigest()
    return f"{exp}.{sig}"


def _check_file_token(job_id: str, token: str) -> bool:
    exp_str, _, sig = token.partition(".")
    if not exp_str.isdigit() or int(exp_str) < time.time():
        return False
    expected = hmac.new(_YT_FILE_SECRET, f"{job_id}.{exp_str}".encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig)


def _job_status_payload(job: YoutubeJob) -> dict:
    payload = {
        "job_id": job.id,
        "status": job.status,
        "percent": job.percent,
        "kind": job.kind,
        "filename": job.filename,
        "size": job.size,
        "error": job.error,
        "error_code": job.error_code,
    }
    if job.status == "ready":
        payload["download_url"] = f"/youtube/file/{job.id}?t={_make_file_token(job.id)}"
    return payload


async def _sweep_youtube_jobs() -> None:
    while True:
        await asyncio.sleep(YT_SWEEP_INTERVAL_SECONDS)
        cutoff = time.time() - YT_JOB_TTL_SECONDS
        for job_id, job in list(YT_JOBS.items()):
            if job.created_at < cutoff:
                job.cancel.set()
                if job.status not in YT_ACTIVE_STATUSES:
                    print(f"[youtube] sweeping expired job={job_id} status={job.status}")
                    _remove_youtube_job(job_id)


@app.on_event("startup")
async def _start_youtube_sweeper() -> None:
    # Leftovers from a previous process can never be fetched again (jobs are in memory).
    shutil.rmtree(YT_WORK_ROOT, ignore_errors=True)
    os.makedirs(YT_WORK_ROOT, exist_ok=True)
    task = asyncio.create_task(_sweep_youtube_jobs())
    _yt_tasks.add(task)


@app.post("/youtube/jobs")
async def create_youtube_job(body: YoutubeJobRequest, user_id: str = Depends(verify_licensed_device)):
    if yt_dlp is None:
        raise HTTPException(status_code=503, detail="Video downloads are not available on this server.")
    url = body.url.strip()
    if not _is_youtube_url(url):
        raise HTTPException(status_code=400, detail="Only YouTube video URLs are supported.")
    height = body.height if body.height and body.height > 0 else None

    active = sum(1 for j in YT_JOBS.values() if j.user_id == user_id and j.status in YT_ACTIVE_STATUSES)
    if active >= YT_MAX_ACTIVE_PER_USER:
        raise HTTPException(status_code=429, detail="You already have downloads in progress. Please wait for them to finish.")

    job_id = uuid.uuid4().hex
    job_dir = os.path.join(YT_WORK_ROOT, job_id)
    os.makedirs(job_dir, exist_ok=True)
    job = YoutubeJob(id=job_id, user_id=user_id, url=url, kind=body.kind, height=height, dir=job_dir)
    YT_JOBS[job_id] = job
    print(f"[youtube] job={job_id} user={user_id} kind={job.kind} height={height} url={url!r}")

    task = asyncio.create_task(_run_youtube_job(job))
    _yt_tasks.add(task)
    task.add_done_callback(_yt_tasks.discard)
    return {"job_id": job_id}


@app.get("/youtube/jobs/{job_id}")
async def get_youtube_job(job_id: str, user_id: str = Depends(verify_signed_in_user)):
    job = YT_JOBS.get(job_id)
    if not job or job.user_id != user_id:
        raise HTTPException(status_code=404, detail="Download not found or expired.")
    return _job_status_payload(job)


@app.delete("/youtube/jobs/{job_id}")
async def cancel_youtube_job(job_id: str, user_id: str = Depends(verify_signed_in_user)):
    job = YT_JOBS.get(job_id)
    if not job or job.user_id != user_id:
        raise HTTPException(status_code=404, detail="Download not found or expired.")
    job.cancel.set()
    if job.status in YT_ACTIVE_STATUSES:
        # The worker thread notices the flag on its next progress tick and cleans up.
        job.status, job.error_code, job.error = "cancelled", "cancelled", "Download cancelled."
    else:
        _remove_youtube_job(job_id)
    return {"cancelled": True}


@app.get("/youtube/file/{job_id}")
async def get_youtube_file(job_id: str, t: str = ""):
    # The signed short-lived token is the credential, so chrome.downloads can fetch
    # this URL directly without an Authorization header.
    if not _check_file_token(job_id, t):
        raise HTTPException(status_code=403, detail="Download link is invalid or expired.")
    job = YT_JOBS.get(job_id)
    if not job or job.status != "ready" or not job.filepath or not os.path.isfile(job.filepath):
        raise HTTPException(status_code=404, detail="Download not found or expired.")
    media_types = {"mp4": "video/mp4", "webm": "video/webm", "mp3": "audio/mpeg"}
    return FileResponse(
        job.filepath,
        media_type=media_types.get(job.kind, "application/octet-stream"),
        filename=job.filename,
        background=BackgroundTask(_remove_youtube_job, job_id),
    )


# 🔁 YOUTUBE BROWSER RELAY
#
# yt-dlp runs here, but every HTTP request it makes is sent over a WebSocket to the
# user's extension, which performs it from the user's own IP. YouTube therefore never
# sees this server (no bot check), and the stream URLs it returns are locked to the
# user's IP, so the extension downloads the media directly. Only small metadata
# responses (a few hundred KB) pass through this server; no media, no files.

YT_RELAY_MAX_REQUESTS = 30
YT_RELAY_MAX_BODY = 8 * 1024 * 1024
YT_RELAY_FETCH_TIMEOUT = 45
YT_RELAY_SESSION_TIMEOUT = 120
YT_RELAY_MAX_PER_USER = 2
YT_RELAY_MAX_CONCURRENT = max(1, int(os.getenv("YT_RELAY_MAX_CONCURRENT", "8")))
# Must match the extension's allowlist in scripts/yt-relay.js.
YT_RELAY_ALLOWED_HOSTS = ("youtube.com", "youtu.be", "googlevideo.com", "youtubei.googleapis.com", "ytimg.com")
# Headers a browser won't let the extension set; the browser supplies its own.
_RELAY_DROP_REQUEST_HEADERS = {
    "cookie", "host", "connection", "content-length", "accept-encoding", "origin", "referer",
    "user-agent", "te", "keep-alive", "transfer-encoding", "upgrade", "via", "expect", "trailer",
}
# fetch() has already decoded the body, so these would make yt-dlp misread it.
_RELAY_DROP_RESPONSE_HEADERS = {"content-encoding", "content-length", "transfer-encoding"}

_yt_relay_active: dict[str, int] = {}
_yt_relay_semaphore: asyncio.Semaphore | None = None


class RelayExtractError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def _is_relay_host(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
    except ValueError:
        return False
    host = (parsed.hostname or "").lower()
    return parsed.scheme == "https" and any(host == h or host.endswith("." + h) for h in YT_RELAY_ALLOWED_HOSTS)


class YoutubeRelaySession:
    """One extension WebSocket; turns yt-dlp requests into browser fetches."""

    def __init__(self, ws: WebSocket, loop: asyncio.AbstractEventLoop):
        self.ws = ws
        self.loop = loop
        self.pending: dict[str, asyncio.Future] = {}
        self.requests = 0
        self.closed = False
        self._send_lock = asyncio.Lock()

    async def send(self, message: dict) -> None:
        async with self._send_lock:
            await self.ws.send_json(message)

    async def fetch(self, message: dict) -> dict:
        fetch_id = uuid.uuid4().hex
        future = self.loop.create_future()
        self.pending[fetch_id] = future
        try:
            await self.send({"type": "fetch", "id": fetch_id, **message})
            return await asyncio.wait_for(future, YT_RELAY_FETCH_TIMEOUT)
        finally:
            self.pending.pop(fetch_id, None)

    def resolve(self, message: dict) -> None:
        future = self.pending.get(message.get("id"))
        if future and not future.done():
            future.set_result(message)

    def close(self) -> None:
        self.closed = True
        for future in self.pending.values():
            if not future.done():
                future.set_exception(ConnectionError("The browser disconnected."))


class BrowserRelayRH(RequestHandler):
    """yt-dlp request handler that performs every request through a YoutubeRelaySession."""

    _SUPPORTED_URL_SCHEMES = ("https",)
    _SUPPORTED_PROXY_SCHEMES = None
    _SUPPORTED_FEATURES = None
    session: "YoutubeRelaySession | None" = None

    def _check_extensions(self, extensions):
        super()._check_extensions(extensions)
        # The browser decides timeouts, TLS and cookies, so these are accepted and ignored.
        for key in ("cookiejar", "timeout", "legacy_ssl", "keep_header_casing", "impersonate"):
            extensions.pop(key, None)

    def _send(self, request):
        session = self.session
        if session is None or session.closed:
            raise YdlTransportError("The browser relay is closed.")
        if not _is_relay_host(request.url):
            raise YdlTransportError(f"Refusing to relay a request to {urllib.parse.urlparse(request.url).hostname}")
        session.requests += 1
        if session.requests > YT_RELAY_MAX_REQUESTS:
            raise YdlTransportError("Too many relayed requests for one video.")

        data = request.data
        if data is not None and not isinstance(data, bytes):
            data = data.read() if hasattr(data, "read") else bytes(data)
        headers = {
            name: value for name, value in self._get_headers(request).items()
            if name.lower() not in _RELAY_DROP_REQUEST_HEADERS and not name.lower().startswith(("sec-", "proxy-"))
        }
        message = {
            "method": request.method,
            "url": request.url,
            "headers": headers,
            "body": base64.b64encode(data).decode() if data else None,
        }

        future = asyncio.run_coroutine_threadsafe(session.fetch(message), session.loop)
        try:
            result = future.result(timeout=YT_RELAY_FETCH_TIMEOUT + 5)
        except Exception as e:
            future.cancel()
            raise YdlTransportError(f"Browser fetch failed: {e}", cause=e) from e
        if not result.get("ok"):
            raise YdlTransportError(f"Browser fetch failed: {result.get('error') or 'unknown error'}")

        body = base64.b64decode(result.get("body") or "")
        if len(body) > YT_RELAY_MAX_BODY:
            raise YdlTransportError("Relayed response is too large.")
        response_headers = {
            name: value for name, value in (result.get("headers") or {}).items()
            if name.lower() not in _RELAY_DROP_RESPONSE_HEADERS
        }
        response = YdlResponse(
            io.BytesIO(body), url=result.get("url") or request.url,
            headers=response_headers, status=int(result.get("status") or 0),
        )
        if not 200 <= response.status < 300:
            raise YdlHTTPError(response)
        return response


def _relay_format_opts(kind: str, height: int | None) -> dict:
    # Only plain HTTPS formats: the extension downloads them with ranged fetches.
    if kind == "mp3":
        return {"format": "ba[protocol=https]/b[protocol=https]"}
    if kind == "webm":
        # WebM can only hold VP8/VP9/AV1 + Opus/Vorbis, so prefer WebM streams outright.
        fmt = ("bv*[ext=webm][protocol=https]+ba[ext=webm][protocol=https]"
               "/bv*[protocol=https]+ba[protocol=https]/b[protocol=https]")
    else:
        fmt = "bv*[protocol=https]+ba[protocol=https]/b[protocol=https]"
    return {"format": fmt, "format_sort": _video_format_sort(kind, height)}


def _relay_extract(session: YoutubeRelaySession, url: str, kind: str, height: int | None) -> dict:
    """Blocking; runs in a worker thread. Returns the stream URLs for the extension."""
    session_handler = type("SessionRelayRH", (BrowserRelayRH,), {"session": session})

    class RelayYDL(yt_dlp.YoutubeDL):
        def build_request_director(self, handlers, preferences=None):
            return super().build_request_director([session_handler], preferences)

    skip_reason: list[str] = []
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "skip_download": True,
        "match_filter": _live_match_filter(skip_reason),
        **_relay_format_opts(kind, height),
    }
    if YTDLP_PLAYER_CLIENTS:
        clients = [c.strip() for c in YTDLP_PLAYER_CLIENTS.split(",") if c.strip()]
        if clients:
            opts["extractor_args"] = {"youtube": {"player_client": clients}}

    with RelayYDL(opts) as ydl:
        info = ydl.extract_info(url, download=False) or {}
    if skip_reason:
        raise RelayExtractError("live", skip_reason[0])

    formats = info.get("requested_formats") or ([info] if info.get("url") else [])
    if not formats:
        raise RelayExtractError("no_formats", "No downloadable format was available for this video.")
    streams = []
    for f in formats:
        streams.append({
            "url": f["url"],
            "format_id": f.get("format_id"),
            "ext": f.get("ext"),
            "vcodec": f.get("vcodec"),
            "acodec": f.get("acodec"),
            "height": f.get("height"),
            "filesize": f.get("filesize") or f.get("filesize_approx"),
            "chunk_size": (f.get("downloader_options") or {}).get("http_chunk_size"),
        })
    return {
        "title": info.get("title") or info.get("id") or "YouTube video",
        "video_id": info.get("id"),
        "duration": info.get("duration"),
        "kind": kind,
        "streams": streams,
    }


async def _relay_reader(ws: WebSocket, session: YoutubeRelaySession) -> None:
    try:
        while True:
            message = await ws.receive_json()
            if message.get("type") == "fetch_result":
                session.resolve(message)
            elif message.get("type") == "cancel":
                break
    except Exception:
        pass
    finally:
        session.close()


def _relay_error_for(exc: Exception) -> tuple[str, str]:
    message = str(exc)
    if isinstance(exc, RelayExtractError):
        return exc.code, exc.message
    if _is_auth_wall(message):
        return "auth_required", "YouTube requires sign-in for this video (private, members-only or age-restricted)."
    if _is_format_error(message):
        return "no_formats", "No downloadable format was available for this video."
    return "failed", "Could not read this video's download links."


@app.websocket("/youtube/extract")
async def youtube_extract(ws: WebSocket):
    """Relay protocol:
    client → {type:"start", token, url, kind, height}
    server → {type:"fetch", id, method, url, headers, body}   (repeated)
    client → {type:"fetch_result", id, ok, status, url, headers, body | error}
    server → {type:"result", title, video_id, duration, kind, streams} | {type:"error", code, message}
    """
    global _yt_relay_semaphore
    await ws.accept()
    session = YoutubeRelaySession(ws, asyncio.get_running_loop())
    reader: asyncio.Task | None = None
    user_id: str | None = None

    async def fail(code: str, message: str) -> None:
        try:
            await session.send({"type": "error", "code": code, "message": message})
        except Exception:
            pass

    try:
        try:
            start = await asyncio.wait_for(ws.receive_json(), 15)
        except Exception:
            return await fail("bad_request", "Expected a start message.")
        if yt_dlp is None:
            return await fail("unavailable", "Video downloads are not available on this server.")
        if not isinstance(start, dict) or start.get("type") != "start":
            return await fail("bad_request", "Expected a start message.")

        user_id = await _user_id_for_token(str(start.get("token") or ""))
        if not user_id:
            return await fail("signin", "Please sign in again.")
        try:
            licensing.verify_entitlement_token(str(start.get("license") or ""), user_id)
        except licensing.LicenseError as exc:
            user_id = None  # not counted yet, so nothing to decrement in finally
            return await fail("license", exc.message)
        url = str(start.get("url") or "").strip()
        if not _is_youtube_url(url):
            return await fail("bad_url", "Only YouTube video URLs are supported.")
        kind = start.get("kind") if start.get("kind") in ("mp4", "webm", "mp3") else "mp4"
        try:
            height = int(start.get("height") or 0) or None
        except (TypeError, ValueError):
            height = None

        if _yt_relay_active.get(user_id, 0) >= YT_RELAY_MAX_PER_USER:
            user_id = None  # not counted, so don't decrement in finally
            return await fail("busy", "You already have downloads starting. Please wait a moment.")
        _yt_relay_active[user_id] = _yt_relay_active.get(user_id, 0) + 1

        reader = asyncio.create_task(_relay_reader(ws, session))
        if _yt_relay_semaphore is None:
            _yt_relay_semaphore = asyncio.Semaphore(YT_RELAY_MAX_CONCURRENT)
        print(f"[youtube-relay] user={user_id} kind={kind} height={height} url={url!r}")
        try:
            async with _yt_relay_semaphore:
                result = await asyncio.wait_for(
                    asyncio.to_thread(_relay_extract, session, url, kind, height),
                    YT_RELAY_SESSION_TIMEOUT,
                )
        except asyncio.TimeoutError:
            session.close()
            return await fail("timeout", "Getting the video's links took too long. Please try again.")
        except Exception as e:
            code, message = _relay_error_for(e)
            if not session.closed:
                print(f"[youtube-relay] user={user_id} failed ({code}) after {session.requests} request(s): {e}")
            return await fail(code, message)

        print(f"[youtube-relay] user={user_id} ok: {len(result['streams'])} stream(s) "
              f"via {session.requests} relayed request(s)")
        await session.send({"type": "result", **result})
    except WebSocketDisconnect:
        pass
    finally:
        session.close()
        if reader:
            reader.cancel()
        if user_id:
            remaining = _yt_relay_active.get(user_id, 1) - 1
            if remaining > 0:
                _yt_relay_active[user_id] = remaining
            else:
                _yt_relay_active.pop(user_id, None)
        try:
            await ws.close()
        except Exception:
            pass
