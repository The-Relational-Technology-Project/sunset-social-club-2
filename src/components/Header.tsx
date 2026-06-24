import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="w-full border-b border-[rgba(29,28,26,0.10)]">
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
