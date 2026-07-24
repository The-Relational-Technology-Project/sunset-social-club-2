import { createServerFn } from "@tanstack/react-start";

function validate(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const formSlug = String(d.formSlug ?? "").trim().slice(0, 200);
  const memberEmail = d.memberEmail ? String(d.memberEmail).trim().slice(0, 255) : null;
  const answers = (d.answers && typeof d.answers === "object") ? d.answers as Record<string, string> : {};
  if (!formSlug) throw new Error("formSlug required");
  return { formSlug, memberEmail, answers };
}

export const notifyFeedback = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: form } = await supabaseAdmin
      .from("event_feedback_forms")
      .select("title, questions")
      .eq("slug", data.formSlug)
      .maybeSingle();

    const title = form?.title ?? data.formSlug;
    const questions = (form?.questions as Array<{ key: string; label: string }> | null) ?? [];

    const rows = questions.length
      ? questions.map((q) => ({ label: q.label, value: data.answers[q.key] ?? "" }))
      : Object.entries(data.answers).map(([k, v]) => ({ label: k, value: String(v ?? "") }));

    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = `
      <div style="font-family:Nunito,Arial,sans-serif;max-width:640px;padding:24px;">
        <h1 style="font-size:20px;margin:0 0 8px;">New feedback: ${escape(title)}</h1>
        <p style="margin:0 0 16px;color:#555;">From: ${escape(data.memberEmail ?? "(anonymous)")}</p>
        ${rows
          .map(
            (r) => `
          <div style="margin-bottom:14px;">
            <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${escape(r.label)}</div>
            <div style="font-size:15px;color:#000;white-space:pre-wrap;">${escape(r.value || "(empty)")}</div>
          </div>`,
          )
          .join("")}
      </div>
    `;

    const text =
      `New feedback: ${title}\nFrom: ${data.memberEmail ?? "(anonymous)"}\n\n` +
      rows.map((r) => `${r.label}:\n${r.value || "(empty)"}`).join("\n\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Sunset Social Club <notifications@sunsetsocialclub.org>",
        to: ["oursunsetsocialclub@gmail.com"],
        reply_to: data.memberEmail || "oursunsetsocialclub@gmail.com",
        subject: `New feedback: ${title}`,
        html,
        text,
        tags: [{ name: "template", value: "event-feedback" }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn("feedback notify failed", res.status, body);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
