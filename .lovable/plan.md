## Build plan (updated to use uploaded assets)

Single small marketing site for Sunset Social Club. Three TanStack routes (Home, About, Contact), exact copy from the brief, three plain forms, one Luma embed. Uses the uploaded logos and photos.

### Uploaded assets — where each one goes
Copied into the project and uploaded to the CDN via `lovable-assets` (kept as `.asset.json` pointers so the repo stays light):

- `ssc-script-wordmark.svg` (ink) — used as the wordmark image wherever the brief calls for the rendered text "Sunset social club" (hero, header brand, footer if needed). Replaces the Caveat-rendered wordmark text. Keeps the lowercase, hand-drawn look the brief asks for.
- `ssc-script-wordmark-cream.svg` and `ssc-script-wordmark-terracotta.svg` — kept available as alternate-color variants (not used by default; easy to swap later).
- `SSC_logo.png` and `ssc_square.PNG` — kept in `src/assets/` as reference/alt versions; not rendered (the inline antenna SVG from the brief is the animated logo).
- `coffee_and_donuts.jpg` — used once on the **About** view, between paragraphs, as a small framed paper-card photo (no caption per the copy rules). Alt text: `Sunset Social Club neighbors gathered on the sidewalk` (only because alt text is accessibility-required for a content image; minimal, non-marketing).
- `Ocean_Beach_SF.jpeg` — used once on **Home**, as a quiet wide band beneath the hero glow / behind the hero area at low opacity OR as a small framed image at the very bottom of the About view. Default placement: a low-contrast wide image strip immediately below the hero, above the event card, framed flush to the content column. Alt: `Ocean Beach, San Francisco`.

Note on brief conflict: the brief says no photos or decorative graphics beyond the antenna and hero glow. The explicit instruction to use the uploaded images overrides that for these two photos and the wordmark SVG. Everything else in the brief's "Do not" list still holds (no emoji, no social icons, no stock photos, no extra text).

### Constants (`src/lib/site-config.ts`)
- `CONTACT_EMAIL = "hello@sunsetsocialclub.org"`
- `EVENT_RSVP_URL = "https://luma.com/p6zop4tg"`
- `LUMA_CALENDAR_EMBED = ""` (empty → schedule card renders empty)
- `FORM_ENDPOINT = ""` (empty → forms show success message with no network call)

### Routes
- `src/routes/__root.tsx` — title "Sunset social club", Google Fonts `<link>` (Caveat + Hanken Grotesk), renders `<Header />`, `<Outlet />`, `<Footer />`. Keep existing error/not-found boundaries.
- `src/routes/index.tsx` — Home: Hero, Ocean Beach image strip, EventCard, Schedule, EmailSignup, IdeaBoard.
- `src/routes/about.tsx` — About copy + coffee-and-donuts photo + inline "Get in touch" link.
- `src/routes/contact.tsx` — Contact form + mailto.

### Components (`src/components/`)
- `AntennaLogo.tsx` — exact SVG from brief; `variant: "hero" | "nav"` (nav hides signal arcs, aria-hidden, ~30px).
- `Wordmark.tsx` — renders the uploaded script-wordmark SVG via `<img>` from the `.asset.json` pointer; `variant: "hero" | "nav" | "footer"` sizes it.
- `Header.tsx` — antenna (nav) + wordmark (nav) as the brand link, nav links Home / About.
- `Footer.tsx` — About, Contact, mailto, right-aligned location line.
- `EventCard.tsx` — paper card, 5px sunset left bar, eyebrow, hand heading, body, solid pill "Count me in" → `EVENT_RSVP_URL` (new tab), meta line.
- `Schedule.tsx` — heading, subheading, paper card injecting `LUMA_CALENDAR_EMBED` via `dangerouslySetInnerHTML` (or empty), note.
- `EmailSignupForm.tsx`, `IdeaBoardForm.tsx` (seeded list Mara / Wei / Dani, newest on top, no votes; comment about future shared datastore), `ContactForm.tsx`.
- Shared `submitForm(type, payload)` helper: POST JSON to `FORM_ENDPOINT` when set; otherwise no-op.

### Styling (`src/styles.css`)
- `@theme` tokens: `fog #E7EAEB`, `paper #F8F9F9`, `ink #1D1C1A`, `sunset #EC6A4C`, `amber #E8A33D`, `dusk #3E5C6B`; `--font-hand: "Caveat", cursive` (swappable in one place per the brief).
- Body: fog background, ink text, Hanken Grotesk default.
- Hero radial glow: sunset → amber → transparent, low opacity. The only gradient on the site.
- Pill buttons: solid ink (Count me in, Keep me posted, Send it) and ghost ink-outline → sunset on hover (Pin it up, Get in touch).
- Keyframes: three antenna signal arcs ping outward, staggered ~0.25s. `prefers-reduced-motion` disables arcs and view fades.
- Sunset focus ring on all interactive elements.

### Forms behavior
- Native `required` only.
- On submit: preventDefault → `submitForm(type, data)` → inline exact success message → reset.
- Idea board: append `{idea, name}` to state; render as paper cards with idea in quotes, muted `by Name` below.

### Do-not (enforced while writing)
- Only the copy in the brief. No invented text, descriptions, captions, taglines.
- No em/en dashes anywhere.
- No emoji. No icons except antenna.
- No social, analytics, cookie banner, "powered by".
- No invented events, times, addresses.

### Technical notes
- TanStack Start file routes; each route's `head()` sets only its title from on-page copy ("Sunset social club", "About the club", "Say hello"). No og:image (no leaf hero asset that doubles as a share image).
- Fonts loaded via `<link>` in `__root.tsx` head, never `@import` in CSS.
- No new dependencies; no shadcn forms, no zod.
- Luma embed injected via `dangerouslySetInnerHTML` because the user pastes a trusted iframe string into the constant; comment notes this.

### Follow-ups for the user (after build)
- Paste the Luma iframe into `LUMA_CALENDAR_EMBED`.
- Provide `FORM_ENDPOINT` when the Resend serverless function is ready.