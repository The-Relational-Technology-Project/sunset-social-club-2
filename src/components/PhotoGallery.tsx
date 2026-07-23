import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface PhotoRow {
  id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  approved: boolean;
  created_at: string;
}

interface DisplayPhoto extends PhotoRow {
  url: string;
  mine: boolean;
}

export function PhotoGallery({ user }: { user: User }) {
  const [photos, setPhotos] = useState<DisplayPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("photos")
      .select("id, user_id, storage_path, caption, approved, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as PhotoRow[];
    const withUrls = await Promise.all(
      rows.map(async (r) => {
        const { data: signed } = await supabase.storage
          .from("photos")
          .createSignedUrl(r.storage_path, 3600);
        return { ...r, url: signed?.signedUrl ?? "", mine: r.user_id === user.id };
      }),
    );
    setPhotos(withUrls.filter((p) => p.url));
    setLoading(false);
  }, [user.id]);

  useEffect(() => { void load(); }, [load]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setNotice(null);
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("photos")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setUploading(false);
      return setError(upErr.message);
    }
    const { error: rowErr } = await supabase.from("photos").insert({
      user_id: user.id,
      uploaded_by_email: user.email ?? null,
      storage_path: path,
      caption: caption.trim() || null,
    });
    setUploading(false);
    if (rowErr) return setError(rowErr.message);
    setCaption("");
    setFile(null);
    setNotice("Photo uploaded. Stewards will review it before it appears in the shared gallery.");
    void load();
  }

  const approved = photos.filter((p) => p.approved);
  const mineUnapproved = photos.filter((p) => p.mine && !p.approved);

  return (
    <div>
      <form onSubmit={onUpload} className="paper-card px-5 py-4">
        <div>
          <label htmlFor="photo-file" className="field-label">Upload a photo</label>
          <input
            id="photo-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
            required
          />
        </div>
        <div className="mt-3">
          <label htmlFor="photo-caption" className="field-label">Caption (optional)</label>
          <input
            id="photo-caption"
            type="text"
            value={caption}
            maxLength={200}
            onChange={(e) => setCaption(e.target.value)}
            className="field-input"
            placeholder="A note about this photo"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
        <button type="submit" disabled={uploading || !file} className="btn-solid mt-4 disabled:opacity-50">
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
      </form>

      {mineUnapproved.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-ink/80">Your uploads awaiting review</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mineUnapproved.map((p) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? "Awaiting review"} className="block h-32 w-full object-cover opacity-70" />
                <figcaption className="px-2 py-1 text-xs text-ink/60">Pending review</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-ink/80">Gallery ({approved.length})</h3>
        {loading ? (
          <p className="mt-2 text-sm text-ink/60">Loading…</p>
        ) : approved.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">No approved photos yet. Be the first.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {approved.map((p) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? "Community photo"} className="block h-32 w-full object-cover" />
                {p.caption && (
                  <figcaption className="px-2 py-1 text-xs text-ink/70">{p.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
