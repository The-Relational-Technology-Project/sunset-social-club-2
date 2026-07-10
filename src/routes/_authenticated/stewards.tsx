import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStewardsData } from "@/lib/stewards.functions";
import {
  listAllSubmissions,
  toggleSubmissions,
  approveSubmission,
  rejectSubmission,
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

function copySong(trackName: string, artistName: string) {
  void navigator.clipboard?.writeText(`${trackName} - ${artistName}`);
}

function Stewards() {
  const navigate = useNavigate();
  const fetchData = useServerFn(getStewardsData);
  const fetchJukebox = useServerFn(listAllSubmissions);
  const toggle = useServerFn(toggleSubmissions);

  const [data, setData] = useState<Data | null>(null);
  const [jukebox, setJukebox] = useState<Jukebox | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function onToggle() {
    if (!jukebox?.settings) return;
    await toggle({ data: { open: !jukebox.settings.submissions_open } });
    refreshJukebox();
  }

  if (error) return <main className="mx-auto max-w-3xl px-5 py-10"><p className="text-red-600">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-3xl px-5 py-10">Loading…</main>;

  const inPlaylist = jukebox?.submissions.filter((s) => s.status === "approved" || s.status === "played") ?? [];
  const needsManualAdd = inPlaylist.filter((s) => s.approve_error && !s.added_to_playlist_at);
  const stuck = jukebox?.submissions.filter((s) => s.status === "pending") ?? [];

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Stewards dashboard</h1>
        <button onClick={signOut} className="btn-ghost">Sign out</button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-xl font-bold">Jukebox ({inPlaylist.length} submitted)</h2>
          {jukebox?.settings && (
            <button onClick={onToggle} className="btn-ghost">
              {jukebox.settings.submissions_open ? "Pause submissions" : "Open submissions"}
            </button>
          )}
        </div>

        <p className="text-sm text-ink/60 mb-4">
          Songs are saved here as soon as they're submitted. If Spotify blocks the automatic add, copy the song from here and add it in Spotify.
        </p>

        {needsManualAdd.length > 0 && (
          <div className="paper-card mb-5 border-[#ec6a4c] px-4 py-3">
            <h3 className="font-semibold">Needs manual Spotify add ({needsManualAdd.length})</h3>
            <ul className="mt-3 space-y-2">
              {needsManualAdd.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-semibold">
                    {s.track_name} <span className="text-ink/50 font-normal">- {s.artist_name}</span>
                  </span>
                  <button onClick={() => copySong(s.track_name, s.artist_name)} className="btn-ghost text-xs">
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {inPlaylist.length === 0 ? (
          <p className="text-ink/60">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {inPlaylist.map((s) => (
              <li key={s.id} className="paper-card flex flex-wrap items-center gap-3 px-4 py-3">
                {s.album_art_url && <img src={s.album_art_url} alt="" className="h-14 w-14 rounded flex-none" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{s.track_name} <span className="text-ink/50 font-normal">- {s.artist_name}</span></p>
                  <p className="text-xs text-ink/50">by {s.requester_name} · {new Date(s.created_at).toLocaleTimeString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {stuck.length > 0 && (
          <>
            <h3 className="font-semibold mt-6 mb-2">Didn't reach Spotify ({stuck.length})</h3>
            <ul className="space-y-2">
              {stuck.map((s) => (
                <li key={s.id} className="paper-card px-4 py-3">
                  <p className="font-semibold truncate">{s.track_name} - {s.artist_name}</p>
                  <p className="text-xs text-ink/50">by {s.requester_name}</p>
                  {s.approve_error && <p className="text-xs text-red-600 mt-1">{s.approve_error}</p>}
                </li>
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
