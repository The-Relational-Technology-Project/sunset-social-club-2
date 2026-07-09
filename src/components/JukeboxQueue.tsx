interface QueueRow {
  id: string;
  requester_name: string;
  track_name: string;
  artist_name: string;
  album_art_url: string | null;
  status: string;
}

interface Props {
  queue: QueueRow[];
  total: number;
}

export function JukeboxQueue({ queue, total }: Props) {
  const upNext = queue.filter((q) => q.status === "approved");
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/60">
        {total} {total === 1 ? "song submitted so far" : "songs submitted so far"}.
      </p>
      {upNext.length === 0 ? (
        <p className="text-ink/70">No songs approved yet. Yours could be first.</p>
      ) : (
        <ul className="space-y-2">
          {upNext.map((row, i) => (
            <li key={row.id} className="paper-card flex items-center gap-3 px-4 py-3">
              <span className="w-7 flex-none text-center font-bold text-sunset">{i + 1}</span>
              {row.album_art_url ? (
                <img src={row.album_art_url} alt="" className="h-12 w-12 flex-none rounded" />
              ) : (
                <div className="h-12 w-12 flex-none rounded bg-ink/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{row.track_name}</p>
                <p className="truncate text-sm text-ink/60">{row.artist_name}</p>
              </div>
              <span className="hidden text-sm text-ink/55 sm:inline">from {row.requester_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
