import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED = ["joshuanesbit@gmail.com", "sandi.lamharder@gmail.com"];

export const getStewardsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String(context.claims.email ?? "").toLowerCase();
    if (!ALLOWED.includes(email)) {
      throw new Error("Forbidden");
    }
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
