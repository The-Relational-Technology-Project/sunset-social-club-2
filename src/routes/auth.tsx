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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/stewards" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const normalized = email.trim().toLowerCase();
    if (!ALLOWED.includes(normalized)) {
      setError("This email is not authorized for the stewards portal.");
      setLoading(false);
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
      <p className="mt-1 text-ink/70">Sign in to manage the club.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-solid">
          {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="ml-3 text-sm text-ink/70 underline"
        >
          {mode === "signin" ? "First time? Create account" : "Have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
