# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies required by OpenCV and EasyOCR
RUN apt-get update && apt-get install -y \
    wget \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Download the EDSR 2x Upscaling Model directly into the image
RUN wget https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x2.pb

# Install CPU-only PyTorch FIRST so easyocr reuses it instead of pulling the
# ~2-3 GB CUDA build (nvidia-* wheels) we don't need on a CPU server.
RUN pip install --no-cache-dir torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install them. rembg pulls in opencv-python-headless;
# we reinstall opencv-contrib-python-headless LAST so its cv2 (which includes
# the dnn_superres module used for EDSR upscaling) is the one that wins.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir --force-reinstall opencv-contrib-python-headless

# Pre-download the EasyOCR models at build time so the container does not need
# network access on startup (otherwise easyocr.Reader() downloads ~64 MB on the
# first run, which crash-loops in a locked-down container).
RUN python -c "import easyocr; easyocr.Reader(['en'], gpu=False)"

# Copy your application code
COPY main.py .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
