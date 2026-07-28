import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<DisplayPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [instagramOk, setInstagramOk] = useState(false);
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
      instagram_ok: instagramOk,
    });
    setUploading(false);
    if (rowErr) return setError(rowErr.message);
    setCaption("");
    setFile(null);
    setInstagramOk(false);
    setNotice(t("photos.uploaded"));
    void load();
  }


  const approved = photos.filter((p) => p.approved);
  const mineUnapproved = photos.filter((p) => p.mine && !p.approved);

  return (
    <div>
      <form onSubmit={onUpload} className="paper-card px-4 py-4 sm:px-5">
        <div>
          <label htmlFor="photo-file" className="field-label">{t("photos.uploadLabel")}</label>
          <input
            id="photo-file"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-base file:mr-3 file:rounded-full file:border file:border-ink/20 file:bg-paper file:px-3 file:py-2 file:text-sm file:font-medium"
            required
          />
        </div>
        <div className="mt-3">
          <label htmlFor="photo-caption" className="field-label">{t("photos.captionLabel")}</label>
          <input
            id="photo-caption"
            type="text"
            value={caption}
            maxLength={200}
            onChange={(e) => setCaption(e.target.value)}
            className="field-input"
            placeholder={t("photos.captionPlaceholder")}
          />
        </div>
        <div className="mt-3">
          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={instagramOk}
              onChange={(e) => setInstagramOk(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>{t("photos.instagram")}</span>
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}

        <button type="submit" disabled={uploading || !file} className="btn-solid btn-block-mobile mt-4 disabled:opacity-50">
          {uploading ? t("photos.uploading") : t("photos.upload")}
        </button>
      </form>

      {mineUnapproved.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-ink/80">{t("photos.pendingTitle")}</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {mineUnapproved.map((p) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? t("photos.awaitingAlt")} loading="lazy" className="block aspect-square w-full object-cover opacity-70" />
                <figcaption className="px-2 py-1 text-xs text-ink/60">{t("photos.pending")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold text-ink/80">{t("photos.galleryTitle", { count: approved.length })}</h3>
        {loading ? (
          <p className="mt-2 text-sm text-ink/60">{t("photos.loading")}</p>
        ) : approved.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">{t("photos.empty")}</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {approved.map((p) => (
              <figure key={p.id} className="paper-card overflow-hidden">
                <img src={p.url} alt={p.caption ?? t("photos.communityAlt")} loading="lazy" className="block aspect-square w-full object-cover" />
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
