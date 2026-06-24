import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { EVENT_RSVP_URL } from "../lib/site-config";

export function Header() {
  return (
    <header className="w-full border-b border-[rgba(29,28,26,0.10)]">
      <a
        href={EVENT_RSVP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-sunset text-paper transition-opacity hover:opacity-95"
      >
        <div className="mx-auto flex max-w-[640px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center text-sm">
          <span className="eyebrow opacity-90">July 22 · Kickoff</span>
          <span className="font-extrabold tracking-tight">Volunteer Day + Pizza Party</span>
          <span className="opacity-90">Tap for details and to RSVP →</span>
        </div>
      </a>
      <div className="mx-auto flex max-w-[640px] items-center justify-between px-5 py-4">
        <Link to="/" aria-label="Sunset social club, home" className="flex items-center">
          <Logo variant="wordmark-nav" />
        </Link>
        <nav className="flex items-center gap-5 text-[0.95rem]">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-ink" }} className="text-dusk hover:text-ink">
            Home
          </Link>
          <Link to="/about" activeProps={{ className: "text-ink" }} className="text-dusk hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

