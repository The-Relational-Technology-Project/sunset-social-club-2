import { Link } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "../lib/site-config";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[rgba(29,28,26,0.10)]">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 px-5 py-8 text-sm text-dusk sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">{CONTACT_EMAIL}</a>
        </div>
        <p className="sm:text-right">Sunset, San Francisco · made by neighbors</p>
      </div>
    </footer>
  );
}
