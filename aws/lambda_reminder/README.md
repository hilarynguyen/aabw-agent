# Reminder Lambda (Orbit deadline reminders)

Sends a deadline reminder via **Gmail (SMTP)** or **Telegram (Bot API)**. Invoked by an
AWS EventBridge Scheduler one-shot schedule (created by the FastAPI backend) at `fire_at`,
or directly by the backend for an immediate send. Reads/updates the reminder row in Supabase.

Stdlib only — the zip needs **no dependencies**.

---

## Option A — One-shot deploy with AWS SAM (recommended)

`template.yaml` provisions **everything at once**: the Lambda (+ execution role), the
EventBridge Scheduler role, and a backend IAM user/policy + access key. Requires the
[AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

```bash
cd aws/lambda_reminder
sam build
# Pass secrets on the CLI so they aren't stored in samconfig.toml:
sam deploy \
  --parameter-overrides \
    GmailUser=you@gmail.com \
    GmailAppPassword=xxxxxxxxxxxxxxxx \
    TelegramBotToken=123456:ABC \
    SupabaseUrl=https://xxx.supabase.co \
    SupabaseServiceRoleKey=eyJ...
```

When it finishes, copy the **Outputs** into the backend env (`.env` / Vercel):

| Stack output | Backend env var |
|---|---|
| `ReminderLambdaArn` | `REMINDER_LAMBDA_ARN` |
| `SchedulerRoleArn` | `EVENTBRIDGE_SCHEDULER_ROLE_ARN` |
| `BackendAccessKeyId` | `AWS_ACCESS_KEY_ID` |
| `BackendSecretAccessKey` | `AWS_SECRET_ACCESS_KEY` |

Also set `AWS_REGION=ap-southeast-1` and `OPENROUTER_TOOL_MODEL=qwen/qwen3-235b-a22b`.
View outputs again anytime: `sam list stack-outputs --stack-name aabw-reminder`.
Update later: re-run `sam build && sam deploy`. Tear down: `sam delete --stack-name aabw-reminder`.

> ⚠️ Don't commit `samconfig.toml` with real secrets, and the `BackendSecretAccessKey`
> output is readable in the CloudFormation console — fine for a hackathon, rotate for prod.

Then continue at **"Test manually"** below. Skip Options below (they're the manual equivalent).

---

## Option B — Manual CLI

### 1. Package & deploy

```bash
cd aws/lambda_reminder
zip function.zip handler.py
aws lambda create-function \
  --function-name aabw-reminder \
  --runtime python3.12 \
  --handler handler.handler \
  --role arn:aws:iam::<ACCOUNT_ID>:role/<lambda-exec-role> \
  --zip-file fileb://function.zip \
  --timeout 30
# update later: aws lambda update-function-code --function-name aabw-reminder --zip-file fileb://function.zip
```

The `<lambda-exec-role>` only needs the basic `AWSLambdaBasicExecutionRole` (CloudWatch logs).

## 2. Environment variables (on the Lambda)

| Var | Used for |
|---|---|
| `SUPABASE_URL` | read/update the reminder row |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase auth (service role) |
| `GMAIL_USER` | sender Gmail address (channel `email`) |
| `GMAIL_APP_PASSWORD` | Gmail **App Password** (not the account password) |
| `TELEGRAM_BOT_TOKEN` | BotFather token (channel `telegram`) |

> Gmail App Password requires 2FA enabled on the Google account → Security → App passwords.
> Telegram: create a bot with @BotFather; the recipient must `/start` the bot (or use a group chat id).

## 3. EventBridge Scheduler role (used by the backend, not the Lambda)

The backend's `EVENTBRIDGE_SCHEDULER_ROLE_ARN` must point at an IAM role that:
- **Trusts** `scheduler.amazonaws.com` (trust policy `sts:AssumeRole`).
- **Allows** `lambda:InvokeFunction` on `arn:aws:lambda:<region>:<acct>:function:aabw-reminder`.

Backend env (FastAPI / Vercel): `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
`REMINDER_LAMBDA_ARN`, `EVENTBRIDGE_SCHEDULER_ROLE_ARN`. The backend AWS credentials need
`scheduler:CreateSchedule` (+ `iam:PassRole` for the scheduler role) and `lambda:InvokeFunction`.

## 4. Test manually

```bash
aws lambda invoke --function-name aabw-reminder \
  --payload '{"reminder_id":"<uuid-from-supabase>"}' /dev/stdout
```
