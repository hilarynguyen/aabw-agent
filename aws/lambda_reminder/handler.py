"""Reminder dispatch Lambda for AGENTIC AI BUILD WEEK 2026 (Orbit).

Invoked by an EventBridge Scheduler one-shot schedule (or directly by the FastAPI
backend for an immediate send) with event = {"reminder_id": "<uuid>"}. Reads the row
from Supabase, sends an email (Gmail SMTP) or Telegram message, then marks the row
sent / error. Uses only the Python stdlib so the deployment zip needs no dependencies.

Required env vars:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
  GMAIL_USER, GMAIL_APP_PASSWORD          (for channel == 'email')
  TELEGRAM_BOT_TOKEN                       (for channel == 'telegram')
"""
import json
import os
import smtplib
import urllib.parse
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
GMAIL_USER = os.environ.get("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")


def _sb_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


def _urlopen(req, timeout=20):
    """urlopen that surfaces the HTTP response body in the raised error (PostgREST /
    Telegram put the real reason there, not in the status line)."""
    try:
        return urllib.request.urlopen(req, timeout=timeout)
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8")[:500]
        except Exception:
            pass
        raise RuntimeError(f"HTTP {e.code} {req.get_method()} {req.full_url} -> {body or e.reason}")


def _fetch_reminder(reminder_id):
    url = f"{SUPABASE_URL}/rest/v1/reminders?id=eq.{urllib.parse.quote(reminder_id)}&select=*"
    req = urllib.request.Request(url, headers=_sb_headers(), method="GET")
    with _urlopen(req) as r:
        rows = json.loads(r.read().decode("utf-8"))
    return rows[0] if rows else None


def _update_reminder(reminder_id, patch):
    url = f"{SUPABASE_URL}/rest/v1/reminders?id=eq.{urllib.parse.quote(reminder_id)}"
    req = urllib.request.Request(
        url, data=json.dumps(patch).encode("utf-8"),
        headers={**_sb_headers(), "Prefer": "return=minimal"}, method="PATCH")
    _urlopen(req).read()


GMT7 = timezone(timedelta(hours=7))


def _fmt_vn(iso):
    """Format an ISO timestamp as readable Vietnam time (GMT+7)."""
    try:
        dt = datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=GMT7)
        return dt.astimezone(GMT7).strftime("%H:%M, %d/%m/%Y") + " (GMT+7)"
    except Exception:
        return str(iso)


def _build_message(r):
    title = r.get("title") or "Deadline reminder"
    deadline = r.get("deadline") or ""
    location = r.get("location") or ""
    note = r.get("note") or ""
    lines = [f"⏰ Reminder: {title}"]
    if deadline:
        lines.append(f"Deadline: {_fmt_vn(deadline)}")
    if location:
        lines.append(f"Location: {location}")
    if note:
        lines.append(note)
    lines.append("\n— Orbit, AGENTIC AI BUILD WEEK 2026")
    return title, "\n".join(lines)


def _send_email(to_addr, subject, body):
    if not (GMAIL_USER and GMAIL_APP_PASSWORD):
        raise RuntimeError("GMAIL_USER / GMAIL_APP_PASSWORD not configured.")
    msg = EmailMessage()
    msg["From"] = GMAIL_USER
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg.set_content(body)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)


def _send_telegram(chat_id, text):
    if not TELEGRAM_BOT_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN not configured.")
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=payload,
                                 headers={"Content-Type": "application/json"}, method="POST")
    with _urlopen(req) as r:
        json.loads(r.read().decode("utf-8"))


def handler(event, context):
    reminder_id = (event or {}).get("reminder_id")
    if not reminder_id:
        return {"ok": False, "error": "missing reminder_id"}

    try:
        r = _fetch_reminder(reminder_id)
        if not r:
            return {"ok": False, "error": "reminder not found"}

        subject, body = _build_message(r)
        channel = (r.get("channel") or "").lower()
        recipient = r.get("recipient") or ""

        if channel == "email":
            _send_email(recipient, subject, body)
        elif channel == "telegram":
            _send_telegram(recipient, body)
        else:
            raise RuntimeError(f"Unsupported channel: {channel}")

        _update_reminder(reminder_id, {"status": "sent",
                                       "sent_at": datetime.now(timezone.utc).isoformat(),
                                       "error": ""})
        return {"ok": True, "channel": channel}
    except Exception as err:  # noqa: BLE001
        try:
            _update_reminder(reminder_id, {"status": "error", "error": str(err)[:500]})
        except Exception:
            pass
        return {"ok": False, "error": str(err)}
