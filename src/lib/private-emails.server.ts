// Server-only: addresses live in project secrets, never in the public repo.

function list(name: string): string[] {
  return String(process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function stewardEmails(): string[] {
  return list("STEWARD_EMAILS");
}

export function isSteward(email: unknown): boolean {
  const e = String(email ?? "").trim().toLowerCase();
  if (!e) return false;
  return stewardEmails().includes(e);
}

export function assertSteward(email: unknown): string {
  const e = String(email ?? "").trim().toLowerCase();
  if (!isSteward(e)) throw new Error("Forbidden");
  return e;
}

export function adminNotifyEmails(): string[] {
  return list("ADMIN_NOTIFY_EMAILS");
}

export function potluckNotifyEmail(): string {
  return list("POTLUCK_NOTIFY_EMAIL")[0] ?? "";
}

export function feedbackSummaryEmails(): string[] {
  return list("FEEDBACK_SUMMARY_EMAILS");
}
