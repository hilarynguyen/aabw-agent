"""Vercel Python serverless entry point.

Vercel's `@vercel/python` runtime serves any module-level `app` that is an ASGI
application, so we simply re-export the existing FastAPI app. The `vercel.json`
rewrite sends every `/api/*` request here; FastAPI's own `/api/...` routes then
match because Vercel passes the original request path to the function.

In this deployment the SPA is served by Vercel's static CDN (the built `dist/`),
not by FastAPI — the catch-all in backend/main.py stays dormant because `dist/`
isn't bundled into the function.
"""
import os
import sys

# Ensure the repo root is on sys.path so the `backend` package is importable
# (the function's working directory may be the api/ folder).
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app  # noqa: E402,F401  (Vercel serves this ASGI `app`)
