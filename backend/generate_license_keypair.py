"""Print a new Ed25519 key pair for signing license entitlement tokens.

    python backend/generate_license_keypair.py

Put LICENSE_SIGNING_KEY in the API's environment and paste the public key into
RM_LICENSE_PUBLIC_KEY in extension/scripts/license.js and offscreen.js. Both
halves must change together: an extension holding the old public key rejects
every token the new private key signs, locking every user out of the local tools.
"""

import base64

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, NoEncryption, PrivateFormat, PublicFormat


def b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode().rstrip("=")


key = Ed25519PrivateKey.generate()
private = key.private_bytes(Encoding.Raw, PrivateFormat.Raw, NoEncryption())
public = key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)

print(f"LICENSE_SIGNING_KEY={b64(private)}")
print(f"RM_LICENSE_PUBLIC_KEY={b64(public)}")
