import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitPotluck } from "@/lib/potluck.functions";

export const Route = createFileRoute("/potluck")({
  head: () => ({
    meta: [
      { title: "Potluck Signup — Sunset Social Club" },
      { name: "description", content: "Tell us your name and what you are bringing to the neighborhood potluck." },
      { property: "og:title", content: "Potluck Signup — Sunset Social Club" },
      { property: "og:description", content: "Tell us your name and what you are bringing to the neighborhood potluck." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PotluckPage,
});

function PotluckPage() {
  const submit = useServerFn(submitPotluck);
  const [name, setName] = useState("");
  const [bringing, setBringing] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "limited" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await submit({ data: { name, bringing } });
      if (res.rateLimited) {
        setStatus("limited");
        return;
      }
      setName("");
      setBringing("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="view-enter mx-auto max-w-[560px] px-5 pt-14 pb-24">
      <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight italic sm:text-[2.5rem]">
        Potluck
      </h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="potluck-name" className="field-label">Name</label>
          <input
            id="potluck-name" type="text" required maxLength={100} value={name}
            onChange={(e) => setName(e.target.value)} className="field-input"
          />
        </div>
        <div>
          <label htmlFor="potluck-bringing" className="field-label">What are you bringing?</label>
          <input
            id="potluck-bringing" type="text" required maxLength={200} value={bringing}
            onChange={(e) => setBringing(e.target.value)} className="field-input"
          />
        </div>
        <button type="submit" className="btn-solid" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Submit"}
        </button>
        {status === "done" && (
          <p role="status" className="text-sunset font-medium">Thank you, see you there.</p>
        )}
        {status === "limited" && (
          <p role="status" className="text-ink/70">Too many submissions right now. Please try again later.</p>
        )}
        {status === "error" && (
          <p role="status" className="text-ink/70">Something went wrong. Please try again.</p>
        )}
      </form>
    </main>
  );
}
