// Site-wide constants. Edit values here, not in components.
import { submitPublicForm } from "./submissions.functions";

export const CONTACT_EMAIL = "oursunsetsocialclub@gmail.com";
export const NOTIFY_EMAILS = ["oursunsetsocialclub@gmail.com", "joshuanesbit@gmail.com"];
export const EVENT_RSVP_URL = "https://luma.com/p6zop4tg";

// Set to null when there is no active event; the banner then does not render.
export const ANNOUNCEMENT: {
  title: string;
  date: string;
  invitation: string;
  url: string;
} | null = {
  title: "Neighborhood Potluck + Yap",
  date: "Wednesday, Aug. 26",
  invitation: "Bring a dish, a story, or just yourself.",
  url: "https://luma.com/wau8wagn",
};

export const COMMUNITY_PLAYLIST_URL = "https://open.spotify.com/playlist/1saGchZ6JVWKmFnianOtJM?si=IPO4mE9kSaCxOvqOTCUVEw";
export const PIZZA_PARTY_FEEDBACK_SLUG = "pizza-party-2026-07-22";
export const JULY_22_INSIGHTS_SLUG = "july-22-kickoff";

// Paste the iframe embed code from Luma here (luma.com/sunsetsocialclub → Embed).
export const LUMA_CALENDAR_EMBED = `<iframe src="https://luma.com/embed/calendar/cal-EktVbYQFoGMjT6M/events?lt=light" width="100%" height="600" frameborder="0" style="border: 1px solid #bfcbda88; border-radius: 12px; display: block;" allowfullscreen aria-hidden="false" tabindex="0"></iframe>`;

// Upcoming events hosted by partners and members. Empty array hides the section.
export const PARTNER_EVENTS: { title: string; when: string; url: string }[] = [
  {
    title: "Olas Perdidas Live at Sunset Village Music Hall",
    when: "Friday, August 7th, 7 PM - 10 PM",
    url: "https://www.eventbrite.com/e/olas-perdidas-sunset-village-music-hall-san-francisco-tickets-1995582299377?aff=oddtdtcreator",
  },
];

export type FormType = "signup" | "idea" | "contact";

export async function submitForm(type: FormType, payload: Record<string, string>) {
  try {
    if (type === "signup") {
      const email = (payload.email ?? "").trim();
      const firstName = (payload.firstName ?? "").trim() || null;
      const crossStreets = (payload.crossStreets ?? "").trim() || null;
      if (!email) return { ok: false };
      await submitPublicForm({ data: { type: "signup", email, firstName, crossStreets } });
    } else if (type === "idea") {
      const idea = (payload.idea ?? "").trim();
      const name = (payload.name ?? "").trim();
      if (!idea || !name) return { ok: false };
      await submitPublicForm({ data: { type: "idea", idea, name } });
    } else if (type === "contact") {
      const name = (payload.name ?? "").trim();
      const email = (payload.email ?? "").trim();
      const message = (payload.message ?? "").trim();
      if (!name || !email || !message) return { ok: false };
      await submitPublicForm({ data: { type: "contact", name, email, message } });
    }
    return { ok: true };
  } catch (err) {
    console.error("submitForm failed", err);
    return { ok: false };
  }
}
