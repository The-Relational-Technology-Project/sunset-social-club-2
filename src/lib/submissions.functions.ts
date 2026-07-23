import { createServerFn } from "@tanstack/react-start";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const type = d.type;
  if (type === "signup") {
    const email = String(d.email ?? "").trim().toLowerCase().slice(0, 255);
    if (!emailRegex.test(email)) throw new Error("Invalid email");
    const firstName = d.firstName ? String(d.firstName).trim().slice(0, 100) || null : null;
    const crossStreets = d.crossStreets ? String(d.crossStreets).trim().slice(0, 200) || null : null;
    return { type: "signup" as const, email, firstName, crossStreets };
  }
  if (type === "idea") {
    const idea = String(d.idea ?? "").trim().slice(0, 1000);
    const name = String(d.name ?? "").trim().slice(0, 100);
    if (!idea || !name) throw new Error("Name and idea required");
    return { type: "idea" as const, idea, name };
  }
  if (type === "contact") {
    const name = String(d.name ?? "").trim().slice(0, 100);
    const email = String(d.email ?? "").trim().toLowerCase().slice(0, 255);
    const message = String(d.message ?? "").trim().slice(0, 2000);
    if (!name || !emailRegex.test(email) || !message) throw new Error("All fields required");
    return { type: "contact" as const, name, email, message };
  }
  throw new Error("Unknown submission type");
}

export const submitPublicForm = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { processSubmission } = await import("./submissions.server");
    return processSubmission(data);
  });
