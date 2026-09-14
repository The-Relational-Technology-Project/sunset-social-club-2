// Server-only helpers for the /eventfeedback quick feedback form.
import { getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FROM = "Sunset Social Club <notifications@sunsetsocialclub.org>";
const REPLY_TO = "oursunsetsocialclub@gmail.com";
import { feedbackSummaryEmails } from "./private-emails.server";

// Rate limit: the form is meant to run on a shared tablet at an event, so the
// window is generous — it only blocks obvious spam bursts.
const WINDOW_MINUTES = 60;
const MAX_PER_WINDOW = 120;

// A summary goes out once at least this many unsummarized responses exist and
// the oldest of them is this old.
const MIN_RESPONSES = 2;
const SUMMARY_DELAY_HOURS = 24;

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`eventfeedback:${ip}`),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function clientIp(): string {
  const fwd = getRequestHeader("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return (
    first || getRequestHeader("cf-connecting-ip") || getRequestHeader("x-real-ip") || "unknown"
  );
}

export async function processEventFeedback(input: {
  metNeighbor: boolean;
  wouldRecommend: boolean;
}) {
  const ipHash = await hashIp(clientIp());
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count } = await supabaseAdmin
    .from("quick_event_feedback")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return { ok: false as const, rateLimited: true as const };
  }

  const { error } = await supabaseAdmin.from("quick_event_feedback").insert({
    met_neighbor: input.metNeighbor,
    would_recommend: input.wouldRecommend,
    ip_hash: ipHash,
  });
  if (error) throw new Error(error.message);

  return { ok: true as const, rateLimited: false as const };
}

/**
 * Sends one summary email covering every response that has not been summarized
 * yet, but only once there are at least MIN_RESPONSES of them and the oldest is
 * at least SUMMARY_DELAY_HOURS old. Called on a schedule.
 */
export async function sendEventFeedbackSummary() {
  const { data: rows, error } = await supabaseAdmin
    .from("quick_event_feedback")
    .select("id, met_neighbor, would_recommend, created_at")
    .is("summarized_at", null)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!rows || rows.length < MIN_RESPONSES) {
    return { sent: false as const, reason: "not_enough_responses" as const };
  }

  const oldest = new Date(rows[0].created_at).getTime();
  if (Date.now() - oldest < SUMMARY_DELAY_HOURS * 60 * 60 * 1000) {
    return { sent: false as const, reason: "waiting" as const };
  }

  const total = rows.length;
  const metYes = rows.filter((r) => r.met_neighbor).length;
  const recYes = rows.filter((r) => r.would_recommend).length;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;
  const first = new Date(rows[0].created_at).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  const last = new Date(rows[total - 1].created_at).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) throw new Error("RESEND_API_KEY missing");

  const html = `
    <div style="font-family:Nunito,Arial,sans-serif;max-width:640px;padding:24px;">
      <h1 style="font-size:20px;margin:0 0 8px;">Member Feedback summary</h1>
      <p style="margin:0 0 20px;color:#555;">${total} responses, ${first} to ${last} (Pacific)</p>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Met at least one neighbor</div>
        <div style="font-size:16px;color:#000;">Yes: ${metYes} of ${total} (${pct(metYes)})</div>
      </div>
      <div>
        <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Would recommend to a friend</div>
        <div style="font-size:16px;color:#000;">Yes: ${recYes} of ${total} (${pct(recYes)})</div>
      </div>
    </div>`;
  const text = [
    `Member Feedback summary`,
    `${total} responses, ${first} to ${last} (Pacific)`,
    ``,
    `Met at least one neighbor - Yes: ${metYes} of ${total} (${pct(metYes)})`,
    `Would recommend to a friend - Yes: ${recYes} of ${total} (${pct(recYes)})`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: feedbackSummaryEmails(),
      reply_to: REPLY_TO,
      subject: `Member Feedback summary: ${total} responses`,
      html,
      text,
      tags: [{ name: "template", value: "event-feedback-summary" }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }

  const { error: markError } = await supabaseAdmin
    .from("quick_event_feedback")
    .update({ summarized_at: new Date().toISOString() })
    .in(
      "id",
      rows.map((r) => r.id),
    );
  if (markError) {
    console.error("Failed to mark feedback rows as summarized", markError.message);
  }

  return { sent: true as const, total };
}
