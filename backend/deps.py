"""Lazy, graceful-degrade clients for Gemini and Supabase.

Mirrors the Node `getGeminiClient()` idiom: clients are built on first use and the
app still boots when env vars are missing — the affected routes return 503 instead."""
from typing import Optional

from . import config

_genai_client = None
_supabase_client = None


def get_genai():
    """Return a google-genai Client, or None if GEMINI_API_KEY is unset."""
    global _genai_client
    if _genai_client is not None:
        return _genai_client
    if not config.GEMINI_API_KEY:
        return None
    from google import genai

    _genai_client = genai.Client(api_key=config.GEMINI_API_KEY)
    return _genai_client


def get_supabase():
    """Return a Supabase client (service role), or None if env is unset."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    if not config.SUPABASE_URL or not config.SUPABASE_SERVICE_ROLE_KEY:
        return None
    from supabase import create_client

    _supabase_client = create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client
