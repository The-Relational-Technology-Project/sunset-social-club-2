import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { searchSpotify, submitSong } from "@/lib/jukebox.functions";
import type { SpotifyTrack } from "@/lib/spotify.server";

type Result = Pick<SpotifyTrack, "id" | "name" | "artists" | "albumArt" | "album">;

interface Props {
  submissionsOpen: boolean;
  onSubmitted: () => void;
}

const labelCls =
  "block text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-2";
const inputCls =
  "w-full bg-black border-2 border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ec6a4c] transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]";

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
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!submissionsOpen) {
    return (
      <div className="text-center py-6">
        <p className="text-neutral-400 text-sm">
          Submissions are paused. Check back at the next gathering.
        </p>
      </div>
    );
  }

  const canSubmit = !!name.trim() && !!selected && !submitting;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="jb-name" className={labelCls}>Your name</label>
        <input
          id="jb-name"
          type="text"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What we'll call you"
          className={inputCls}
        />
      </div>

      <div className="relative">
        <label htmlFor="jb-song" className={labelCls}>Search Spotify</label>
        <input
          id="jb-song"
          type="text"
          value={selected ? `${selected.name} — ${selected.artists}` : query}
          onChange={(e) => {
            setSelected(null);
            setQuery(e.target.value);
          }}
          placeholder="Song or artist"
          className={inputCls}
          autoComplete="off"
        />
        {searching && (
          <p className="mt-1.5 text-[10px] uppercase tracking-widest text-neutral-500">
            Searching…
          </p>
        )}

        {!selected && results.length > 0 && (
          <div className="mt-3 bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelected(r);
                  setResults([]);
                }}
                className="w-full flex items-center gap-3 p-3 text-left border-b border-neutral-800 last:border-b-0 hover:bg-[#ec6a4c]/10 transition-colors group"
              >
                {r.albumArt ? (
                  <img src={r.albumArt} alt="" className="h-12 w-12 flex-none rounded-lg" />
                ) : (
                  <div className="h-12 w-12 flex-none rounded-lg bg-neutral-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{r.name}</p>
                  <p className="truncate text-[10px] uppercase tracking-wider text-neutral-500">
                    {r.artists}
                  </p>
                </div>
                <span className="mr-1 text-lg font-black text-neutral-700 group-hover:text-[#ec6a4c] transition-colors">
                  +
                </span>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-3 bg-[#ec6a4c]/10 border-2 border-[#ec6a4c]/40 rounded-2xl p-3 flex items-center gap-3">
            {selected.albumArt ? (
              <img src={selected.albumArt} alt="" className="h-12 w-12 flex-none rounded-lg" />
            ) : (
              <div className="h-12 w-12 flex-none rounded-lg bg-neutral-800" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{selected.name}</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-neutral-400">
                {selected.artists}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white"
            >
              Change
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-[#ec6a4c] text-white font-black py-5 rounded-2xl text-sm uppercase tracking-[0.25em] shadow-[0_6px_0_rgb(170,70,45),0_10px_20px_rgba(236,106,76,0.35)] active:translate-y-1.5 active:shadow-[0_0_0_rgb(170,70,45),0_4px_8px_rgba(236,106,76,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0"
      >
        {submitting ? "Dropping the coin…" : "Add to queue"}
      </button>

      {message && (
        <div
          className={
            message.kind === "ok"
              ? "text-center animate-fade-in"
              : "text-center text-red-400 text-sm"
          }
        >
          {message.kind === "ok" ? (
            <div className="inline-block px-4 py-2 bg-[#ec6a4c]/10 border border-[#ec6a4c]/40 rounded-full">
              <p className="text-[11px] text-[#ec6a4c] font-black uppercase tracking-widest">
                {message.text}
              </p>
            </div>
          ) : (
            message.text
          )}
        </div>
      )}
    </form>
  );
}
