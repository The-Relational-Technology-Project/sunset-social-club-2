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
        <div className="mx-auto flex max-w-[960px] flex-col items-center justify-center gap-1 px-5 py-4 text-center sm:flex-row sm:gap-4 sm:py-5">
          <span className="eyebrow text-[0.8rem] opacity-90">July 22 · Kickoff</span>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">
            Volunteer Day + Pizza Party
          </span>
          <span className="text-sm opacity-95 sm:text-base">Tap to RSVP →</span>
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

