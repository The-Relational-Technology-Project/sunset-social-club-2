import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMemberStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims?.email as string | undefined)?.toLowerCase();
    if (!email) return { isMember: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("email_signups")
      .select("id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("getMemberStatus failed", error);
      return { isMember: false };
    }
    return { isMember: Boolean(data) };
  });
