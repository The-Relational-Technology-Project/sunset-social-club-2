import { ANNOUNCEMENTS } from "../lib/site-config";

const TONES = {
  amber: "bg-amber/90 hover:bg-amber text-ink",
  sunset: "bg-sunset/85 hover:bg-sunset text-ink",
  wave: "bg-wave-sky hover:brightness-95 text-wave-navy",
};

const PILLS = {
  amber: "border-ink bg-ink text-paper",
  sunset: "border-ink bg-ink text-paper",
  wave: "border-wave-navy bg-wave-yellow text-wave-navy",
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
          className={`block w-full transition-all ${TONES[a.tone]}`}
        >
          <div className="mx-auto flex min-h-[56px] max-w-[1280px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:min-h-[48px] sm:flex-nowrap sm:py-1.5">
            {a.icon && (
              <span aria-hidden="true" className="text-base">
                {a.icon}
              </span>
            )}
            <span className="shrink-0 font-bold">{a.title}</span>
            {a.date && (
              <>
                <span className="hidden opacity-40 sm:inline">•</span>
                <span className="shrink-0 font-semibold">{a.date}</span>
              </>
            )}
            {a.invitation && (
              <>
                <span className="hidden opacity-40 sm:inline">•</span>
                <span className="opacity-85">{a.invitation}</span>
              </>
            )}
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${PILLS[a.tone]}`}>
              {a.cta ?? "RSVP"}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
