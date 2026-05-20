import io
import os
import cv2
import numpy as np
import easyocr
import google.generativeai as genai
from dotenv import load_dotenv
from rembg import remove
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response

# Load environment variables
load_dotenv()

app = FastAPI(title="Pro Image Tools API")
security = HTTPBearer()

# 🛑 CONFIGURATION
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "my_super_secret_hostinger_token_123!")
GOOGLE_CLOUD_API_KEY = os.getenv("GOOGLE_CLOUD_API_KEY")

# Initialize AI Models (Loaded on startup)
reader = easyocr.Reader(['en'], gpu=False)
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel("EDSR_x2.pb")
sr.setModel("edsr", 2)

if GOOGLE_CLOUD_API_KEY:
    genai.configure(api_key=GOOGLE_CLOUD_API_KEY)

# 🔒 SECURITY MIDDLEWARE
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != SECRET_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid Security Token")
    return credentials.credentials

@app.get("/ping")
async def ping():
    return {"status": "success", "message": "API is Live!"}

@app.post("/upscale", dependencies=[Depends(verify_token)])
async def upscale_image(image: UploadFile = File(...)):
    contents = await image.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    upscaled_img = sr.upsample(img)
    _, encoded_img = cv2.imencode('.png', upscaled_img)
    return Response(content=encoded_img.tobytes(), media_type="image/png")

@app.post("/remove-watermark", dependencies=[Depends(verify_token)])
async def remove_watermark(image: UploadFile = File(...), method: str = Form("standard")):
    contents = await image.read()
    
    if method == "gemini":
        if not GOOGLE_CLOUD_API_KEY:
            raise HTTPException(status_code=400, detail="Google Cloud API Key not configured on server.")
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = "Please remove any watermarks from this image and return the clean version. If you cannot return the image, describe exactly where the watermarks are in [x1, y1, x2, y2] format."
            response = model.generate_content([prompt, {"mime_type": "image/png", "data": contents}])
            # Note: Gemini usually returns text description for mask or improved bounding boxes.
            # Inpainting logic follows.
            pass 
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

    # Standard / Fallback logic
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    results = reader.readtext(img)
    mask = np.zeros(img.shape[:2], dtype=np.uint8)

    for (bbox, text, prob) in results:
        (tl, tr, br, bl) = bbox
        tl = (int(tl[0]), int(tl[1]))
        br = (int(br[0]), int(br[1]))
        cv2.rectangle(mask, tl, br, 255, thickness=-1)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    mask = cv2.dilate(mask, kernel, iterations=1)
    inpainted_img = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)

    _, encoded_img = cv2.imencode('.png', inpainted_img)
    return Response(content=encoded_img.tobytes(), media_type="image/png")

@app.post("/remove-background", dependencies=[Depends(verify_token)])
async def remove_background_api(image: UploadFile = File(...)):
    contents = await image.read()
    output_image_bytes = remove(contents) 
    return Response(content=output_image_bytes, media_type="image/png")
