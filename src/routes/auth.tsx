import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ALLOWED = ["joshuanesbit@gmail.com", "sandi.lamharder@gmail.com"];

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Stewards sign in" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/stewards" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const normalized = email.trim().toLowerCase();
    if (!ALLOWED.includes(normalized)) {
      setError("This email is not authorized for the stewards portal.");
      setLoading(false);
      return;
    }
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) return setError(error.message);
      setNotice("Check your email for a link to reset your password.");
      return;
    }
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn.call(supabase.auth, { email: normalized, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/stewards" });
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-extrabold">Stewards portal</h1>
      <p className="mt-1 text-ink/70">
        {mode === "forgot" ? "Reset your password." : "Sign in to manage the club."}
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </div>
        {mode !== "forgot" && (
          <div>
            <label className="field-label">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
          </div>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {notice && <p className="text-green-700 text-sm">{notice}</p>}
        <button type="submit" disabled={loading} className="btn-solid">
          {loading ? "…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink/70">
          {mode !== "signin" && (
            <button type="button" onClick={() => { setMode("signin"); setError(null); setNotice(null); }} className="underline">
              Sign in
            </button>
          )}
          {mode !== "signup" && (
            <button type="button" onClick={() => { setMode("signup"); setError(null); setNotice(null); }} className="underline">
              Create account
            </button>
          )}
          {mode !== "forgot" && (
            <button type="button" onClick={() => { setMode("forgot"); setError(null); setNotice(null); }} className="underline">
              Forgot password?
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
