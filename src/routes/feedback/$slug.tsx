import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMemberSession } from "@/lib/member-session";
import { JULY_22_INSIGHTS_SLUG, PIZZA_PARTY_FEEDBACK_SLUG } from "@/lib/site-config";
import { notifyFeedback } from "@/lib/feedback-notify.functions";

interface FormQuestion {
  key: string;
  label: string;
  type: "textarea" | "text" | "number";
}
interface FormDef {
  slug: string;
  title: string;
  intro: string;
  questions: FormQuestion[];
}

export const Route = createFileRoute("/feedback/$slug")({
  head: () => ({
    meta: [
      { title: "Event Feedback — Sunset Social Club" },
      { name: "description", content: "Share your thoughts on a Sunset Social Club event." },
      { property: "og:title", content: "Event Feedback — Sunset Social Club" },
      { property: "og:description", content: "Share your thoughts on a Sunset Social Club event." },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { slug } = useParams({ from: "/feedback/$slug" });
  const { user, isMember } = useMemberSession();
  const [form, setForm] = useState<FormDef | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("event_feedback_forms")
        .select("slug, title, intro, questions")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) return setNotFound(true);
      setForm(data as unknown as FormDef);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const showInsightsLink = useMemo(
    () => slug === PIZZA_PARTY_FEEDBACK_SLUG,
    [slug],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSubmitting(true);
    // If authenticated: attach the caller's own user_id + email (RLS enforces this).
    // If not authenticated: submit anonymously with an optional guest email; user_id must be NULL.
    const payload: {
      form_slug: string;
      member_email: string | null;
      user_id: string | null;
      answers: Record<string, string>;
    } = user
      ? { form_slug: form.slug, member_email: user.email ?? null, user_id: user.id, answers }
      : {
          form_slug: form.slug,
          member_email: guestEmail.trim().toLowerCase() || null,
          user_id: null,
          answers,
        };
    const { error } = await supabase.from("event_feedback").insert(payload);
    setSubmitting(false);
    if (error) return setError(error.message);
    try {
      await notifyFeedback({
        data: {
          formSlug: form.slug,
          memberEmail: payload.member_email,
          answers,
        },
      });
    } catch (err) {
      console.warn("feedback notify failed", err);
    }
    setSubmitted(true);
  }


  if (notFound) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-5 sm:py-14">
        <h1 className="text-2xl font-extrabold">Feedback form not found</h1>
        <p className="mt-2 text-ink/70">This form may have been removed.</p>
        <Link to="/" className="btn-ghost btn-block-mobile mt-6">Back home</Link>
      </main>
    );
  }
  if (!form) return <main className="mx-auto max-w-xl px-4 py-10 sm:px-5 sm:py-14">Loading…</main>;

  if (submitted) {
    return (
      <main className="view-enter mx-auto max-w-xl px-4 py-10 text-center sm:px-5 sm:py-14">
        <h1 className="text-3xl font-extrabold italic">Thank you.</h1>
        <p className="mt-3 text-ink/80">Your feedback helps shape what we do next.</p>
        {showInsightsLink && (
          <Link
            to="/insights/$slug"
            params={{ slug: JULY_22_INSIGHTS_SLUG }}
            className="btn-solid btn-block-mobile mt-8"
          >
            See what neighbors shared on the walls →
          </Link>
        )}
        <div className="mt-4">
          <Link to="/member" className="text-sm text-ink/60 underline">Back to member home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="view-enter mx-auto max-w-2xl px-4 py-8 sm:px-5 sm:py-12">
      <h1 className="text-2xl font-extrabold italic sm:text-3xl">{form.title}</h1>
      {form.intro && (
        <div className="mt-4 space-y-3 whitespace-pre-wrap text-sm text-ink/80 sm:text-base">{form.intro}</div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
        {!user && (
          <div className="paper-card px-4 py-4 sm:px-5">
            <label className="field-label" htmlFor="guest-email">
              Your email (optional — so we know who you are)
            </label>
            <input
              id="guest-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
            />
            <p className="mt-2 text-xs text-ink/55">
              <Link to="/member/signin" className="underline">Sign in as a member</Link>{" "}
              to link this feedback to your account.
            </p>
          </div>
        )}
        {user && isMember && (
          <p className="text-sm text-ink/60">Submitting as {user.email}.</p>
        )}

        {form.questions.map((q) => (
          <div key={q.key}>
            <label className="field-label" htmlFor={`q-${q.key}`}>{q.label}</label>
            {q.type === "textarea" ? (
              <textarea
                id={`q-${q.key}`}
                rows={5}
                value={answers[q.key] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                className="field-input resize-y"
              />
            ) : (
              <input
                id={`q-${q.key}`}
                type={q.type === "number" ? "number" : "text"}
                inputMode={q.type === "number" ? "numeric" : undefined}
                value={answers[q.key] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                className="field-input"
              />
            )}
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-solid btn-block-mobile">
          {submitting ? "Sending…" : "Submit feedback"}
        </button>
      </form>
    </main>
  );
}
