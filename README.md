# Sunset Social Club

Build the website described below exactly. Treat the copy in this document as final and complete. Do not add, rephrase, or "improve" any text. The most important rule in this whole brief is in the Copy rules section: read it before building.

---

## Values to set before building

Use these as named constants near the top of the code so they are easy to change. Do not invent values for any of them.

- `CONTACT_EMAIL` = hello@sunsetsocialclub.org  This is the public address shown on the site. On the backend it routes to a private inbox via Resend. The visitor never sees the private inbox. Do not display any other email address anywhere.
- `EVENT_RSVP_URL` = https://luma.com/p6zop4tg  The 7/22 kickoff event page. The "Count me in" button opens it in a new tab.
- `LUMA_CALENDAR_EMBED` = (paste the iframe embed code from Luma here) Get it from the club calendar at luma.com/sunsetsocialclub using Luma's Embed option. Do not guess or hardcode a calendar id. If this is empty, leave the schedule card empty rather than inventing any events.
- `FORM_ENDPOINT` = (the URL of the one serverless function that handles form submissions, see Forms behavior) If empty, forms show their success message and reset with no network call. Do not build a fake API.

---

## What you are building

A single, very small website for a neighborhood club in the Outer Sunset, San Francisco. It has three views: Home, About, Contact. It is static marketing content plus three simple forms. There is no login, no account, no payment, no dashboard, no blog, no search. Mobile first. It should feel warm, hand-made, and quiet, like a flyer from a neighbor, not a startup landing page.

## Stack and constraints

- React + TypeScript + Tailwind, Lovable defaults are fine.
- Three views handled by simple routing or view state. Home is default. Contact is reachable from the footer and from the "Get in touch" button on the About view. The "Count me in" button opens `EVENT_RSVP_URL` in a new tab. About is in the top nav.
- Load fonts from Google Fonts only. No analytics, no tracking pixels, no chat widgets, no cookie or consent banner. The only permitted third party embed is the Luma calendar inside the schedule card.
- Do not pull in shadcn form scaffolding, zod, or component libraries for this. Use plain semantic HTML elements and controlled inputs. Keep the dependency count near zero.
- Content max width about 640px, centered.

---

## Copy rules (read this first)

1. Use only the text provided in the "Exact copy" section, word for word. Do not write any other text anywhere in the site.
2. Do not add headings, sentences, taglines, subtitles, captions, helper text, tooltips, button labels, link text, or alt text beyond what is given here. Where alt text or an aria-label is needed, the exact value is provided below. Use it.
3. No marketing language. No "join our community," no "why join," no value propositions, no feature grids, no stats, no testimonials, no FAQ, no "how it works," no benefits list, no closing call to action section.
4. No emoji. No icons except the one antenna logo provided.
5. No placeholder or lorem text anywhere.
6. Do not invent event dates, times, prices, names, quotes, addresses, phone numbers, social media handles, or URLs. If a value is not in this document, it does not go on the page.
7. Keep the wordmark lowercase exactly as written: "Sunset social club".
8. Keep punctuation exactly as provided. Do not use em-dashes or en-dashes anywhere, in copy or in any generated text. Use commas, periods, or the punctuation already in the copy.
9. Do not add pages or views beyond Home, About, Contact. Do not add nav items beyond what is listed. No social links, no app badges, no language switcher, no "made with Lovable" or other "powered by" mark.

If you think the page needs more words to feel complete, it does not. Leave the whitespace.

---

## Exact copy

### Top nav
- Brand (left, clickable, goes Home): the antenna logo mark followed by the wordmark text "Sunset social club"
- Nav links (right): "Home", "About"

### Home view, in this order

Hero:
- Antenna logo (large, centered)
- Wordmark heading: Sunset social club
- Intro (one sentence): A neighborhood club in the Outer Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us.

Event card (this is the kickoff banner CTA):
- Eyebrow: Next Wednesday · July 22
- Heading: Volunteer day + community pizza party
- Body: We are getting the space ready together, then eating pizza as a reward. Bring the kids, bring a friend, bring nothing at all. This is the kickoff.
- Button: Count me in  (opens `EVENT_RSVP_URL` in a new tab)
- Meta line next to the button: Afternoon work, pizza at dusk · 4114 Judah St (at 46th Ave)

Schedule:
- Heading: What's coming up
- Subheading: Every Wednesday. Loose on purpose.
- Below the subheading, render the Luma calendar inside a paper card, using `LUMA_CALENDAR_EMBED`. Your heading and the note carry the voice; the embed provides the events. Constrain the iframe to the content width, give it a sensible min height, round the card corners to match the rest of the site, and let it scroll if needed. Do not hardcode any event rows and do not add events of your own. If `LUMA_CALENDAR_EMBED` is empty, leave the card empty.
- Note under the calendar: Dates and plans shift with the fog. Sign up below and we will tell you what is actually happening each week.

Email signup:
- Heading: Stay in the loop
- Subheading: A short note now and then about what is happening on Wednesday. Nothing else.
- Field 1 label: Email (required), placeholder: you@example.com
- Field 2 label: First name (optional), placeholder: What we'll call you
- Button: Keep me posted
- Success message: You're on the list. See you Wednesday.

Idea board:
- Heading: Got an idea for the club?
- Subheading: A club bulletin board. Pin up something you'd want to happen here, or that you'd help make happen.
- Textarea label: Your idea, placeholder: A Saturday repair cafe? A Cantonese cooking night? Say it here.
- Name field label: Your name, placeholder: So we know who to thank
- Button: Pin it up
- Seed the board with these three ideas, in this order, each shown with the name below it in quotation marks:
  - "A Saturday morning repair cafe, fix bikes and lamps and toasters" by Mara
  - "Cantonese home-cooking night, the aunties teach the rest of us" by Wei
  - "Sidewalk chalk for the kids, coffee for the grown-ups" by Dani
- Note under the board: Ideas go up with a name, no votes and no ranking. We read every one.

### About view
- Heading: About the club
- Subheading: Who we are and how this started.
- Lead paragraph: Sunset Social Club is a small thing with a simple idea: neighbors are better off when they actually know each other.
- Paragraph: It started the way most of these things do. A few of us live in the Outer Sunset, love it here, and realized we recognized a lot of faces without knowing many names. We wanted a regular, low-key reason to be in the same room as the people on our blocks, not for a cause or a meeting, just to share a meal and let friendships happen.
- Paragraph: So we picked a night. Every Wednesday evening we gather at 4114 Judah Street, near 46th Avenue, in a big old church space a few blocks from Ocean Beach. Most weeks it is a shared supper. Once a month we cook a bigger dinner. Kids are free and welcome, and you do not have to be anybody's idea of a joiner to belong here.
- Paragraph: We are at the very beginning. The space is still coming together, the schedule is loose, and a lot of what this becomes will be shaped by who shows up and what they bring. If that sounds like your kind of thing, come to a Wednesday and see.
- Final line with an inline button: the text "Questions, or want to help?" followed by a button labeled "Get in touch" that opens the Contact view.

### Contact view
- Heading: Say hello
- Subheading: Coming Wednesday, want to help, or just curious. We read everything.
- Field label: Your name (required), placeholder: Your name
- Field label: Email (required), placeholder: you@example.com
- Field label: Message (required), placeholder: What's on your mind?
- Button: Send it
- Meta next to the button: the text "or email " followed by `CONTACT_EMAIL` as a mailto link
- Success message: Thanks. We'll write back soon.

### Footer (all views)
- Link: About (opens About view)
- Link: Contact (opens Contact view)
- `CONTACT_EMAIL` as a mailto link
- Plain text, right aligned on wide screens: Outer Sunset, San Francisco · made by neighbors

---

## Pages and section order

- Home: hero, event card, schedule (Luma calendar embed), email signup, idea board. Nothing else.
- About: heading block, the four paragraphs, the "Get in touch" line. Nothing else.
- Contact: heading block, the contact form. Nothing else.

---

## Design system

Spend all the visual boldness on the antenna logo and the single hero glow. Everything else stays quiet and disciplined. The personality comes from the handwriting font and the antenna, not from decoration.

### Color
Define these as Tailwind theme tokens. Use straight hex.
- fog #E7EAEB (page background, a cool marine-layer grey-white, not a warm cream)
- paper #F8F9F9 (cards and input surfaces)
- ink #1D1C1A (all text and the logo line art)
- sunset #EC6A4C (the one warm accent, used sparingly: the Next tag, eyebrow label, focus ring, hover glow, and the hero glow)
- amber #E8A33D (only as the second color in the hero glow gradient)
- dusk #3E5C6B (links and secondary text)
- Use ink at about 70% and 55% opacity for secondary and tertiary text. Hairline borders are ink at about 14% opacity.

### Type
- Load two fonts from Google Fonts: Caveat (weights 400 to 700) as the handwriting display face, and Hanken Grotesk (400 to 700) as the body and UI face.
- Expose the handwriting face as a single Tailwind token named `font-hand`. This is a deliberate stand-in for a custom handwriting font that will replace it later, so it must be swappable in one place.
- Hanken Grotesk is the default body font.
- Use the handwriting font (`font-hand`) for: the wordmark, the event card heading, and each section heading (What's coming up, Stay in the loop, Got an idea for the club?, About the club, Say hello). Use Hanken Grotesk for all body text, labels, buttons, tags, meta, and the schedule.
- Wordmark size scales roughly clamp(2.9rem, 11vw, 4.4rem). Section headings around 2rem. Body around 17px with line-height about 1.6. Eyebrow and tag labels are small, uppercase, letter-spaced, in Hanken Grotesk.

### Shape, spacing, motion
- Border radius: cards and inputs around 14 to 18px, buttons are full pills. Do not make every element rounded, and do not go zero-radius.
- The primary button is solid ink with paper-colored text, a full pill. On hover it lifts a couple of pixels and gains a soft sunset-colored glow shadow. A secondary "ghost" button is an ink outline that turns sunset on hover. Use the ghost style for "Pin it up" and the About "Get in touch" button. Use the solid style for "Count me in", "Keep me posted", and "Send it".
- The event card is a paper card with a hairline border and a 5px solid sunset bar down its left edge, plus a soft warm drop shadow.
- The hero has one subtle radial glow behind the antenna, going from sunset to amber to transparent, low opacity. This is the only gradient in the whole site.
- Motion: on load, three signal arcs above the antenna ping outward once in sequence (scale up slightly and fade out), staggered by about a quarter second. Views fade and rise a few pixels when switched. Keep it understated.
- Respect prefers-reduced-motion: disable the arc animation and the view transitions, and render the arcs faint and static or hidden.

### Schedule styling
The schedule is the Luma calendar embed, framed by your heading and note. Put the embed in a paper card with a hairline border and matching rounded corners so it reads as an intentional part of the page rather than a bolted-on widget. Do not try to restyle the inside of the embed; you cannot. Just give it a clean frame and breathing room. The Luma embed is the one place on the site that will not match the handwriting aesthetic, and that is an accepted trade for an always-current schedule.

### Idea board styling
Posted ideas render as paper cards in a single column, newest at the top. Each card shows the idea text in quotation marks with the name on a line below in muted text. No upvote, no like, no sort control, no delete, no count. It is a bulletin board, not a feed.

### Accessibility and quality floor
- Every input has a real associated label.
- Visible keyboard focus everywhere, using a sunset focus ring.
- Color contrast must pass for body text (ink on fog is fine; do not put small text in sunset on light backgrounds).
- Fully responsive down to a narrow phone, single column throughout.
- Semantic landmarks: header, main, footer.

---

## The logo (use this SVG verbatim)

This is a hand-drawn rooftop TV antenna, the kind on the houses out here, standing for neighbors tuned to the same signal. Use exactly these paths. Stroke is ink, stroke-width 8, round caps, no fill. The three arcs tagged as signal are stroke sunset, width 6, round caps, and are the elements that animate on load (transform-origin bottom center). aria-label for the hero logo: "Sunset Social Club rooftop antenna". For the small nav mark, reuse the same line elements at about 30px and omit the three signal arcs; mark it aria-hidden.

```svg
<svg viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg" aria-label="Sunset Social Club rooftop antenna">
  <!-- signal arcs (sunset, animated) -->
  <path data-sig="3" d="M 86 50 A 46 46 0 0 1 154 50" fill="none" stroke="#EC6A4C" stroke-width="6" stroke-linecap="round"/>
  <path data-sig="2" d="M 96 40 A 34 34 0 0 1 144 40" fill="none" stroke="#EC6A4C" stroke-width="6" stroke-linecap="round"/>
  <path data-sig="1" d="M 106 31 A 22 22 0 0 1 134 31" fill="none" stroke="#EC6A4C" stroke-width="6" stroke-linecap="round"/>
  <!-- mast -->
  <line x1="120" y1="62" x2="120" y2="232" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <!-- left fan -->
  <line x1="120" y1="104" x2="34" y2="58"  stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="104" x2="28" y2="82"  stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="104" x2="28" y2="108" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="104" x2="44" y2="132" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <!-- right yagi -->
  <line x1="120" y1="100" x2="208" y2="70"  stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="112" x2="210" y2="108" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="150" y1="90"  x2="150" y2="120" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="176" y1="83"  x2="176" y2="115" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <!-- lower left -->
  <line x1="120" y1="152" x2="56" y2="142" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
  <line x1="120" y1="152" x2="52" y2="164" stroke="#1D1C1A" stroke-width="8" stroke-linecap="round"/>
</svg>
```

---

## Forms behavior

Three forms: email signup, idea board, contact. Build each with exactly the fields, labels, and placeholders in Exact copy. Native required validation only, no custom validation copy.

On submit: prevent the default, POST the fields to `FORM_ENDPOINT` as JSON, then show that form's exact success message inline and reset the fields. Include a `type` field in every payload so one endpoint can tell them apart: "signup", "idea", or "contact". If `FORM_ENDPOINT` is empty, skip the network call and just show the success message.

Backend (can be wired after the first build, do not block the frontend on it): `FORM_ENDPOINT` is a single serverless function that uses Resend. For type "contact" and type "idea" it emails the submission to the club inbox. For type "signup" it adds the email to a Resend audience. The Resend API key lives in the build's secrets, never in client code, and the sending domain sunsetsocialclub.org must be verified in Resend before it can send from `CONTACT_EMAIL`.

Idea board specifics: also keep the posted list in React state, seeded with the three ideas above in order, newest on top, signed cards, no votes or sorting. The on-page list is session-only for now; the emailed copy is how the club actually receives ideas. Add a code comment that a shared datastore is a future upgrade, but do not build one.

---

## Do not

- Do not add any text not in this document.
- Do not add sections, pages, or nav items beyond what is listed.
- Do not add social media, icons, illustrations, stock photos, or decorative graphics other than the antenna logo and the single hero glow.
- Do not use em-dashes or en-dashes.
- Do not use emoji.
- Do not add a cookie banner, newsletter popup, analytics, or any "powered by" mark.
- Do not rename the club, change the lowercase wordmark, or translate anything.
- Do not invent the event time, calendar events, or any contact details. Do not display any email address other than `CONTACT_EMAIL`.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sunset-social-club-2.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/002c6236-1171-44e7-80aa-9f0360115c92).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
