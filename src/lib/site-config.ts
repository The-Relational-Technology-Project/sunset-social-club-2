// Site-wide constants. Edit values here, not in components.
import { supabase } from "../integrations/supabase/client";

export const CONTACT_EMAIL = "oursunsetsocialclub@gmail.com";
export const NOTIFY_EMAILS = ["oursunsetsocialclub@gmail.com", "joshuanesbit@gmail.com"];
export const EVENT_RSVP_URL = "https://luma.com/p6zop4tg";
export const COMMUNITY_PLAYLIST_URL = "https://open.spotify.com/playlist/1saGchZ6JVWKmFnianOtJM?si=IPO4mE9kSaCxOvqOTCUVEw";
export const PIZZA_PARTY_FEEDBACK_SLUG = "pizza-party-2026-07-22";
export const JULY_22_INSIGHTS_SLUG = "july-22-kickoff";

// Paste the iframe embed code from Luma here (luma.com/sunsetsocialclub → Embed).
export const LUMA_CALENDAR_EMBED = `<iframe src="https://luma.com/embed/calendar/cal-EktVbYQFoGMjT6M/events?lt=light" width="100%" height="600" frameborder="0" style="border: 1px solid #bfcbda88; border-radius: 12px; display: block;" allowfullscreen aria-hidden="false" tabindex="0"></iframe>`;

export type FormType = "signup" | "idea" | "contact";

async function notifyAdmin(type: string, fields: Array<{ label: string; value: string }>) {
  try {
    await fetch("/api/public/notify-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, fields }),
    });
  } catch (err) {
    console.warn("notifyAdmin failed", err);
  }
}

export async function submitForm(type: FormType, payload: Record<string, string>) {
  try {
    if (type === "signup") {
      const email = (payload.email ?? "").trim().slice(0, 255);
      const firstName = (payload.firstName ?? "").trim().slice(0, 100) || null;
      const crossStreets = (payload.crossStreets ?? "").trim().slice(0, 200) || null;
      if (!email) return { ok: false };
      const { error } = await supabase
        .from("email_signups")
        .insert({ email, first_name: firstName, cross_streets: crossStreets });
      if (error) throw error;
      void notifyAdmin("club member signup", [
        { label: "Email", value: email },
        { label: "First name", value: firstName ?? "" },
        { label: "Cross streets", value: crossStreets ?? "" },
      ]);
      // Send welcome email to the new member (fire and forget)
      void fetch("/api/public/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      }).catch((err) => console.warn("send-welcome failed", err));
    } else if (type === "idea") {
      const idea = (payload.idea ?? "").trim().slice(0, 1000);
      const name = (payload.name ?? "").trim().slice(0, 100);
      if (!idea || !name) return { ok: false };
      const { error } = await supabase.from("ideas").insert({ idea, name });
      if (error) throw error;
      void notifyAdmin("idea submission", [
        { label: "Name", value: name },
        { label: "Idea", value: idea },
      ]);
    } else if (type === "contact") {
      const name = (payload.name ?? "").trim().slice(0, 100);
      const email = (payload.email ?? "").trim().slice(0, 255);
      const message = (payload.message ?? "").trim().slice(0, 2000);
      if (!name || !email || !message) return { ok: false };
      const { error } = await supabase
        .from("contact_messages")
        .insert({ name, email, message });
      if (error) throw error;
      void notifyAdmin("contact message", [
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Message", value: message },
      ]);
    }
    return { ok: true };
  } catch (err) {
    console.error("submitForm failed", err);
    return { ok: false };
  }
}
