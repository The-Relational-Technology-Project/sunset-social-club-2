import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";
import { createHash } from "crypto";

// Zod-lite manual validation; project doesn't already depend on zod for these paths.

function sanitizeName(v: unknown): string {
  return String(v ?? "")
    .trim()
    .slice(0, 60);
}

function fingerprint(): string {
  try {
    const headers = getRequestHeaders();
    const ip = getRequestIP({ xForwardedFor: true }) ?? "";
    const ua = headers["user-agent"] ?? "";
    return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
  } catch {
    return "unknown";
  }
}

export const searchSpotify = createServerFn({ method: "POST" })
  .inputValidator((data: { q: string }) => ({ q: String(data?.q ?? "").slice(0, 200) }))
  .handler(async ({ data }) => {
    if (!data.q.trim()) return { tracks: [] };
    const { searchTracks } = await import("./spotify.server");
    try {
      const tracks = await searchTracks(data.q, 8);
      return { tracks };
    } catch (err) {
      console.error("searchSpotify failed", err);
      return { tracks: [], error: "Search is unavailable right now" };
    }
  });

export const submitSong = createServerFn({ method: "POST" })
  .inputValidator((data: { requesterName: string; trackId: string }) => ({
    requesterName: sanitizeName(data?.requesterName),
    trackId: String(data?.trackId ?? "").slice(0, 60),
  }))
  .handler(async ({ data }) => {
    if (!data.requesterName) return { ok: false, error: "Please add your name." };
    if (!data.trackId) return { ok: false, error: "Please pick a song." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check submissions open
    const { data: settings } = await supabaseAdmin
      .from("jukebox_settings")
      .select("submissions_open")
      .eq("id", 1)
      .maybeSingle();
    if (settings && settings.submissions_open === false) {
      return { ok: false, error: "Submissions are paused right now." };
    }

    // Rate limit
    const fp = fingerprint();
    const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("jukebox_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitter_fingerprint", fp)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      return { ok: false, error: "You've submitted a few already. Give others a turn." };
    }

    // Look up track
    const { getTrack } = await import("./spotify.server");
    let track;
    try {
      track = await getTrack(data.trackId);
    } catch (err) {
      console.error("getTrack failed", err);
      return { ok: false, error: "Couldn't verify that song. Try again." };
    }
    if (!track) return { ok: false, error: "That song wasn't found." };

    // Insert as pending; we'll flip to approved after Spotify append succeeds.
    const { data: inserted, error } = await supabaseAdmin
      .from("jukebox_submissions")
      .insert({
        requester_name: data.requesterName,
        spotify_track_id: track.id,
        spotify_uri: track.uri,
        track_name: track.name,
        artist_name: track.artists,
        album_art_url: track.albumArt,
        duration_ms: track.durationMs,
        submitter_fingerprint: fp,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "That song is already in the queue." };
      }
      console.error("submitSong insert failed", error);
      return { ok: false, error: "Something went wrong. Try again." };
    }

    // Auto-append to Spotify playlist
    try {
      const { appendTrackToPlaylist } = await import("./spotify.server");
      const { snapshotId } = await appendTrackToPlaylist(track.uri);
      const now = new Date().toISOString();
      await supabaseAdmin
        .from("jukebox_submissions")
        .update({
          status: "approved",
          approved_at: now,
          added_to_playlist_at: now,
          spotify_playlist_snapshot_id: snapshotId,
          approve_error: null,
        })
        .eq("id", inserted.id);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      console.error("auto-append failed", msg);
      await supabaseAdmin
        .from("jukebox_submissions")
        .update({ status: "rejected", approve_error: msg.slice(0, 500) })
        .eq("id", inserted.id);
      return { ok: false, error: "Couldn't add that one to the playlist. Try another?" };
    }

    // Position in the live playlist
    const { count: ahead } = await supabaseAdmin
      .from("jukebox_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");

    return {
      ok: true,
      id: inserted.id,
      position: ahead ?? 1,
      track: { name: track.name, artists: track.artists, albumArt: track.albumArt },
    };
  });

export const listPublicQueue = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("jukebox_submissions")
    .select("id, requester_name, track_name, artist_name, album_art_url, status, created_at")
    .in("status", ["approved", "played"])
    .order("created_at", { ascending: true })
    .limit(200);
  const { count: total } = await supabaseAdmin
    .from("jukebox_submissions")
    .select("id", { count: "exact", head: true });
  const { data: settings } = await supabaseAdmin
    .from("jukebox_settings")
    .select("submissions_open, current_event_label")
    .eq("id", 1)
    .maybeSingle();
  return {
    queue: data ?? [],
    total: total ?? 0,
    submissionsOpen: settings?.submissions_open ?? true,
    eventLabel: settings?.current_event_label ?? null,
  };
});
