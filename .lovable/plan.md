## What's going on

Every failed row in `email_send_log` is for the `admin-notification` template going to `joshuanesbit@gmail.com`. The original failure is a single `400 missing_unsubscribe`:

> Transactional emails must include an unsubscribe_token

After that, every retry hits `409 run_failed` ("Send again with a new idempotency key") because the queue keeps retrying the same payload — so one bad send balloons into ~40 failed rows and 8 DLQ rows.

## Root cause

`src/routes/api/public/notify-submission.ts` enqueues the admin email directly into pgmq without an `unsubscribe_token`. The Lovable email API requires one on every transactional send. The canonical send route (`src/routes/lovable/email/transactional/send.ts`) handles this by looking up or creating a token in `email_unsubscribe_tokens` before enqueuing — the notify-submission route was scaffolded earlier and skipped that step.

Idempotency amplifies the problem: `idempotency_key` is set to `messageId`, so once the first attempt is marked failed at the provider, subsequent retries with the same key are rejected with 409 until TTL expires and the message moves to DLQ.

## Fix

Update `src/routes/api/public/notify-submission.ts` to mirror the token logic in the canonical send route:

1. Normalize the recipient email (lowercase).
2. Look up an existing unused token in `email_unsubscribe_tokens`; if none, generate a 32-byte hex token and upsert with `onConflict: 'email', ignoreDuplicates: true`, then re-read to handle races.
3. Include `unsubscribe_token: <token>` in the pgmq payload passed to `enqueue_email`.
4. On token lookup/create failure, log a `failed` row and return 500 (same pattern as send.ts).

No other files need to change. The queue processor, template, and infrastructure are all correct.

## Cleanup of existing stuck messages

The 8 `pending` rows correspond to messages still in the pgmq `transactional_emails` queue that are poisoned by the old payload (no token, reused idempotency key). Options:

- Leave them: they'll TTL out to DLQ within the hour and stop generating failures. Simplest.
- Purge them: delete the pgmq messages so no further 409s are logged before TTL.

Recommend leaving them and letting the queue drain naturally — new submissions after the fix will succeed on first try. If you want, I can also purge the queue as part of the same change.

## Verification

After the change, submitting a contact form (or signup/idea) will:
- Insert a row in `email_unsubscribe_tokens` for `joshuanesbit@gmail.com` if not already present.
- Enqueue with `unsubscribe_token` set.
- Land as `status='sent'` in `email_send_log` on the next 5-second cron tick.

I'll confirm by watching `email_send_log` for a new `sent` row after a test submission.
