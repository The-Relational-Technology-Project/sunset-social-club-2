
# Community Jukebox

A public page at `sunsetsocialclub.org/jukebox` where neighbors submit a song (name + Spotify search pick). Stewards approve from the dashboard; approved songs auto-append to the club's Spotify playlist and are archived in the community playlist database.

## User flows

**Submitter (public, no login)**
1. Open `/jukebox` (or scan QR).
2. Enter first name → type song/artist → live results from Spotify → tap the correct track.
3. See confirmation: "You're #7 in the queue" + total songs submitted tonight + the requester's name shown in the public queue.
4. Can submit again (soft rate limit, see technical section).

**Steward (`/stewards`, existing auth)**
- New "Jukebox" section with three tabs: **Pending**, **Approved / In playlist**, **Rejected**.
- Each pending row: name, requester, submitted-at, Spotify link, cover art thumbnail. Buttons: **Approve & add to playlist**, **Reject**.
- Approve action calls Spotify API to append the track to the configured playlist; on success the row moves to Approved with a "✓ In playlist" badge and playlist position. On failure, shows the error and stays pending so the steward can retry.
- Fallback: a **Copy "Song — Artist"** button on every row for manual DJ use.
- Toggle to open/close submissions for the night.

## Data model (new tables)

- `jukebox_submissions` — id, requester_name, spotify_track_id, track_name, artist_name, album_art_url, duration_ms, status (`pending`/`approved`/`rejected`/`played`), submitted_at, approved_at, added_to_playlist_at, spotify_playlist_snapshot_id, submitter_fingerprint (hashed IP+UA for rate limit), created_at.
- `jukebox_settings` — singleton row: submissions_open (bool), current_event_label (text), updated_at. Lets the steward pause the form between events.

Public SELECT policy on `jukebox_submissions` returns only `requester_name`, `track_name`, `artist_name`, `status`, `created_at` for rows where `status IN ('approved','played')` — so the public queue shows what's been accepted without leaking pending or moderation data. Inserts go through a server function that writes with the service role (so `submitter_fingerprint` and rate-limit checks stay server-side). Stewards read everything through an authenticated server function (existing allowlist pattern in `stewards.functions.ts`).

## Spotify integration

Two Spotify auth modes:
- **Search (public)** — Client Credentials flow. Server function exchanges `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` for an app token, caches it in memory until expiry, proxies `/v1/search?type=track` to the submitter's typeahead. No user account touched.
- **Playlist write (steward)** — Authorization Code flow, one-time. You do a one-off OAuth handshake to grant `playlist-modify-public playlist-modify-private` on your Spotify account; we store the resulting `SPOTIFY_REFRESH_TOKEN` as a secret. Approve action uses the refresh token to mint an access token and calls `POST /v1/playlists/{id}/tracks` to append.

Required secrets (I'll request them when you approve): `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `SPOTIFY_PLAYLIST_ID`. To get the refresh token, I'll add a temporary `/api/spotify/connect` route that only you (allowlisted email) can hit, does the OAuth dance, prints the refresh token once for you to paste into the secret form, then can be removed.

## Files

- `src/routes/jukebox.tsx` — public page (submission form + live public queue).
- `src/components/JukeboxForm.tsx` — name field, debounced Spotify typeahead, result cards, submit.
- `src/components/JukeboxQueue.tsx` — public list of approved songs (polled every 15s).
- `src/lib/jukebox.functions.ts` — `searchSpotify`, `submitSong`, `listPublicQueue` (server fns, no auth).
- `src/lib/jukebox-admin.functions.ts` — `listAllSubmissions`, `approveSubmission`, `rejectSubmission`, `toggleSubmissions` (requireSupabaseAuth + email allowlist, same pattern as `stewards.functions.ts`).
- `src/lib/spotify.server.ts` — token cache, search, playlist-append helpers.
- `src/routes/api/spotify/connect.ts` + `src/routes/api/spotify/callback.ts` — one-time OAuth setup route, allowlisted.
- `src/routes/_authenticated/stewards.tsx` — add Jukebox section.
- Header nav: no change (jukebox lives at the URL / QR only, per event usage).
- `LanguageContext.tsx` — English + Chinese strings for the form and queue.
- Supabase migration for the two tables, RLS, GRANTs, updated_at trigger.

## Technical details

- **Rate limit**: hash `IP + user-agent` server-side into `submitter_fingerprint`; reject >5 pending-or-approved submissions per fingerprint per rolling 3 hours. Steward can override.
- **Duplicate protection**: unique index on `(spotify_track_id) WHERE status IN ('pending','approved','played')` so the same track can't be queued twice.
- **Public queue polling**: `useQuery` with `refetchInterval: 15000`. No realtime channel needed for v1.
- **Spotify token cache**: module-level in-memory cache per worker; refresh at `expires_at - 60s`. Acceptable because workers are short-lived and the token endpoint is fast.
- **Playlist ordering**: approved tracks are appended to the end (Spotify has no "insert at position N" without rewriting), which matches the DJ-queue mental model. The "your song is #N" number shown to the submitter is `count(approved) at approval time + 1`.
- **Failure handling**: if Spotify append 401s, refresh the token and retry once; if it still fails, surface the exact provider error to the steward (per gateway/provider-error guidance) and leave the row pending.
- **Notifications**: no email on submission (would spam during an event). Optional: single daily digest — out of scope for v1.
- **URL**: `/jukebox` only. Subdomain not needed.
- **Copy rules**: all new user-facing text will be added verbatim as I write the code; no em/en dashes, no emoji. I'll keep the tone consistent with the rest of the site ("Add a song", "You're next in line", "Submissions are paused for now").

## Out of scope for v1
- Fully seeding the existing Luma-collected playlist into the DB (can do as a one-time import once you share the list — separate follow-up).
- Freeform (non-Spotify) submissions.
- Play-order control beyond append.
- Realtime queue updates.
- Public "now playing" display.

After you approve, I'll need you to grant the Spotify OAuth scopes once so I can capture the refresh token — I'll walk you through it in-chat.
