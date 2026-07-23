import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const email = (context.claims?.email as string | undefined) ?? null;

    // Remove the member's uploaded photo files (best-effort).
    try {
      const { data: files } = await supabaseAdmin.storage
        .from("photos")
        .list(userId, { limit: 1000 });
      if (files && files.length > 0) {
        await supabaseAdmin.storage
          .from("photos")
          .remove(files.map((f) => `${userId}/${f.name}`));
      }
    } catch (err) {
      console.warn("photo cleanup failed", err);
    }

    // Remove their photo rows.
    await supabaseAdmin.from("photos").delete().eq("user_id", userId);

    // Remove them from the member email list.
    if (email) {
      await supabaseAdmin
        .from("email_signups")
        .delete()
        .ilike("email", email);
    }

    // Delete the auth user.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
