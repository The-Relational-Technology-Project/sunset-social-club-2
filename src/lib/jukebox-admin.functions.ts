import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED = ["joshuanesbit@gmail.com", "sandi.lamharder@gmail.com"];

function assertSteward(email: unknown): string {
  const e = String(email ?? "").toLowerCase();
  if (!ALLOWED.includes(e)) throw new Error("Forbidden");
  return e;
}

export const listAllSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertSteward(context.claims.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: submissions } = await supabaseAdmin
      .from("jukebox_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: settings } = await supabaseAdmin
      .from("jukebox_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return { submissions: submissions ?? [], settings };
  });

export const approveSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data?.id ?? "").slice(0, 60) }))
  .handler(async ({ data, context }) => {
    assertSteward(context.claims.email);
    if (!data.id) return { ok: false, error: "Missing id" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("jukebox_submissions")
      .update({
        status: "approved",
        approved_at: now,
        added_to_playlist_at: now,
        approve_error: null,
      })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const removeFromPlaylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data?.id ?? "").slice(0, 60) }))
  .handler(async ({ data, context }) => {
    assertSteward(context.claims.email);
    if (!data.id) return { ok: false, error: "Missing id" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("jukebox_submissions")
      .select("id, spotify_uri, status")
      .eq("id", data.id)
      .single();
    if (!row) return { ok: false, error: "Not found" };
    try {
      if (row.status === "approved" || row.status === "played") {
        const { removeTrackFromPlaylist } = await import("./spotify.server");
        await removeTrackFromPlaylist(row.spotify_uri);
      }
    } catch (err: any) {
      // Log but still mark rejected so it disappears from the queue
      console.error("removeTrackFromPlaylist failed", err?.message ?? err);
    }
    const { error } = await supabaseAdmin
      .from("jukebox_submissions")
      .update({ status: "rejected" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const rejectSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data?.id ?? "").slice(0, 60) }))
  .handler(async ({ data, context }) => {
    assertSteward(context.claims.email);
    if (!data.id) return { ok: false, error: "Missing id" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("jukebox_submissions")
      .update({ status: "rejected" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const markPlayed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data?.id ?? "").slice(0, 60) }))
  .handler(async ({ data, context }) => {
    assertSteward(context.claims.email);
    if (!data.id) return { ok: false, error: "Missing id" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("jukebox_submissions")
      .update({ status: "played" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const toggleSubmissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { open: boolean; eventLabel?: string }) => ({
    open: Boolean(data?.open),
    eventLabel: data?.eventLabel != null ? String(data.eventLabel).slice(0, 120) : undefined,
  }))
  .handler(async ({ data, context }) => {
    assertSteward(context.claims.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const update: { submissions_open: boolean; current_event_label?: string } = {
      submissions_open: data.open,
    };
    if (data.eventLabel !== undefined) update.current_event_label = data.eventLabel;
    const { error } = await supabaseAdmin
      .from("jukebox_settings")
      .update(update)
      .eq("id", 1);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });
