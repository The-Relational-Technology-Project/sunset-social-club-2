import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery tokens from the URL hash automatically and
    // fires a PASSWORD_RECOVERY event. Wait for a session before enabling the form.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    setNotice("Password updated. Redirecting…");
    setTimeout(() => navigate({ to: "/stewards" }), 800);
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-extrabold">Set a new password</h1>
      {!ready ? (
        <p className="mt-3 text-ink/70">
          Open this page from the reset link in your email. If you already did and still see this, request a new link.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label">New password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">Confirm password</label>
            <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field-input" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {notice && <p className="text-green-700 text-sm">{notice}</p>}
          <button type="submit" disabled={loading} className="btn-solid">
            {loading ? "…" : "Update password"}
          </button>
        </form>
      )}
    </main>
  );
}
