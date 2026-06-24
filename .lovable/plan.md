## Goal

Collapse to a single typeface site-wide that complements the hand-drawn SSC wordmark. The wordmark stays the only script element.

## Changes

1. **`src/routes/__root.tsx`** — swap the Google Fonts `<link>` to load only Nunito:
   `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap`

2. **`src/styles.css`**
   - `--font-sans: "Nunito", ui-sans-serif, system-ui, sans-serif;`
   - Remove `--font-hand` token.

3. **Remove `font-hand` usages** (they currently render in Caveat script). Replace with weight/size emphasis in Nunito so section headings still feel distinct from body but don't compete with the wordmark. Files affected:
   - `src/components/Schedule.tsx` — "What's coming up"
   - `src/components/EmailSignupForm.tsx` — "Stay in the loop"
   - `src/components/IdeaBoard.tsx` — heading
   - `src/routes/index.tsx` — kickoff banner "Volunteer Day + Pizza Party"
   - `src/routes/about.tsx`, `src/routes/contact.tsx` — any headings
   - `src/components/Footer.tsx` — any script accents

   Pattern: `font-hand text-[2rem]` → `text-[1.75rem] font-extrabold tracking-tight`.

## Out of scope

- Wordmark SVG (unchanged — remains the only handwritten element).
- Colors, layout, spacing, animations.

If you'd rather keep a different single typeface (Quicksand for softer/rounder, or just keep Hanken Grotesk and only drop Caveat), say so before I build.