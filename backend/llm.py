"""Chat completions via OpenRouter (OpenAI-compatible). Used by the agents."""
import json
import urllib.error
import urllib.request
from typing import Callable, List, Optional

from . import config


def chat_configured() -> bool:
    return bool(config.OPENROUTER_API_KEY)


def _post(payload: dict) -> dict:
    """POST a chat-completions request and return the parsed JSON response."""
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
        return json.loads(r.read().decode("utf-8"))


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
    data = _post(payload)
    return data["choices"][0]["message"]["content"] or ""


def chat_with_tools(messages: List[dict], system: Optional[str], tools: List[dict],
                    handlers: dict[str, Callable[[dict], dict]], temperature: float = 0.7,
                    model: Optional[str] = None, max_rounds: int = 4) -> str:
    """Run a chat with OpenAI-style tool-calling. `tools` is the JSON tool schema list;
    `handlers` maps tool name → fn(args_dict) -> result_dict. Loops: call the model, and
    while it returns tool_calls, execute each handler and feed the results back, until it
    produces a final text reply (or max_rounds is hit). Returns the final reply text."""
    if not config.OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")
    convo = ([{"role": "system", "content": system}] if system else []) + list(messages)

    for _ in range(max_rounds):
        payload = {
            "model": model or config.OPENROUTER_TOOL_MODEL,
            "messages": convo,
            "temperature": temperature,
            "tools": tools,
            "tool_choice": "auto",
        }
        data = _post(payload)
        msg = data["choices"][0]["message"]
        tool_calls = msg.get("tool_calls") or []
        if not tool_calls:
            return msg.get("content") or ""

        # Echo the assistant's tool-call turn, then append each tool result.
        convo.append({"role": "assistant", "content": msg.get("content") or "",
                      "tool_calls": tool_calls})
        for call in tool_calls:
            name = call.get("function", {}).get("name", "")
            try:
                args = json.loads(call.get("function", {}).get("arguments") or "{}")
            except (ValueError, TypeError):
                args = {}
            handler = handlers.get(name)
            result = handler(args) if handler else {"error": f"Unknown tool: {name}"}
            convo.append({"role": "tool", "tool_call_id": call.get("id"),
                          "content": json.dumps(result)})

    # Ran out of rounds — ask once more without tools for a clean text wrap-up.
    final = _post({"model": model or config.OPENROUTER_TOOL_MODEL, "messages": convo,
                   "temperature": temperature})
    return final["choices"][0]["message"].get("content") or ""
