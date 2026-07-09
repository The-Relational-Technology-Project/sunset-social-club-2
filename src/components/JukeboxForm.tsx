import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { searchSpotify, submitSong } from "@/lib/jukebox.functions";
import type { SpotifyTrack } from "@/lib/spotify.server";

type Result = Pick<SpotifyTrack, "id" | "name" | "artists" | "albumArt" | "album">;

interface Props {
  submissionsOpen: boolean;
  onSubmitted: () => void;
}

export function JukeboxForm({ submissionsOpen, onSubmitted }: Props) {
  const search = useServerFn(searchSpotify);
  const submit = useServerFn(submitSong);

  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<Result | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await search({ data: { q: query } });
        setResults(res.tracks ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selected, search]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !selected || submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await submit({
        data: { requesterName: name, trackId: selected.id },
      });
      if (res.ok) {
        setPosition(res.position ?? null);
        setMessage({
          kind: "ok",
          text: `You're #${res.position ?? "?"} in line. Thanks, ${name.trim()}.`,
        });
        setSelected(null);
        setQuery("");
        setResults([]);
        onSubmitted();
      } else {
        setMessage({ kind: "err", text: res.error ?? "Something went wrong." });
      }
    } catch (err) {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!submissionsOpen) {
    return (
      <div className="paper-card px-6 py-6">
        <p className="text-ink/80">Submissions are paused right now. Check back at the next gathering.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="jb-name" className="field-label">Your name</label>
        <input
          id="jb-name"
          type="text"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What we'll call you"
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="jb-song" className="field-label">Song or artist</label>
        <input
          id="jb-song"
          type="text"
          value={selected ? `${selected.name} — ${selected.artists}` : query}
          onChange={(e) => {
            setSelected(null);
            setQuery(e.target.value);
          }}
          placeholder="Search Spotify"
          className="field-input"
          autoComplete="off"
        />
        {searching && <p className="mt-1 text-sm text-ink/50">Searching…</p>}
      </div>

      {!selected && results.length > 0 && (
        <ul className="paper-card divide-y divide-ink/10 overflow-hidden">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(r);
                  setResults([]);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-ink/5"
              >
                {r.albumArt ? (
                  <img src={r.albumArt} alt="" className="h-12 w-12 flex-none rounded" />
                ) : (
                  <div className="h-12 w-12 flex-none rounded bg-ink/10" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-sm text-ink/60">{r.artists}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="paper-card flex items-center gap-3 px-4 py-3">
          {selected.albumArt ? (
            <img src={selected.albumArt} alt="" className="h-14 w-14 flex-none rounded" />
          ) : (
            <div className="h-14 w-14 flex-none rounded bg-ink/10" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{selected.name}</p>
            <p className="truncate text-sm text-ink/60">{selected.artists}</p>
          </div>
          <button
            type="button"
            className="text-sm text-ink/60 hover:text-ink"
            onClick={() => setSelected(null)}
          >
            Change
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={!name.trim() || !selected || submitting}
        className="btn-solid disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add to the queue"}
      </button>

      {message && (
        <p className={message.kind === "ok" ? "text-sunset font-semibold" : "text-red-600"}>
          {message.text}
        </p>
      )}
    </form>
  );
}
