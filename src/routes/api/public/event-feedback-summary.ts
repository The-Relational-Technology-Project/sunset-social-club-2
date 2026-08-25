import { createFileRoute } from "@tanstack/react-router";

// Called on a schedule. Sends the Member Feedback summary when enough
// responses have accumulated and the oldest one is 24 hours old.
export const Route = createFileRoute("/api/public/event-feedback-summary")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cronSecret = process.env.EVENT_FEEDBACK_CRON_SECRET;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!cronSecret && !serviceKey) {
          console.error("No scheduler credential configured");
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        const authHeader = request.headers.get("authorization") ?? "";
        const bearer = authHeader.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length).trim()
          : "";
        const provided = request.headers.get("x-cron-secret") ?? "";

        const authorized =
          (!!serviceKey && bearer === serviceKey) ||
          (!!cronSecret && provided === cronSecret);

        if (!authorized) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }


        try {
          const { sendEventFeedbackSummary } = await import("@/lib/event-feedback.server");
          const result = await sendEventFeedbackSummary();
          return Response.json(result);
        } catch (e) {
          console.error("Feedback summary failed", e);
          return Response.json({ error: "Failed to send summary" }, { status: 500 });
        }
      },
    },
  },
});
