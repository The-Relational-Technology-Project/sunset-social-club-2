import { ANNOUNCEMENT } from "../lib/site-config";

export function AnnouncementBanner() {
  if (!ANNOUNCEMENT) return null;

  return (
    <a
      href={ANNOUNCEMENT.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-amber/90 text-ink transition-colors hover:bg-amber"
    >
      <div className="mx-auto flex min-h-[52px] max-w-[860px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:min-h-[48px] sm:flex-nowrap sm:py-1.5">
        <span aria-hidden="true" className="text-base">
          🍽️
        </span>
        <span className="font-bold">{ANNOUNCEMENT.title}</span>
        <span className="hidden text-ink/40 sm:inline">•</span>
        <span className="font-semibold">{ANNOUNCEMENT.date}</span>
        <span className="hidden text-ink/40 sm:inline">•</span>
        <span className="text-ink/80">{ANNOUNCEMENT.invitation}</span>
        <span className="rounded-full border border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper">
          RSVP
        </span>
      </div>
    </a>
  );
}
