"""Environment configuration. Loaded from the project root .env (same file the
frontend/Node used). All secrets are server-side only — never exposed to the client."""
import os
from pathlib import Path

from dotenv import load_dotenv

# Load the project-root .env (backend/ is one level below root).
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# URL is the same for client + server; fall back to the VITE_ one to avoid duplication.
SUPABASE_URL = os.getenv("SUPABASE_URL", "") or os.getenv("VITE_SUPABASE_URL", "")
# Writes need the SECRET service-role key (anon is blocked by RLS) — server-only.
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
VITE_GOOGLE_CLIENT_ID = os.getenv("VITE_GOOGLE_CLIENT_ID", "")

# --- OpenRouter (chat + embeddings, OpenAI-compatible) ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "") or os.getenv("EMBEDDINGS_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", os.getenv("EMBED_BASE_URL", "https://openrouter.ai/api/v1"))

# Chat model (agents Luna/Orbit/Sage).
CHAT_MODEL = os.getenv("OPENROUTER_CHAT_MODEL", "nvidia/nemotron-3-super-120b-a12b:free")

# Embeddings. Qwen3-Embedding-8B is 4096-dim natively but MRL-trained, so we
# truncate+normalize to EMBED_DIM (<=2000 so pgvector HNSW can index it).
EMBED_MODEL = os.getenv("EMBED_MODEL", "qwen/qwen3-embedding-8b")
EMBED_DIM = int(os.getenv("EMBED_DIM", "1024"))

# Back-compat aliases used by embeddings.py
EMBED_API_KEY = OPENROUTER_API_KEY
EMBED_BASE_URL = OPENROUTER_BASE_URL

# Directory that holds the built SPA (served in production).
DIST_DIR = ROOT / "dist"
