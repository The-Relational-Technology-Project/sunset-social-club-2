import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitEventFeedback } from "@/lib/event-feedback.functions";

const TITLE = "Member Feedback — Sunset Social Club";
const DESCRIPTION =
  "Two quick questions about tonight's gathering. Takes a few taps on your way out.";

export const Route = createFileRoute("/eventfeedback")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventFeedbackPage,
});

type Answer = boolean | null;

function Choice({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Answer;
  onChange: (v: boolean) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-[1.2rem] font-bold leading-snug sm:text-[1.35rem]">
        {label}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {[
          { v: true, t: "Yes" },
          { v: false, t: "No" },
        ].map((o) => {
          const selected = value === o.v;
          return (
            <button
              key={o.t}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(o.v)}
              className={`min-h-[76px] rounded-2xl border bg-transparent text-[1.2rem] font-semibold text-ink transition-all ${
                selected
                  ? "border-ink/30 ring-2 ring-ink/70 ring-offset-2 ring-offset-paper"
                  : "border-ink/15 hover:border-ink/35"
              }`}
            >
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventFeedbackPage() {
  const submit = useServerFn(submitEventFeedback);
  const [metNeighbor, setMetNeighbor] = useState<Answer>(null);
  const [wouldRecommend, setWouldRecommend] = useState<Answer>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "limited" | "error">(
    "idle",
  );

  const ready = metNeighbor !== null && wouldRecommend !== null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setStatus("sending");
    try {
      const res = await submit({
        data: { metNeighbor: metNeighbor as boolean, wouldRecommend: wouldRecommend as boolean },
      });
      if (res.rateLimited) {
        setStatus("limited");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setMetNeighbor(null);
    setWouldRecommend(null);
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <main className="view-enter mx-auto max-w-[560px] px-5 pt-14 pb-24 text-center">
        <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight italic sm:text-[2.5rem]">
          Thank you
        </h1>
        <p className="mt-4 text-[1.1rem] text-ink/70">
          Want to sign up for Sunset Social Club?
        </p>
        <Link
          to="/join"
          search={{ from: "eventfeedback" }}
          className="btn-solid mt-5 inline-flex min-h-[56px] items-center justify-center px-8 text-[1.1rem]"
        >
          Join the Club
        </Link>
        <div className="mt-12">
          <button
            type="button"
            onClick={reset}
            className="min-h-[56px] w-full rounded-2xl border-2 border-ink/20 px-6 text-[1.05rem] font-bold text-ink hover:border-ink/50"
          >
            Next attendee
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="view-enter mx-auto max-w-[560px] px-6 pt-16 pb-28 sm:pt-20">
      <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight italic sm:text-[2.5rem]">
        Member Feedback
      </h1>
      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-12">
        <Choice
          label="Did you meet at least one neighbor at the event?"
          value={metNeighbor}
          onChange={setMetNeighbor}
        />
        <Choice
          label="Would you recommend this event to a friend?"
          value={wouldRecommend}
          onChange={setWouldRecommend}
        />
        <button
          type="submit"
          className="mt-2 min-h-[64px] w-full rounded-full border-2 border-sunset bg-sunset text-[1.1rem] font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          disabled={!ready || status === "sending"}
        >
          {status === "sending" ? "Sending" : "Submit"}
        </button>
        {status === "limited" && (
          <p role="status" className="text-ink/70">
            Too many submissions right now. Please try again in a bit.
          </p>
        )}
        {status === "error" && (
          <p role="status" className="text-ink/70">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </main>
  );
}
