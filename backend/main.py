import os
import re
import asyncio
import base64
import hashlib
import hmac
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from io import BytesIO
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response, FileResponse
from starlette.background import BackgroundTask
from PIL import Image

try:
    from rembg import new_session, remove as rembg_remove
except ImportError:  # Keep the API bootable until image dependencies are installed.
    new_session = None
    rembg_remove = None

# Load environment variables
load_dotenv()

app = FastAPI(title="Pro Image Tools API")
security = HTTPBearer()

# 🛑 CONFIGURATION
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "my_super_secret_hostinger_token_123!")
VERTEX_API_KEY = os.getenv("VERTEX_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
INPAINT_PERMIT_SECRET = os.getenv("INPAINT_PERMIT_SECRET", "")
INPAINT_CREDIT_COST = 1

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
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid Security Token")
    return credentials.credentials


async def verify_watermark_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Accept the legacy service token or a Supabase user token.

    The extension uses the Supabase token so this endpoint can charge the
    authenticated user's credits server-side. The legacy token remains valid
    for existing backend clients that do not use account billing.
    """
    token = credentials.credentials
    if token == SECRET_TOKEN:
        return None
    try:
        user_id = _verify_supabase_user(token)
        _consume_inpaint_credit(user_id)
        return user_id
    except PermissionError as exc:
        raise HTTPException(status_code=402, detail=str(exc)) from exc
    except Exception as exc:
        print(f"[watermark] authorization failure: {exc}")
        raise HTTPException(status_code=503, detail="Could not verify watermark-removal credits") from exc


def _supabase_json_request(url: str, method: str, headers: dict[str, str], body: object | None = None) -> object:
    payload = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            raw = response.read()
            return json.loads(raw.decode("utf-8")) if raw else None
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase request failed ({exc.code}): {detail[:300]}") from exc


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
API_FEATURES = ["cookie_auth", "local_inpaint_credits"]

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
async def authorize_local_inpaint(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Authorize one local inpainting run without receiving the image or mask."""
    try:
        user_id = await asyncio.to_thread(_verify_supabase_user, credentials.credentials)
        remaining = await asyncio.to_thread(_consume_inpaint_credit, user_id)
        permit = _make_inpaint_permit(user_id)
        return {"authorized": True, "permit": permit, "remaining_credits": remaining, "expires_in": 300}
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=402, detail=str(exc)) from exc
    except RuntimeError as exc:
        print(f"[inpaint] authorization configuration/request failure: {exc}")
        raise HTTPException(status_code=503, detail="Credit authorization is temporarily unavailable.") from exc


@app.post("/upscale", dependencies=[Depends(verify_token)])
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


@app.post("/remove-background", dependencies=[Depends(verify_token)])
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
