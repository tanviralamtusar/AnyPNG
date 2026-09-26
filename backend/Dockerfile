# Use a lightweight Python image
FROM python:3.12-slim

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
COPY main.py licensing.py supabase_rest.py admin.html email-logo.png .

# Expose the port FastAPI will run on
EXPOSE 8000

# Coolify's rolling update waits for .State.Health, which only exists when the
# image defines a HEALTHCHECK. Python rather than curl: the slim image has no curl.
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/ping', timeout=4)" || exit 1

# Command to run the API. --proxy-headers makes request.client the real user's
# address (X-Forwarded-For from the reverse proxy), which the auth proxy forwards
# to Supabase for per-user rate limits. It trusts any caller's header, so port
# 8000 must only be reachable through the reverse proxy, never published directly.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]
