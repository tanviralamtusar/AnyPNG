# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# ffmpeg merges YouTube's separate video/audio streams and converts audio to MP3.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

# yt-dlp needs a JavaScript runtime (with yt-dlp-ejs) to solve YouTube's player challenges.
COPY --from=denoland/deno:bin /deno /usr/local/bin/deno

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY main.py .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
