# Sunset Social Club

The website for Sunset Social Club, a neighborhood club in the Sunset district of San Francisco.

Live site: https://sunsetsocialclub.org

## What the site does

- Landing page with the club story, photos, and the club calendar
- Partner and Member Events list
- Join the Club email sign-up, with a welcome email
- Contact form and idea board
- Community Jukebox: members suggest songs that are added to the club Spotify playlist
- Member area (sign in with an emailed code) with feedback forms, a moderated photo gallery, and community insights
- Quick event feedback page for tablets and phones at `/eventfeedback`
- Potluck sign-up form at `/potluck`
- Stewards dashboard for moderation, member list export, and email template editing
- English and Chinese language toggle
- Privacy policy

## Tech

- React 19 with TanStack Start (file based routing in `src/routes`)
- Vite 7, TypeScript, Tailwind CSS v4 (`src/styles.css`)
- Supabase for database, auth, and file storage
- Resend for transactional email
- Spotify Web API for the jukebox playlist

## Running locally

```bash
bun install
bun run dev
```

The app runs at http://localhost:8080.

Server side features need environment variables that are not in this repo (Supabase service role, Resend key, Spotify credentials). Without them the public pages still render, but forms and the member area will not work.

## Project layout

```
src/routes/        pages and API routes
src/components/    shared UI
src/lib/           server functions, email templates, site config
src/integrations/  generated Supabase clients
supabase/          database migrations
```

Site wide values such as the contact email, announcement banner, calendar embed, and partner events live in `src/lib/site-config.ts`.

## Contact

oursunsetsocialclub@gmail.com
