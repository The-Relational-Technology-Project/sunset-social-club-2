// Site-wide constants. Edit values here, not in components.
export const CONTACT_EMAIL = "hello@sunsetsocialclub.org";
export const EVENT_RSVP_URL = "https://luma.com/p6zop4tg";

// Paste the iframe embed code from Luma here (luma.com/sunsetsocialclub → Embed).
// If empty, the schedule card renders empty rather than inventing events.
export const LUMA_CALENDAR_EMBED = "";

// URL of the single serverless function that handles all form submissions.
// If empty, forms show their success message and reset with no network call.
export const FORM_ENDPOINT = "";

export type FormType = "signup" | "idea" | "contact";

export async function submitForm(type: FormType, payload: Record<string, string>) {
  if (!FORM_ENDPOINT) return;
  try {
    await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
    });
  } catch {
    // Swallow network errors for now; the success message still shows.
  }
}
