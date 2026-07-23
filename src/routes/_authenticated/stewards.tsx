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
import {
  listModeration,
  setPhotoApproval,
  deletePhoto,
  upsertInsight,
  updateFeedbackForm,
} from "@/lib/moderation.functions";
import { listEmailTemplates, updateEmailTemplate } from "@/lib/email-templates.functions";

export const Route = createFileRoute("/_authenticated/stewards")({
  head: () => ({ meta: [{ title: "Stewards dashboard" }] }),
  component: Stewards,
});

type Data = Awaited<ReturnType<typeof getStewardsData>>;
type Jukebox = Awaited<ReturnType<typeof listAllSubmissions>>;
type Moderation = Awaited<ReturnType<typeof listModeration>>;
type EmailTemplates = Awaited<ReturnType<typeof listEmailTemplates>>;

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
  const toggle = useServerFn(toggleSubmissions);
  const approve = useServerFn(approveSubmission);
  const reject = useServerFn(rejectSubmission);
  const fetchModeration = useServerFn(listModeration);
  const photoApproval = useServerFn(setPhotoApproval);
  const removePhoto = useServerFn(deletePhoto);
  const saveInsight = useServerFn(upsertInsight);
  const saveForm = useServerFn(updateFeedbackForm);
  const fetchEmails = useServerFn(listEmailTemplates);
  const saveEmail = useServerFn(updateEmailTemplate);

  const [data, setData] = useState<Data | null>(null);
  const [jukebox, setJukebox] = useState<Jukebox | null>(null);
  const [moderation, setModeration] = useState<Moderation | null>(null);
  const [emails, setEmails] = useState<EmailTemplates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refreshEmails = useCallback(() => {
    fetchEmails().then(setEmails).catch((e) => setError(e?.message ?? "Failed to load emails"));
  }, [fetchEmails]);

  const refreshJukebox = useCallback(() => {
    fetchJukebox().then(setJukebox).catch((e) => setError(e?.message ?? "Failed to load jukebox"));
  }, [fetchJukebox]);

  const refreshModeration = useCallback(() => {
    fetchModeration().then(setModeration).catch((e) => setError(e?.message ?? "Failed to load moderation"));
  }, [fetchModeration]);

  useEffect(() => {
    fetchData().then(setData).catch((e) => setError(e?.message ?? "Failed to load"));
    refreshJukebox();
    refreshModeration();
    refreshEmails();
  }, [fetchData, refreshJukebox, refreshModeration, refreshEmails]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function onToggle() {
    if (!jukebox?.settings) return;
    await toggle({ data: { open: !jukebox.settings.submissions_open } });
    refreshJukebox();
  }

  async function onCopy(id: string, trackName: string, artistName: string) {
    try {
      await navigator.clipboard?.writeText(`${trackName} ${artistName}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      // no-op
    }
  }

  async function onApprove(id: string) {
    setBusyId(id);
    await approve({ data: { id } });
    setBusyId(null);
    refreshJukebox();
  }

  async function onReject(id: string) {
    setBusyId(id);
    await reject({ data: { id } });
    setBusyId(null);
    refreshJukebox();
  }

  if (error) return <main className="mx-auto max-w-3xl px-5 py-10"><p className="text-red-600">{error}</p></main>;
  if (!data) return <main className="mx-auto max-w-3xl px-5 py-10">Loading…</main>;

  const pending = jukebox?.submissions.filter((s) => s.status === "pending") ?? [];
  const approved = jukebox?.submissions.filter((s) => s.status === "approved" || s.status === "played") ?? [];
  const rejected = jukebox?.submissions.filter((s) => s.status === "rejected") ?? [];
  const pendingPhotos = (moderation?.photos ?? []).filter((p: any) => !p.approved);
  const approvedPhotos = (moderation?.photos ?? []).filter((p: any) => p.approved);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Stewards dashboard</h1>
        <button onClick={signOut} className="btn-ghost">Sign out</button>
      </div>

      {/* Photo moderation */}
      <section>
        <h2 className="text-xl font-bold mb-3">Photo review ({pendingPhotos.length} pending)</h2>
        {pendingPhotos.length === 0 ? (
          <p className="text-ink/60 mb-4">Nothing waiting for review.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6">
            {pendingPhotos.map((p: any) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? ""} className="block h-40 w-full object-cover" />
                <figcaption className="px-3 py-2 text-xs text-ink/70">
                  {p.caption && <div className="mb-1">{p.caption}</div>}
                  <div className="text-ink/50">{p.uploaded_by_email}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={async () => { await photoApproval({ data: { id: p.id, approved: true } }); refreshModeration(); }}
                      className="btn-solid text-xs"
                    >Approve</button>
                    <button
                      onClick={async () => { await removePhoto({ data: { id: p.id } }); refreshModeration(); }}
                      className="btn-ghost text-xs text-red-600"
                    >Reject</button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        <details>
          <summary className="cursor-pointer text-sm text-ink/60">Approved photos ({approvedPhotos.length})</summary>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {approvedPhotos.map((p: any) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? ""} className="block h-28 w-full object-cover" />
                <figcaption className="px-2 py-1 text-xs text-ink/60 flex justify-between">
                  <span className="truncate">{p.caption ?? ""}</span>
                  <button
                    onClick={async () => { await photoApproval({ data: { id: p.id, approved: false } }); refreshModeration(); }}
                    className="text-ink/50 underline"
                  >Unapprove</button>
                </figcaption>
              </figure>
            ))}
          </div>
        </details>
      </section>

      {/* Event feedback submissions */}
      <section>
        <h2 className="text-xl font-bold mb-3">Event feedback ({moderation?.feedback.length ?? 0})</h2>
        {(moderation?.feedback ?? []).length === 0 ? (
          <p className="text-ink/60">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {(moderation?.feedback ?? []).map((f: any) => (
              <li key={f.id} className="paper-card px-5 py-4">
                <div className="flex justify-between text-sm text-ink/60">
                  <span>{f.member_email ?? "Anonymous"} · {f.form_slug}</span>
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                </div>
                <dl className="mt-2 space-y-2">
                  {Object.entries(f.answers ?? {}).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wider text-ink/50">{k}</dt>
                      <dd className="whitespace-pre-wrap text-ink/90">{String(v ?? "")}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feedback form copy editor */}
      <section>
        <h2 className="text-xl font-bold mb-3">Edit feedback form copy</h2>
        {(moderation?.forms ?? []).map((form: any) => (
          <FormEditor
            key={form.slug}
            form={form}
            onSave={async (title, intro) => { await saveForm({ data: { slug: form.slug, title, intro } }); refreshModeration(); }}
          />
        ))}
      </section>

      {/* Community insights editor */}
      <section>
        <h2 className="text-xl font-bold mb-3">Community insights</h2>
        <InsightEditor
          existing={moderation?.insights ?? []}
          onSave={async (slug, title, markdown, published) => {
            await saveInsight({ data: { slug, title, markdown, published } });
            refreshModeration();
          }}
        />
      </section>

      {/* Jukebox */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-xl font-bold">Jukebox review</h2>
          {jukebox?.settings && (
            <button onClick={onToggle} className="btn-ghost">
              {jukebox.settings.submissions_open ? "Pause submissions" : "Open submissions"}
            </button>
          )}
        </div>
        <p className="text-sm text-ink/60 mb-4">
          Tap Copy, paste into Spotify search on your phone, add the track to the playlist, then tap Approve.
        </p>

        <h3 className="font-semibold mb-2">Waiting for review ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-ink/60 mb-6">Nothing waiting.</p>
        ) : (
          <ul className="space-y-3 mb-8">
            {pending.map((s) => (
              <li key={s.id} className="paper-card flex flex-wrap items-center gap-3 px-4 py-3">
                {s.album_art_url && <img src={s.album_art_url} alt="" className="h-14 w-14 rounded flex-none" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {s.track_name} <span className="text-ink/50 font-normal">- {s.artist_name}</span>
                  </p>
                  <p className="text-xs text-ink/50">by {s.requester_name} · {new Date(s.created_at).toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => onCopy(s.id, s.track_name, s.artist_name)} className="btn-ghost text-xs">
                    {copiedId === s.id ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={() => onApprove(s.id)} disabled={busyId === s.id} className="btn-solid text-xs disabled:opacity-50">Approve</button>
                  <button onClick={() => onReject(s.id)} disabled={busyId === s.id} className="btn-ghost text-xs text-red-600">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-semibold mb-2">In the playlist ({approved.length})</h3>
        {approved.length === 0 ? (
          <p className="text-ink/60 mb-6">Nothing approved yet.</p>
        ) : (
          <ul className="space-y-2 mb-8">
            {approved.map((s) => (
              <li key={s.id} className="paper-card flex flex-wrap items-center gap-3 px-4 py-2 text-sm">
                {s.album_art_url && <img src={s.album_art_url} alt="" className="h-10 w-10 rounded flex-none" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {s.track_name} <span className="text-ink/50 font-normal">- {s.artist_name}</span>
                  </p>
                  <p className="text-xs text-ink/50">by {s.requester_name}</p>
                </div>
                <button onClick={() => onCopy(s.id, s.track_name, s.artist_name)} className="btn-ghost text-xs">
                  {copiedId === s.id ? "Copied!" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        )}

        {rejected.length > 0 && (
          <details className="mb-4">
            <summary className="cursor-pointer text-sm text-ink/60">Rejected ({rejected.length})</summary>
            <ul className="mt-2 space-y-1 text-sm">
              {rejected.map((s) => (
                <li key={s.id} className="text-ink/50">
                  {s.track_name} - {s.artist_name} <span className="text-ink/40">(by {s.requester_name})</span>
                </li>
              ))}
            </ul>
          </details>
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

function FormEditor({ form, onSave }: { form: any; onSave: (title: string, intro: string) => Promise<void> }) {
  const [title, setTitle] = useState(form.title ?? "");
  const [intro, setIntro] = useState(form.intro ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    await onSave(title, intro);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="paper-card px-5 py-4 mb-4">
      <p className="text-xs uppercase tracking-wider text-ink/50">slug: {form.slug}</p>
      <p className="mt-1 text-xs text-ink/50">Public link: /feedback/{form.slug}</p>
      <div className="mt-3">
        <label className="field-label">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" />
      </div>
      <div className="mt-3">
        <label className="field-label">Intro (shown above the questions)</label>
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={5} className="field-input resize-y" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-solid">{saving ? "Saving…" : "Save"}</button>
        {savedAt && <span className="text-sm text-green-700">Saved at {savedAt}</span>}
      </div>
    </div>
  );
}

function InsightEditor({
  existing,
  onSave,
}: {
  existing: any[];
  onSave: (slug: string, title: string, markdown: string, published: boolean) => Promise<void>;
}) {
  const [slug, setSlug] = useState(existing[0]?.slug ?? "");
  const [title, setTitle] = useState(existing[0]?.title ?? "");
  const [markdown, setMarkdown] = useState(existing[0]?.markdown ?? "");
  const [published, setPublished] = useState<boolean>(existing[0]?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function loadExisting(s: string) {
    const row = existing.find((r) => r.slug === s);
    if (row) {
      setSlug(row.slug);
      setTitle(row.title);
      setMarkdown(row.markdown);
      setPublished(row.published);
    } else {
      setSlug(s);
      setTitle("");
      setMarkdown("");
      setPublished(true);
    }
  }

  async function save() {
    setSaving(true);
    await onSave(slug, title, markdown, published);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="paper-card px-5 py-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="field-label">Existing:</label>
        <select
          value={slug}
          onChange={(e) => loadExisting(e.target.value)}
          className="field-input max-w-xs"
        >
          {existing.map((r) => (
            <option key={r.slug} value={r.slug}>{r.slug}</option>
          ))}
          <option value="__new__">+ New insight…</option>
        </select>
      </div>
      <div>
        <label className="field-label">Slug (URL: /insights/&lt;slug&gt;)</label>
        <input value={slug === "__new__" ? "" : slug} onChange={(e) => setSlug(e.target.value)} className="field-input" />
      </div>
      <div className="mt-3">
        <label className="field-label">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" />
      </div>
      <div className="mt-3">
        <label className="field-label">Markdown body</label>
        <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={16} className="field-input resize-y font-mono text-sm" />
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} disabled={saving || !slug || slug === "__new__"} className="btn-solid disabled:opacity-50">
          {saving ? "Saving…" : "Save insight"}
        </button>
        {savedAt && <span className="text-sm text-green-700">Saved at {savedAt}</span>}
      </div>
    </div>
  );
}
