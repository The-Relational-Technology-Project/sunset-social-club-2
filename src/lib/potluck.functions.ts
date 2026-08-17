import { createServerFn } from "@tanstack/react-start";

function validate(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const name = String(d.name ?? "").trim().slice(0, 100);
  const bringing = String(d.bringing ?? "").trim().slice(0, 200);
  if (!name || !bringing) throw new Error("Name and dish required");
  return { name, bringing };
}

export const submitPotluck = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { processPotluck } = await import("./potluck.server");
    return processPotluck(data);
  });
