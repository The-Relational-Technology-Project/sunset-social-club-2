import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function await ensureSteward(email: string | undefined) {
  const mod = await import("./private-emails.server");
  mod.assertSteward(email);
}

export const listModeration = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [feedback, forms, insights, photos] = await Promise.all([
      supabaseAdmin.from("event_feedback").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("event_feedback_forms").select("*").order("slug"),
      supabaseAdmin.from("community_insights").select("*").order("updated_at", { ascending: false }),
      supabaseAdmin.from("photos").select("*").order("created_at", { ascending: false }),
    ]);
    // Sign URLs for all photos server-side
    const signedPhotos = await Promise.all(
      (photos.data ?? []).map(async (p: any) => {
        const { data } = await supabaseAdmin.storage
          .from("photos")
          .createSignedUrl(p.storage_path, 3600);
        return { ...p, url: data?.signedUrl ?? "" };
      }),
    );
    return {
      feedback: feedback.data ?? [],
      forms: forms.data ?? [],
      insights: insights.data ?? [],
      photos: signedPhotos,
    };
  });

export const setPhotoApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; approved: boolean }) => d)
  .handler(async ({ data, context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("photos")
      .update({ approved: data.approved })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deletePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("photos")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.storage_path) {
      await supabaseAdmin.storage.from("photos").remove([row.storage_path]);
    }
    await supabaseAdmin.from("photos").delete().eq("id", data.id);
    return { ok: true };
  });

export const upsertInsight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string; title: string; markdown: string; published: boolean }) => d)
  .handler(async ({ data, context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("community_insights")
      .upsert(
        {
          slug: data.slug,
          title: data.title,
          markdown: data.markdown,
          published: data.published,
        },
        { onConflict: "slug" },
      );
    if (error) throw error;
    return { ok: true };
  });

export const updateFeedbackForm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string; title: string; intro: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("event_feedback_forms")
      .update({ title: data.title, intro: data.intro })
      .eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });
