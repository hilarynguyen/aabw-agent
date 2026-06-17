"""Google Identity Services token verification (ports /api/auth/google).
Uses Google's tokeninfo endpoint — validates signature/expiry and (when set) audience."""
import json
import urllib.parse
import urllib.request

from fastapi import APIRouter, HTTPException

from .. import config
from ..models import GoogleAuthIn

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/google")
def google_auth(body: GoogleAuthIn):
    if not body.credential:
        raise HTTPException(400, "Missing Google credential.")
    url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + urllib.parse.quote(body.credential)
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            payload = json.loads(r.read().decode("utf-8"))
    except Exception:
        raise HTTPException(401, "Invalid or expired Google token.")

    if config.VITE_GOOGLE_CLIENT_ID and payload.get("aud") != config.VITE_GOOGLE_CLIENT_ID:
        raise HTTPException(401, "Google token audience mismatch.")
    if payload.get("email_verified") == "false":
        raise HTTPException(401, "Google email is not verified.")

    return {"user": {
        "sub": payload.get("sub"),
        "name": payload.get("name") or payload.get("email"),
        "email": payload.get("email"),
        "picture": payload.get("picture"),
    }}
