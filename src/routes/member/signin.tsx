import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isMemberEmail } from "@/lib/member-session";

export const Route = createFileRoute("/member/signin")({
  head: () => ({
    meta: [
      { title: "Member Sign In — Sunset Social Club" },
      { name: "description", content: "Sign in to the Sunset Social Club member area." },
      { property: "og:title", content: "Member Sign In — Sunset Social Club" },
      { property: "og:description", content: "Sign in to the Sunset Social Club member area." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: MemberSignInPage,
});

type Step = "email" | "code";

function MemberSignInPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/member/signin" });
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const member = await isMemberEmail(data.user.email ?? "");
      if (member) navigate({ to: search.redirect ?? "/member" });
    });
  }, [navigate, search.redirect]);

  async function onRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setLoading(false);
      return setError("Please enter your email.");
    }
    const isMember = await isMemberEmail(normalized);
    if (!isMember) {
      setLoading(false);
      return setError("That email isn't on our member list yet. Join the Club first, then come back to sign in.");
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/member`,
      },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setEmail(normalized);
    setStep("code");
    setNotice("Check your email for a magic link, or enter the 6-digit code we sent.");
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: search.redirect ?? "/member" });
  }

  return (
    <main className="view-enter mx-auto max-w-md px-4 py-10 sm:px-5 sm:py-14">
      <h1 className="text-2xl font-extrabold italic sm:text-3xl">Member sign in</h1>
      <p className="mt-2 text-sm text-ink/70 sm:text-base">
        Enter your email. We'll send you a magic link and a 6-digit code — use either one.
      </p>

      {step === "email" && (
        <form onSubmit={onRequestCode} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="member-email">Email</label>
            <input
              id="member-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-solid btn-block-mobile">
            {loading ? "Sending…" : "Send me a magic link"}
          </button>
          <p className="text-sm text-ink/60">
            Not a member yet?{" "}
            <Link to="/join" className="underline">Join the Club</Link>{" "}
            and your email will be added automatically.
          </p>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={onVerify} className="mt-6 space-y-4">
          {notice && <p className="text-sm text-ink/80">{notice}</p>}
          <div>
            <label className="field-label" htmlFor="member-code">6-digit code</label>
            <input
              id="member-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="field-input text-center text-xl tracking-[0.4em]"
              placeholder="123456"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-solid btn-block-mobile">
            {loading ? "Verifying…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => { setStep("email"); setCode(""); setNotice(null); setError(null); }}
            className="text-sm text-ink/60 underline"
          >
            Use a different email
          </button>
        </form>
      )}
    </main>
  );
}
