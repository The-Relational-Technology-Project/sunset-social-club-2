// Site-wide constants. Edit values here, not in components.
import { submitPublicForm } from "./submissions.functions";

export const CONTACT_EMAIL = "oursunsetsocialclub@gmail.com";
export const EVENT_RSVP_URL = "https://luma.com/p6zop4tg";

// Announcement banners, one per event. Empty array hides the banner.
export const ANNOUNCEMENTS: {
  icon: string;
  title: string;
  date: string;
  invitation: string;
  url: string;
  tone: "amber" | "sunset";
}[] = [
  {
    icon: "🎨",
    title: "Creative Play Workshop",
    date: "Wednesday, Sept 30",
    invitation: "Come make art with your neighbors!",
    url: "https://luma.com/2nszfy10",
    tone: "amber",
  },
  {
    icon: "🛠️",
    title: "Sunset Neighborhood Build-a-Thon",
    date: "Friday, Oct 9",
    invitation: "Let’s build what our neighborhood needs!",
    url: "https://luma.com/tzyvkp9j",
    tone: "sunset",
  },
];

export const COMMUNITY_PLAYLIST_URL = "https://open.spotify.com/playlist/1saGchZ6JVWKmFnianOtJM?si=IPO4mE9kSaCxOvqOTCUVEw";
export const PIZZA_PARTY_FEEDBACK_SLUG = "pizza-party-2026-07-22";
export const GENERAL_FEEDBACK_SLUG = "general-feedback";
export const JULY_22_INSIGHTS_SLUG = "july-22-kickoff";

// Paste the iframe embed code from Luma here (luma.com/sunsetsocialclub → Embed).
export const LUMA_CALENDAR_EMBED = `<iframe src="https://luma.com/embed/calendar/cal-EktVbYQFoGMjT6M/events?lt=light" width="100%" height="600" frameborder="0" style="border: 1px solid #bfcbda88; border-radius: 12px; display: block;" allowfullscreen aria-hidden="false" tabindex="0"></iframe>`;

// Upcoming events hosted by partners and members. Empty array hides the section.
export const PARTNER_EVENTS: { title: string; when: string; url: string }[] = [
  {
    title: "Summer in the Sunset, a group art exhibition at Sunset Variety",
    when: "Saturday, September 5th, 2 PM - 5 PM",
    url: "https://sunsetvariety.com/",
  },
  {
    title: "Olas Perdidas playing at Sunset Village Music Hall",
    when: "Wednesday, September 9th",
    url: "https://www.tickettailor.com/events/toddhanniganmusicllc/2361891",
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
      const res = await submitPublicForm({ data: { type: "signup", email, firstName, crossStreets } });
      if (res && "alreadyMember" in res && res.alreadyMember) return { ok: true, alreadyMember: true };
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
    return { ok: true, alreadyMember: false };
  } catch (err) {
    console.error("submitForm failed", err);
    return { ok: false, alreadyMember: false };
  }
}
