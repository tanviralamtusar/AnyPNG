import os
import re
import asyncio
import tempfile
import shutil
from urllib.parse import urlparse
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response, FileResponse
from starlette.background import BackgroundTask
import yt_dlp

# Load environment variables
load_dotenv()

app = FastAPI(title="Pro Image Tools API")
security = HTTPBearer()

# 🛑 CONFIGURATION
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "my_super_secret_hostinger_token_123!")
VERTEX_API_KEY = os.getenv("VERTEX_API_KEY")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

# AI image models the client is allowed to request.
# Keep this list in sync with the dropdown in extension/pages/settings.html.
DEFAULT_AI_MODEL = "gemini-2.0-flash-preview-image-generation"
ALLOWED_AI_MODELS = {
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.5-flash-image-preview",
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
        raise HTTPException(status_code=502, detail=f"AI Error: {str(e)}")

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            return Response(content=part.inline_data.data, media_type="image/png")

    raise HTTPException(status_code=502, detail="No image returned by the AI model.")


@app.get("/ping")
async def ping():
    return {"status": "success", "message": "API is Live!"}


# 🎬 VIDEO DOWNLOAD (yt-dlp fallback for the extension's client-side capture cascade)

# Only these platforms are supported — without this allowlist, yt-dlp (which supports
# thousands of sites) would turn this endpoint into an open URL-fetch proxy.
ALLOWED_VIDEO_HOST_SUFFIXES = (
    "youtube.com", "youtu.be",
    "instagram.com",
    "facebook.com", "fb.watch",
    "tiktok.com",
)

MAX_VIDEO_FILESIZE = 300 * 1024 * 1024  # 300MB — protects the unauthenticated-free endpoint


def _is_allowed_video_url(url: str) -> bool:
    try:
        host = (urlparse(url).hostname or "").lower()
    except ValueError:
        return False
    if not host:
        return False
    return any(host == suffix or host.endswith("." + suffix) for suffix in ALLOWED_VIDEO_HOST_SUFFIXES)


def _format_for_quality(quality: str) -> str:
    if quality == "audio":
        return "bestaudio/best"
    if quality in ("1080", "720", "480"):
        return f"bestvideo[height<={quality}]+bestaudio/best[height<={quality}]/best[height<={quality}]"
    return "bestvideo*+bestaudio/best"


def _run_ytdlp_download(url: str, quality: str, out_dir: str) -> str:
    """Blocking call — must be run off the event loop. Returns the downloaded file path."""
    ydl_opts = {
        "format": _format_for_quality(quality),
        "outtmpl": os.path.join(out_dir, "%(title).100s.%(ext)s"),
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "max_filesize": MAX_VIDEO_FILESIZE,
        "socket_timeout": 30,
        "retries": 3,
        "restrictfilenames": True,
    }
    if quality == "audio":
        ydl_opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }]
    else:
        ydl_opts["merge_output_format"] = "mp4"

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filepath = ydl.prepare_filename(info)
        if quality == "audio":
            filepath = os.path.splitext(filepath)[0] + ".mp3"
        elif not os.path.exists(filepath):
            # merge_output_format may have changed the extension
            filepath = os.path.splitext(filepath)[0] + ".mp4"
        return filepath


@app.post("/download-video", dependencies=[Depends(verify_token)])
async def download_video(
    url: str = Form(...),
    quality: str = Form("best"),
):
    if not _is_allowed_video_url(url):
        raise HTTPException(status_code=400, detail="Unsupported video URL. Supported: YouTube, Instagram, Facebook, TikTok.")

    if quality not in ("best", "1080", "720", "480", "audio"):
        quality = "best"

    out_dir = tempfile.mkdtemp(prefix="anypng_video_")

    try:
        filepath = await asyncio.to_thread(_run_ytdlp_download, url, quality, out_dir)
    except yt_dlp.utils.DownloadError as e:
        # The client only gets a generic message, but the real yt-dlp error (bot
        # checks, geo-block, sign-in walls, format changes, etc.) is logged here so
        # it's visible in server logs instead of silently disappearing.
        print(f"[download-video] yt-dlp DownloadError for url={url!r} quality={quality!r}: {e}")
        shutil.rmtree(out_dir, ignore_errors=True)
        raise HTTPException(status_code=422, detail="Could not download this video. It may be private, age-restricted, or removed.") from e
    except Exception as e:
        print(f"[download-video] Unexpected error for url={url!r} quality={quality!r}: {e}")
        shutil.rmtree(out_dir, ignore_errors=True)
        raise HTTPException(status_code=502, detail=f"Video download failed: {str(e)}") from e

    if not filepath or not os.path.exists(filepath):
        shutil.rmtree(out_dir, ignore_errors=True)
        raise HTTPException(status_code=502, detail="Video download failed: no output file produced.")

    media_type = "audio/mpeg" if quality == "audio" else "video/mp4"
    filename = os.path.basename(filepath)

    return FileResponse(
        filepath,
        media_type=media_type,
        filename=filename,
        background=BackgroundTask(shutil.rmtree, out_dir, ignore_errors=True),
    )


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


@app.post("/remove-watermark", dependencies=[Depends(verify_token)])
async def remove_watermark(
    image: UploadFile = File(...),
    prompt: str = Form(""),
    method: str = Form("gemini"),  # kept for backward compatibility; always AI now
    model: str = Form(DEFAULT_AI_MODEL),
):
    contents = await image.read()
    instruction = prompt.strip() or (
        "Remove all watermarks, logos, and text overlays from this image. "
        "Fill in the removed areas naturally to match the surrounding background. "
        "Keep everything else in the image exactly the same."
    )
    return run_gemini_image_edit(
        contents, _normalize_mime(image.content_type), instruction, _resolve_model(model)
    )


@app.post("/remove-background", dependencies=[Depends(verify_token)])
async def remove_background_api(
    image: UploadFile = File(...),
    model: str = Form(DEFAULT_AI_MODEL),
):
    contents = await image.read()
    prompt = (
        "Remove the background from this image completely, isolating the main "
        "foreground subject. Output the subject on a fully transparent background "
        "as a PNG with an alpha channel. Keep the subject's edges clean and natural."
    )
    return run_gemini_image_edit(
        contents, _normalize_mime(image.content_type), prompt, _resolve_model(model)
    )
