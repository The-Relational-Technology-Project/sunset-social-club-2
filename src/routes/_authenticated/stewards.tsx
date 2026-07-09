import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStewardsData } from "@/lib/stewards.functions";

export const Route = createFileRoute("/_authenticated/stewards")({
  head: () => ({ meta: [{ title: "Stewards dashboard" }] }),
  component: Stewards,
});

type Data = Awaited<ReturnType<typeof getStewardsData>>;

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function Stewards() {
  const navigate = useNavigate();
  const fetchData = useServerFn(getStewardsData);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [fetchData]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (error) return <main className="mx-auto max-w-3xl px-5 py-10"><p className="text-red-600">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-3xl px-5 py-10">Loading…</main>;

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Stewards dashboard</h1>
        <button onClick={signOut} className="btn-ghost">Sign out</button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Email subscribers ({data.signups.length})</h2>
          <button
            onClick={() => download(`signups-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(data.signups))}
            className="btn-solid"
            disabled={!data.signups.length}
          >
            Download CSV
          </button>
        </div>
        <div className="border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5"><tr><th className="text-left p-2">Email</th><th className="text-left p-2">First name</th><th className="text-left p-2">Signed up</th></tr></thead>
            <tbody>
              {data.signups.map((s: any) => (
                <tr key={s.id} className="border-t"><td className="p-2">{s.email}</td><td className="p-2">{s.first_name ?? ""}</td><td className="p-2">{new Date(s.created_at).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Ideas ({data.ideas.length})</h2>
        <ul className="space-y-3">
          {data.ideas.map((i: any) => (
            <li key={i.id} className="paper-card px-5 py-4">
              <p>&ldquo;{i.idea}&rdquo;</p>
              <p className="mt-1 text-sm text-ink/55">by {i.name} · {new Date(i.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Contact messages ({data.contacts.length})</h2>
        <ul className="space-y-3">
          {data.contacts.map((c: any) => (
            <li key={c.id} className="paper-card px-5 py-4">
              <div className="flex justify-between text-sm text-ink/60"><span>{c.name} &lt;{c.email}&gt;</span><span>{new Date(c.created_at).toLocaleString()}</span></div>
              <p className="mt-2 whitespace-pre-wrap">{c.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
