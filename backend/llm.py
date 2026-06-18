"""Chat completions via OpenRouter (OpenAI-compatible). Used by the agents."""
import json
import urllib.error
import urllib.request
from typing import List, Optional

from . import config


def chat_configured() -> bool:
    return bool(config.OPENROUTER_API_KEY)


def chat_completion(messages: List[dict], system: Optional[str] = None,
                    temperature: float = 0.7, model: Optional[str] = None,
                    response_json: bool = False) -> str:
    """`messages` = [{"role": "user"|"assistant", "content": ...}]. Returns the reply text."""
    if not config.OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")
    msgs = ([{"role": "system", "content": system}] if system else []) + messages
    payload = {"model": model or config.CHAT_MODEL, "messages": msgs, "temperature": temperature}
    if response_json:
        payload["response_format"] = {"type": "json_object"}

    req = urllib.request.Request(
        config.OPENROUTER_BASE_URL.rstrip("/") + "/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Hackathon Companion",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"] or ""
