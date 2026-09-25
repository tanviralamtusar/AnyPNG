"""Small PostgREST/Auth helper shared by the API modules.

Kept separate so both the credit code in main.py and the licensing code can
issue Supabase requests without one importing the other.
"""

import json
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv

# main.py imports this module before it calls load_dotenv(), so load here too.
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


def json_request(url: str, method: str, headers: dict[str, str], body: object | None = None) -> object:
    payload = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            raw = response.read()
            return json.loads(raw.decode("utf-8")) if raw else None
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase request failed ({exc.code}): {detail[:300]}") from exc


def service_headers() -> dict[str, str]:
    """Headers for a service-role call. Never reachable from the extension."""
    if not SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not configured on the API")
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }


def rpc(name: str, payload: dict) -> object:
    """Call a Postgres function through PostgREST with the service-role key."""
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured on the API")
    return json_request(f"{SUPABASE_URL}/rest/v1/rpc/{name}", "POST", service_headers(), payload)
