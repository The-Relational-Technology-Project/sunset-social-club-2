import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isCurrentUserMember } from "@/lib/member-session";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
      const member = await isCurrentUserMember();
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
      return setError(t("signin.errEmail"));
    }
    // Membership is verified server-side after sign-in (see useMemberSession).
    // We don't reveal here whether the email is on the member list.
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
    setNotice(t("signin.notice"));
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
      <h1 className="text-2xl font-extrabold italic sm:text-3xl">{t("signin.title")}</h1>
      <p className="mt-2 text-sm text-ink/70 sm:text-base">
        {t("signin.intro")}
      </p>

      {step === "email" && (
        <form onSubmit={onRequestCode} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="member-email">{t("signin.emailLabel")}</label>
            <input
              id="member-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder={t("signin.emailPlaceholder")}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-solid btn-block-mobile">
            {loading ? t("signin.sending") : t("signin.send")}
          </button>
          <p className="text-sm text-ink/60">
            {t("signin.notMember")}{" "}
            <Link to="/join" className="underline">{t("signin.joinLink")}</Link>{" "}
            {t("signin.joinSuffix")}
          </p>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={onVerify} className="mt-6 space-y-4">
          {notice && <p className="text-sm text-ink/80">{notice}</p>}
          <div>
            <label className="field-label" htmlFor="member-code">{t("signin.codeLabel")}</label>
            <input
              id="member-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="field-input text-center text-xl tracking-[0.4em]"
              placeholder={t("signin.codePlaceholder")}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-solid btn-block-mobile">
            {loading ? t("signin.verifying") : t("signin.verify")}
          </button>
          <button
            type="button"
            onClick={() => { setStep("email"); setCode(""); setNotice(null); setError(null); }}
            className="text-sm text-ink/60 underline"
          >
            {t("signin.useDifferent")}
          </button>
        </form>
      )}
    </main>
  );
}
