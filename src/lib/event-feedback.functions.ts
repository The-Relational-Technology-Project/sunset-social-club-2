import { createServerFn } from "@tanstack/react-start";

function validate(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  if (typeof d.metNeighbor !== "boolean" || typeof d.wouldRecommend !== "boolean") {
    throw new Error("Both answers are required");
  }
  return { metNeighbor: d.metNeighbor, wouldRecommend: d.wouldRecommend };
}

export const submitEventFeedback = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { processEventFeedback } = await import("./event-feedback.server");
    return processEventFeedback(data);
  });
