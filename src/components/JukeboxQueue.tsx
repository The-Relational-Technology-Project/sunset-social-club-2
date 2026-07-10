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

  if (upNext.length === 0) {
    return (
      <div className="py-2">
        <p className="text-xs text-neutral-500">
          {total === 0
            ? "No songs yet. Yours could be first."
            : "Loading songs…"}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {upNext.map((row, i) => (
        <li key={row.id} className="flex items-center gap-3">
          <div
            className={
              "h-7 w-7 flex-none rounded-full border flex items-center justify-center text-[10px] font-black " +
              (i === 0
                ? "bg-[#ec6a4c] border-[#ec6a4c] text-white"
                : "bg-neutral-800 border-neutral-700 text-neutral-500")
            }
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          {row.album_art_url ? (
            <img
              src={row.album_art_url}
              alt=""
              className="h-10 w-10 flex-none rounded"
            />
          ) : (
            <div className="h-10 w-10 flex-none rounded bg-neutral-800" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{row.track_name}</p>
            <p className="truncate text-[10px] uppercase tracking-tight text-neutral-500">
              {row.artist_name} - <span className="text-neutral-300">{row.requester_name}</span>
            </p>
          </div>
          {i === 0 && (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ec6a4c]">
              Next
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
