import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStewardsData } from "@/lib/stewards.functions";
import {
  listAllSubmissions,
  removeFromPlaylist,
  markPlayed,
  toggleSubmissions,
} from "@/lib/jukebox-admin.functions";

export const Route = createFileRoute("/_authenticated/stewards")({
  head: () => ({ meta: [{ title: "Stewards dashboard" }] }),
  component: Stewards,
});

type Data = Awaited<ReturnType<typeof getStewardsData>>;
type Jukebox = Awaited<ReturnType<typeof listAllSubmissions>>;

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
  const fetchJukebox = useServerFn(listAllSubmissions);
  const remove = useServerFn(removeFromPlaylist);
  const played = useServerFn(markPlayed);
  const toggle = useServerFn(toggleSubmissions);

  const [data, setData] = useState<Data | null>(null);
  const [jukebox, setJukebox] = useState<Jukebox | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refreshJukebox = useCallback(() => {
    fetchJukebox().then(setJukebox).catch((e) => setError(e?.message ?? "Failed to load jukebox"));
  }, [fetchJukebox]);

  useEffect(() => {
    fetchData().then(setData).catch((e) => setError(e?.message ?? "Failed to load"));
    refreshJukebox();
  }, [fetchData, refreshJukebox]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function onRemove(id: string) {
    if (!confirm("Remove this song from the Spotify playlist?")) return;
    setBusy(id);
    const res = await remove({ data: { id } });
    setBusy(null);
    if (!res.ok) alert(res.error ?? "Failed to remove");
    refreshJukebox();
  }
  async function onPlayed(id: string) {
    setBusy(id);
    await played({ data: { id } });
    setBusy(null);
    refreshJukebox();
  }
  async function onToggle() {
    if (!jukebox?.settings) return;
    await toggle({ data: { open: !jukebox.settings.submissions_open } });
    refreshJukebox();
  }
  function copyText(text: string) {
    navigator.clipboard?.writeText(text);
  }

  if (error) return <main className="mx-auto max-w-3xl px-5 py-10"><p className="text-red-600">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-3xl px-5 py-10">Loading…</main>;

  const pending = jukebox?.submissions.filter((s) => s.status === "pending") ?? [];
  const approved = jukebox?.submissions.filter((s) => s.status === "approved" || s.status === "played") ?? [];
  const rejected = jukebox?.submissions.filter((s) => s.status === "rejected") ?? [];

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Stewards dashboard</h1>
        <button onClick={signOut} className="btn-ghost">Sign out</button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-xl font-bold">Jukebox ({pending.length} pending)</h2>
          {jukebox?.settings && (
            <button onClick={onToggle} className="btn-ghost">
              {jukebox.settings.submissions_open ? "Pause submissions" : "Open submissions"}
            </button>
          )}
        </div>

        <h3 className="font-semibold mt-2 mb-2">Pending</h3>
        {pending.length === 0 ? (
          <p className="text-ink/60 mb-4">Nothing pending.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {pending.map((s) => (
              <li key={s.id} className="paper-card flex flex-wrap items-center gap-3 px-4 py-3">
                {s.album_art_url && <img src={s.album_art_url} alt="" className="h-14 w-14 rounded flex-none" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{s.track_name}</p>
                  <p className="text-sm text-ink/60 truncate">{s.artist_name}</p>
                  <p className="text-xs text-ink/50">by {s.requester_name} · {new Date(s.created_at).toLocaleTimeString()}</p>
                  {s.approve_error && <p className="text-xs text-red-600 mt-1">{s.approve_error}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost text-sm" onClick={() => copyText(`${s.track_name} — ${s.artist_name}`)}>Copy</button>
                  <button className="btn-ghost text-sm" onClick={() => onReject(s.id)} disabled={busy === s.id}>Reject</button>
                  <button className="btn-solid text-sm" onClick={() => onApprove(s.id)} disabled={busy === s.id}>
                    {busy === s.id ? "…" : "Approve + add to playlist"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-semibold mt-4 mb-2">Approved ({approved.length})</h3>
        <ul className="space-y-2 mb-6">
          {approved.map((s) => (
            <li key={s.id} className="paper-card flex items-center gap-3 px-4 py-3">
              {s.album_art_url && <img src={s.album_art_url} alt="" className="h-10 w-10 rounded flex-none" />}
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{s.track_name} <span className="text-ink/50 font-normal">— {s.artist_name}</span></p>
                <p className="text-xs text-ink/50">by {s.requester_name} · {s.status === "played" ? "played" : "in playlist"}</p>
              </div>
              {s.status === "approved" && (
                <button className="btn-ghost text-sm" onClick={() => onPlayed(s.id)}>Mark played</button>
              )}
            </li>
          ))}
        </ul>

        {rejected.length > 0 && (
          <>
            <h3 className="font-semibold mt-4 mb-2">Rejected ({rejected.length})</h3>
            <ul className="space-y-1 text-sm text-ink/60">
              {rejected.map((s) => (
                <li key={s.id}>{s.track_name} — {s.artist_name} (from {s.requester_name})</li>
              ))}
            </ul>
          </>
        )}
      </section>

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
