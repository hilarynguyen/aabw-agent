"""AWS EventBridge Scheduler — one-shot reminder firing.

For each reminder we create a single `at(...)` schedule that invokes the reminder
Lambda with the reminder id at fire_at, then auto-deletes itself. boto3 is imported
lazily so the backend still boots without it; missing AWS config degrades to a
"simulated" result (the Supabase row stays pending).
"""
import json
import re
import uuid
from datetime import datetime, timezone
from typing import Optional

from . import config

_scheduler_client = None
_lambda_client = None


def aws_configured() -> bool:
    return bool(config.REMINDER_LAMBDA_ARN and config.EVENTBRIDGE_SCHEDULER_ROLE_ARN)


def _client(service: str):
    """Lazy boto3 client. Returns None if boto3 isn't installed."""
    try:
        import boto3
    except ImportError:
        return None
    kwargs = {"region_name": config.AWS_REGION}
    if config.AWS_ACCESS_KEY_ID and config.AWS_SECRET_ACCESS_KEY:
        kwargs["aws_access_key_id"] = config.AWS_ACCESS_KEY_ID
        kwargs["aws_secret_access_key"] = config.AWS_SECRET_ACCESS_KEY
    return boto3.client(service, **kwargs)


def _get_scheduler():
    global _scheduler_client
    if _scheduler_client is None:
        _scheduler_client = _client("scheduler")
    return _scheduler_client


def _get_lambda():
    global _lambda_client
    if _lambda_client is None:
        _lambda_client = _client("lambda")
    return _lambda_client


def _schedule_name(reminder_id: str) -> str:
    # Schedule names allow [0-9a-zA-Z-_.]; keep it unique + traceable.
    safe = re.sub(r"[^0-9a-zA-Z\-_.]", "", str(reminder_id))[:40] or uuid.uuid4().hex[:12]
    return f"reminder-{safe}-{uuid.uuid4().hex[:6]}"


def _lambda_arn() -> str:
    return config.REMINDER_LAMBDA_ARN


def _invoke_lambda_now(reminder_id: str) -> Optional[str]:
    lam = _get_lambda()
    if lam is None:
        return None
    lam.invoke(
        FunctionName=_lambda_arn(),
        InvocationType="Event",  # async fire-and-forget
        Payload=json.dumps({"reminder_id": reminder_id}).encode("utf-8"),
    )
    return "immediate-invoke"


def schedule_reminder(reminder_id: str, fire_at: datetime) -> Optional[str]:
    """Create a one-shot EventBridge schedule firing the reminder Lambda at fire_at.
    If fire_at is already past, invoke the Lambda immediately instead. Returns the
    schedule name (or a marker), or None when AWS isn't configured (simulated)."""
    if not aws_configured():
        print(f"[aws_scheduler] simulated schedule for reminder {reminder_id} at {fire_at.isoformat()}")
        return None

    now = datetime.now(timezone.utc)
    if fire_at <= now:
        return _invoke_lambda_now(reminder_id)

    sched = _get_scheduler()
    if sched is None:
        print(f"[aws_scheduler] boto3 unavailable; simulated for reminder {reminder_id}")
        return None

    name = _schedule_name(reminder_id)
    # EventBridge `at(...)` wants a naive ISO datetime paired with a timezone.
    expr = f"at({fire_at.astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')})"
    sched.create_schedule(
        Name=name,
        ScheduleExpression=expr,
        ScheduleExpressionTimezone="UTC",
        FlexibleTimeWindow={"Mode": "OFF"},
        ActionAfterCompletion="DELETE",
        Target={
            "Arn": _lambda_arn(),
            "RoleArn": config.EVENTBRIDGE_SCHEDULER_ROLE_ARN,
            "Input": json.dumps({"reminder_id": reminder_id}),
        },
    )
    return name


def delete_schedule(schedule_name: str) -> None:
    """Delete a one-shot schedule (used when a pending reminder is cancelled).
    No-op for the immediate-invoke marker or when AWS/boto3 isn't available."""
    if not schedule_name or schedule_name == "immediate-invoke":
        return
    sched = _get_scheduler()
    if sched is None:
        return
    try:
        sched.delete_schedule(Name=schedule_name)
    except Exception as err:  # noqa: BLE001 (already-deleted / not-found is fine)
        print(f"[aws_scheduler] delete_schedule({schedule_name}) skipped: {err}")
