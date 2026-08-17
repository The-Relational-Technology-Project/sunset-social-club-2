// Server-only helpers for the /potluck form.
import { getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const NOTIFY_TO = "joshuanesbit@gmail.com";
const FROM = "Sunset Social Club <notifications@sunsetsocialclub.org>";
const REPLY_TO = "oursunsetsocialclub@gmail.com";

// Rate limit: max submissions per IP per window.
const WINDOW_MINUTES = 60;
const MAX_PER_WINDOW = 5;

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`potluck:${ip}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function clientIp(): string {
  const fwd = getRequestHeader("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return first || getRequestHeader("cf-connecting-ip") || getRequestHeader("x-real-ip") || "unknown";
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendNotification(name: string, bringing: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;
  const html = `
    <div style="font-family:Nunito,Arial,sans-serif;max-width:640px;padding:24px;">
      <h1 style="font-size:20px;margin:0 0 16px;">New potluck signup</h1>
      <div style="margin-bottom:14px;">
        <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Name</div>
        <div style="font-size:15px;color:#000;">${escape(name)}</div>
      </div>
      <div>
        <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Bringing</div>
        <div style="font-size:15px;color:#000;white-space:pre-wrap;">${escape(bringing)}</div>
      </div>
    </div>`;
  const text = `New potluck signup\n\nName:\n${name}\n\nBringing:\n${bringing}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      reply_to: REPLY_TO,
      subject: `New potluck signup: ${name}`,
      html,
      text,
      tags: [{ name: "template", value: "potluck-signup" }],
    }),
  });
  if (!res.ok) console.warn("potluck notify failed", res.status, await res.text());
}

export async function processPotluck(input: { name: string; bringing: string }) {
  const ipHash = await hashIp(clientIp());
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count } = await supabaseAdmin
    .from("potluck_signups")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return { ok: false as const, rateLimited: true as const };
  }

  const { error } = await supabaseAdmin
    .from("potluck_signups")
    .insert({ name: input.name, bringing: input.bringing, ip_hash: ipHash });
  if (error) throw new Error(error.message);

  try {
    await sendNotification(input.name, input.bringing);
  } catch (e) {
    console.warn("potluck notification failed", e);
  }

  return { ok: true as const, rateLimited: false as const };
}
