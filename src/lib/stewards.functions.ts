import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getStewardsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String(context.claims.email ?? "").toLowerCase();
    const { assertSteward } = await import("./private-emails.server");
    assertSteward(email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [signups, ideas, contacts] = await Promise.all([
      supabaseAdmin.from("email_signups").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("ideas").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    return {
      signups: signups.data ?? [],
      ideas: ideas.data ?? [],
      contacts: contacts.data ?? [],
    };
  });
