import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response

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
