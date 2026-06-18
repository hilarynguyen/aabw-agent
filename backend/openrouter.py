"""Quick manual test for OpenRouter (chat Q&A + embedding sanity check).

Run from the project root:
    python backend/openrouter.py
    python backend/openrouter.py "Thủ đô của Việt Nam là gì?"

Needs OPENROUTER_API_KEY in the root .env. Override models via env if needed:
    OPENROUTER_CHAT_MODEL (default openai/gpt-4o-mini)
    EMBED_MODEL           (default qwen/qwen3-embedding-8b)
"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY = os.getenv("OPENROUTER_API_KEY", "")
BASE_URL = os.getenv("EMBED_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
# CHAT_MODEL = os.getenv("OPENROUTER_CHAT_MODEL", "openai/gpt-4o-mini")
CHAT_MODEL = os.getenv("OPENROUTER_CHAT_MODEL", "nvidia/nemotron-3-super-120b-a12b:free")
EMBED_MODEL = os.getenv("EMBED_MODEL", "qwen/qwen3-embedding-8b")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Hackathon Companion",
}


def _post(path: str, payload: dict) -> dict:
    req = urllib.request.Request(
        BASE_URL + path, data=json.dumps(payload).encode("utf-8"),
        method="POST", headers=HEADERS,
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
        raise SystemExit(f"❌ HTTP {e.code} from {path}:\n{body}")


def ask(question: str) -> str:
    data = _post("/chat/completions", {
        "model": CHAT_MODEL,
        "messages": [{"role": "user", "content": question}],
    })
    return data["choices"][0]["message"]["content"]


def embed(text: str) -> list:
    data = _post("/embeddings", {"model": EMBED_MODEL, "input": text})
    return data["data"][0]["embedding"]


if __name__ == "__main__":
    if not API_KEY:
        raise SystemExit("❌ OPENROUTER_API_KEY chưa được set trong .env")

    question = sys.argv[1] if len(sys.argv) > 1 else "Chào bạn! Nói cho mình một câu vui về hackathon nhé."

    print(f"🔑 key: ...{API_KEY[-6:]}   base: {BASE_URL}")
    print(f"\n💬 [chat: {CHAT_MODEL}]\nQ: {question}")
    print("A:", ask(question))

    print(f"\n🧮 [embed: {EMBED_MODEL}]")
    vec = embed("React developer interested in AI agents")
    print(f"   dimension: {len(vec)}   first 5: {[round(x, 4) for x in vec[:5]]}")
    print("\n✅ OpenRouter OK")
