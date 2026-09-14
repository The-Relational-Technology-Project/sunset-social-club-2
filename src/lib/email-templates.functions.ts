import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureSteward(email: string | undefined) {
  const mod = await import("./private-emails.server");
  mod.assertSteward(email);
}

export const listEmailTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureSteward(String(context.claims.email ?? ""));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .order("slug");
    if (error) throw error;
    return data ?? [];
  });

export const updateEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    slug: string;
    subject: string;
    heading: string;
    body_markdown: string;
    cta_label: string | null;
    cta_url: string | null;
  }) => d)
  .handler(async ({ data, context }) => {
    const email = String(context.claims.email ?? "");
    await ensureSteward(email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("email_templates")
      .update({
        subject: data.subject,
        heading: data.heading,
        body_markdown: data.body_markdown,
        cta_label: data.cta_label,
        cta_url: data.cta_url,
        updated_by: email,
      })
      .eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });
