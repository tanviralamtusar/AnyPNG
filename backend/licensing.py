"""License keys: one key per purchase, one account, one active device.

The extension never reads the `licenses` table. Every transition runs inside a
Postgres function (`claim_license`, `touch_license`, `release_license`,
`mint_license`) called with the service-role key, so two devices racing to
activate the same key resolve to a single winner under a row lock.

Once a device is bound the API hands the extension a short-lived HMAC
entitlement token. Protected endpoints verify that token instead of hitting the
database on every request; its lifetime is the worst-case delay before a
revoked or moved license locks a stale device out.
"""

import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time

from supabase_rest import SUPABASE_URL, json_request, rpc, service_headers

# Crockford base32 without I, L, O and U: no character pair a user can confuse
# when copying a key out of a receipt email by hand.
KEY_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
KEY_PREFIX = "RM"
KEY_GROUPS = 4
KEY_GROUP_LEN = 4

LICENSE_TOKEN_SECRET = os.getenv("LICENSE_TOKEN_SECRET", "")
LICENSE_TOKEN_TTL = int(os.getenv("LICENSE_TOKEN_TTL_SECONDS", str(24 * 3600)))
LICENSE_SWITCH_COOLDOWN_HOURS = int(os.getenv("LICENSE_SWITCH_COOLDOWN_HOURS", "24"))
LICENSE_PURCHASE_URL = os.getenv("LICENSE_PURCHASE_URL", "")


class LicenseError(Exception):
    """A license problem the extension should show to the user."""

    def __init__(self, reason: str, message: str, status_code: int = 403, extra: dict | None = None):
        super().__init__(message)
        self.reason = reason
        self.message = message
        self.status_code = status_code
        self.extra = extra or {}


def generate_key() -> str:
    groups = [
        "".join(secrets.choice(KEY_ALPHABET) for _ in range(KEY_GROUP_LEN))
        for _ in range(KEY_GROUPS)
    ]
    return "-".join([KEY_PREFIX, *groups])


def normalize_device_id(device_id: str | None) -> str:
    """Device ids come from the client, so bound them before they reach the DB."""
    cleaned = re.sub(r"[^A-Za-z0-9._:-]", "", str(device_id or "")).strip()
    return cleaned[:128]


def normalize_device_label(label: str | None) -> str | None:
    cleaned = re.sub(r"\s+", " ", str(label or "")).strip()
    return cleaned[:80] or None


def _unwrap(result: object) -> dict:
    """PostgREST returns a bare JSON value for a function returning jsonb."""
    if isinstance(result, list):
        result = result[0] if result else None
    return result if isinstance(result, dict) else {}


# --- entitlement tokens -----------------------------------------------------

def _sign(encoded: str) -> str:
    if not LICENSE_TOKEN_SECRET:
        raise RuntimeError("LICENSE_TOKEN_SECRET is not configured on the API")
    signature = hmac.new(LICENSE_TOKEN_SECRET.encode(), encoded.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(signature).decode().rstrip("=")


def _b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def device_fingerprint(device_id: str) -> str:
    return hashlib.sha256(device_id.encode()).hexdigest()[:32]


def make_entitlement_token(user_id: str, device_id: str) -> str:
    payload = {
        "sub": user_id,
        "dev": device_fingerprint(device_id),
        "scope": "license",
        "exp": int(time.time()) + LICENSE_TOKEN_TTL,
    }
    encoded = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":")).encode()
    ).decode().rstrip("=")
    return f"{encoded}.{_sign(encoded)}"


def verify_entitlement_token(token: str, user_id: str) -> dict:
    """Return the token payload, or raise LicenseError.

    The token is bound to `user_id` so one licensed account cannot hand its
    token to another account's requests.
    """
    try:
        encoded, signature = str(token or "").split(".", 1)
        if not hmac.compare_digest(_sign(encoded), signature):
            raise ValueError("bad signature")
        payload = json.loads(_b64decode(encoded))
    except RuntimeError:
        raise
    except Exception as exc:
        raise LicenseError("invalid_token", "Your license could not be verified.", 403) from exc

    if payload.get("scope") != "license" or payload.get("sub") != user_id:
        raise LicenseError("invalid_token", "Your license could not be verified.", 403)
    if int(payload.get("exp") or 0) <= int(time.time()):
        raise LicenseError("expired_token", "Please reopen the extension to refresh your license.", 403)
    return payload


# --- state transitions ------------------------------------------------------

_STATUS_MESSAGES = {
    "invalid": "That license key was not recognised. Check it for typos.",
    "revoked": "This license key has been revoked. Contact support if that is unexpected.",
    "claimed_by_other": "That key is already registered to a different account.",
}


def activate(key: str, user_id: str, device_id: str, device_label: str | None) -> dict:
    device_id = normalize_device_id(device_id)
    if not device_id:
        raise LicenseError("bad_request", "This device could not be identified.", 400)

    result = _unwrap(rpc("claim_license", {
        "p_key": str(key or "")[:64],
        "p_user": user_id,
        "p_device": device_id,
        "p_label": normalize_device_label(device_label),
        "p_cooldown_hours": LICENSE_SWITCH_COOLDOWN_HOURS,
    }))
    status = result.get("status")

    if status == "ok":
        return {
            "licensed": True,
            "license": result.get("license"),
            "entitlement_token": make_entitlement_token(user_id, device_id),
            "expires_in": LICENSE_TOKEN_TTL,
        }
    if status == "cooldown":
        retry_after = int(result.get("retry_after") or 0)
        hours = max(1, round(retry_after / 3600))
        raise LicenseError(
            "cooldown",
            f"This key was moved to another device recently. You can move it again in about {hours} hour(s).",
            429,
            {"retry_after": retry_after, "license": result.get("license")},
        )
    raise LicenseError(
        status or "invalid",
        _STATUS_MESSAGES.get(status or "", "That license key could not be activated."),
        403,
    )


def status_for(user_id: str, device_id: str) -> dict:
    device_id = normalize_device_id(device_id)
    if not device_id:
        raise LicenseError("bad_request", "This device could not be identified.", 400)

    result = _unwrap(rpc("touch_license", {"p_user": user_id, "p_device": device_id}))
    if result.get("licensed"):
        return {
            "licensed": True,
            "license": result.get("license"),
            "entitlement_token": make_entitlement_token(user_id, device_id),
            "expires_in": LICENSE_TOKEN_TTL,
        }
    return {
        "licensed": False,
        "reason": result.get("reason") or "no_license",
        "license": result.get("license"),
        "purchase_url": LICENSE_PURCHASE_URL,
    }


def release(user_id: str, device_id: str) -> dict:
    result = _unwrap(rpc("release_license", {
        "p_user": user_id,
        "p_device": normalize_device_id(device_id),
    }))
    if result.get("status") == "no_license":
        raise LicenseError("no_license", "There is no license on this account.", 404)
    return {"licensed": False, "reason": "no_device", "license": result.get("license")}


def mint(provider: str | None, order_id: str | None, email: str | None) -> dict:
    """Create (or return the existing) key for an order. Idempotent per order."""
    for _ in range(5):
        try:
            result = _unwrap(rpc("mint_license", {
                "p_key": generate_key(),
                "p_provider": provider,
                "p_order_id": order_id,
                "p_email": email,
            }))
        except RuntimeError as exc:
            # Astronomically unlikely 80-bit key collision; just draw again.
            if "duplicate key" in str(exc).lower():
                continue
            raise
        if result.get("key"):
            return {"key": result["key"], "status": result.get("status")}
    raise RuntimeError("Could not allocate a unique license key")


# --- admin operations -------------------------------------------------------
#
# Reached only through the SECRET_TOKEN-gated endpoints in main.py. Each one is
# a thin wrapper over a SECURITY DEFINER function so the audit trail in
# license_events is written in the same transaction as the change.


def admin_list(query: str | None, limit: int, offset: int) -> dict:
    result = _unwrap(rpc("admin_list_licenses", {
        "p_query": (query or "").strip() or None,
        "p_limit": max(1, min(int(limit or 50), 200)),
        "p_offset": max(0, int(offset or 0)),
    }))
    return {"total": result.get("total", 0), "rows": result.get("rows", [])}


def admin_users(query: str | None, limit: int, offset: int) -> dict:
    """Accounts, with the profile name and whatever license each one holds."""
    result = _unwrap(rpc("admin_list_users", {
        "p_query": (query or "").strip() or None,
        "p_limit": max(1, min(int(limit or 50), 200)),
        "p_offset": max(0, int(offset or 0)),
    }))
    return {"total": result.get("total", 0), "rows": result.get("rows", [])}


def admin_events(key: str, limit: int = 50) -> list:
    result = rpc("admin_license_events", {"p_key": key, "p_limit": max(1, min(int(limit or 50), 200))})
    return result if isinstance(result, list) else []


def admin_issue(user_id: str, note: str | None) -> dict:
    """Mint a key already claimed by `user_id`.

    The account owns it immediately, so nobody else can redeem it; the user
    still enters it in the extension, which is what binds their device.
    """
    if not user_id:
        raise LicenseError("bad_request", "No account was selected.", 400)

    for _ in range(5):
        try:
            result = _unwrap(rpc("admin_issue_license", {
                "p_user": user_id,
                "p_key": generate_key(),
                "p_note": note,
            }))
        except RuntimeError as exc:
            if "duplicate key" in str(exc).lower():
                continue          # 80-bit key collision; draw again
            raise
        status = result.get("status")
        if status == "created":
            return {"status": "created", "key": result["key"], "email": result.get("email")}
        if status == "no_user":
            raise LicenseError("not_found", "That account no longer exists.", 404)
        if status == "already_licensed":
            raise LicenseError(
                "already_licensed",
                f"That account already holds {result.get('key')}. Revoke it first to issue a new one.",
                409,
                {"key": result.get("key")},
            )
        raise RuntimeError(f"Unexpected issue status: {status}")
    raise RuntimeError("Could not allocate a unique license key")


def admin_revoke(key: str, note: str | None) -> dict:
    result = _unwrap(rpc("admin_revoke_license", {"p_key": key, "p_note": note}))
    if result.get("status") == "not_found":
        raise LicenseError("not_found", "No license with that key.", 404)
    return {"status": "revoked", "key": result.get("key")}


def admin_release(key: str, note: str | None) -> dict:
    """Unbind the device and clear the cooldown, so the user can activate now."""
    result = _unwrap(rpc("admin_release_license", {"p_key": key, "p_note": note}))
    status = result.get("status")
    if status == "not_found":
        raise LicenseError("not_found", "No license with that key.", 404)
    if status == "revoked":
        raise LicenseError("revoked", "That key is revoked; releasing it would change nothing.", 409)
    return {"status": "released", "license": result.get("license")}


# Banning is Supabase Auth, not the license tables: it blocks sign-in entirely
# rather than just this product's entitlement.
BAN_FOREVER = "876000h"  # 100 years; Supabase has no "permanent" literal.


def admin_set_ban(user_id: str, banned: bool) -> dict:
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured on the API")
    if not user_id:
        raise LicenseError("not_found", "That license is not claimed by an account yet.", 404)
    data = json_request(
        f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
        "PUT",
        service_headers(),
        {"ban_duration": BAN_FOREVER if banned else "none"},
    )
    until = data.get("banned_until") if isinstance(data, dict) else None
    return {"status": "ok", "user_id": user_id, "banned": bool(banned), "banned_until": until}
