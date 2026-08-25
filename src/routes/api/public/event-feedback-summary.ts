import { createFileRoute } from "@tanstack/react-router";

// Called on a schedule. Sends the Member Feedback summary when enough
// responses have accumulated and the oldest one is 24 hours old.
export const Route = createFileRoute("/api/public/event-feedback-summary")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.EVENT_FEEDBACK_CRON_SECRET;
        if (!secret) {
          console.error("EVENT_FEEDBACK_CRON_SECRET not configured");
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        const provided = request.headers.get("x-cron-secret") ?? "";
        const a = new TextEncoder().encode(provided);
        const b = new TextEncoder().encode(secret);
        let same = a.length === b.length;
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          if (a[i] !== b[i]) same = false;
        }
        if (!same) {
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
