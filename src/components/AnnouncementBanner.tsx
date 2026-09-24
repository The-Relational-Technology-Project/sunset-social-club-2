import { ANNOUNCEMENTS } from "../lib/site-config";

const TONES = {
  amber: "bg-amber/90 hover:bg-amber",
  sunset: "bg-sunset/85 hover:bg-sunset",
};

export function AnnouncementBanner() {
  if (!ANNOUNCEMENTS.length) return null;

  return (
    <div>
      {ANNOUNCEMENTS.map((a) => (
        <a
          key={a.url}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-ink transition-colors ${TONES[a.tone]}`}
        >
          <div className="mx-auto flex min-h-[56px] max-w-[860px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:min-h-[48px] sm:flex-nowrap sm:py-1.5">
            <span aria-hidden="true" className="text-base">
              {a.icon}
            </span>
            <span className="font-bold">{a.title}</span>
            <span className="hidden text-ink/40 sm:inline">•</span>
            <span className="font-semibold">{a.date}</span>
            <span className="hidden text-ink/40 sm:inline">•</span>
            <span className="text-ink/85">{a.invitation}</span>
            <span className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper">
              RSVP
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
