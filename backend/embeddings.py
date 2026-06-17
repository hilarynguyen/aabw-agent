"""Embeddings via an OpenAI-compatible endpoint (default OpenRouter → Qwen3-Embedding-8B)
+ pgvector formatting helpers. Vectors are truncated + L2-normalized to EMBED_DIM (MRL)."""
import json
import math
import urllib.request
from typing import List

from . import config
from .models import ProfileFields


def embeddings_configured() -> bool:
    return bool(config.EMBED_API_KEY)


def build_profile_text(f: ProfileFields) -> str:
    parts: List[str] = []
    if f.currentRole:
        parts.append(f"Role: {f.currentRole}")
    if f.desiredRole:
        parts.append(f"Wants teammates who are: {f.desiredRole}")
    if f.domain:
        parts.append(f"Domain: {f.domain}")
    if f.skills:
        parts.append(f"Skills: {', '.join(f.skills)}")
    if f.interests:
        parts.append(f"Interests: {', '.join(f.interests)}")
    if f.goals:
        parts.append(f"Goal: {f.goals}")
    if f.commitment:
        parts.append(f"Commitment: {f.commitment}")
    if f.selectionCriteria:
        parts.append(f"Looks for: {f.selectionCriteria}")
    if f.status:
        parts.append(f"Status: {f.status}")
    return ". ".join(parts)


def build_seed_text(row: dict) -> str:
    return ". ".join(filter(None, [
        f"Role: {row.get('role','')}",
        f"Wants teammates who are: {row.get('desired_role','')}",
        f"Domain: {row.get('domain','')}",
        f"Skills: {', '.join(row.get('skills', []))}",
        f"Interests: {', '.join(row.get('interests', []))}",
        f"Status: {row.get('status','')}",
        row.get("bio", ""),
    ]))


def _truncate_normalize(vec: List[float]) -> List[float]:
    """MRL truncate to EMBED_DIM then L2-normalize (so cosine works on the shorter vector)."""
    v = [float(x) for x in vec[:config.EMBED_DIM]]
    norm = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / norm for x in v]


def embed_text(text: str) -> List[float]:
    """Embed text via the configured OpenAI-compatible endpoint (OpenRouter/Qwen3 by default).
    Raises RuntimeError if no embeddings API key is set."""
    if not config.EMBED_API_KEY:
        raise RuntimeError("Embeddings API key not configured (set OPENROUTER_API_KEY).")
    body = json.dumps({"model": config.EMBED_MODEL, "input": text}).encode("utf-8")
    req = urllib.request.Request(
        config.EMBED_BASE_URL.rstrip("/") + "/embeddings",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {config.EMBED_API_KEY}",
            "Content-Type": "application/json",
            # OpenRouter recommends these (optional) attribution headers:
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Hackathon Companion",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    vec = data["data"][0]["embedding"]
    return _truncate_normalize(vec)


def vec_to_pg(vec: List[float]) -> str:
    """pgvector input literal, e.g. '[0.1,0.2,...]' (PostgREST-friendly)."""
    return "[" + ",".join(str(x) for x in vec) + "]"
