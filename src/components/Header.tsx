import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { EVENT_RSVP_URL } from "../lib/site-config";
import { useLanguage } from "../contexts/LanguageContext";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full border-b border-[rgba(29,28,26,0.10)]">
      <a
        href={EVENT_RSVP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-sunset text-paper transition-opacity hover:opacity-95"
      >
        <div className="mx-auto flex max-w-[960px] flex-col items-center justify-center gap-1.5 px-5 py-3.5 text-center leading-tight sm:flex-row sm:gap-4 sm:py-5">
          <span className="eyebrow text-[0.7rem] leading-none opacity-90 sm:text-[0.8rem]">
            {t("banner.eyebrow")}
          </span>
          <span className="text-base font-extrabold leading-tight tracking-tight sm:text-xl">
            {t("banner.title")}
          </span>
          <span className="text-sm leading-none opacity-95 sm:text-base">
            {t("banner.cta")}
          </span>
        </div>
      </a>
      <nav className="mx-auto flex max-w-[640px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 text-sm sm:gap-x-7 sm:py-4 sm:text-[0.95rem]">
        <Link
          to="/"
          activeProps={{ className: "text-ink" }}
          activeOptions={{ exact: true }}
          className="text-dusk hover:text-ink"
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/contact"
          activeProps={{ className: "text-ink" }}
          className="text-dusk hover:text-ink"
        >
          {t("nav.contact")}
        </Link>
        <Link
          to="/join"
          activeProps={{ className: "bg-ink text-paper" }}
          className="rounded-full border border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper transition-opacity hover:opacity-90 sm:text-[0.75rem]"
        >
          {t("nav.join")}
        </Link>
        <div
          role="group"
          aria-label="Language"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[rgba(29,28,26,0.18)] bg-paper p-0.5"
        >
          <Languages
            className="ml-1.5 hidden h-3.5 w-3.5 text-dusk sm:block"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
            className={
              "rounded-full px-2 py-1 text-xs font-semibold transition-colors " +
              (language === "en" ? "bg-ink text-paper" : "text-dusk hover:text-ink")
            }
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("zh")}
            aria-pressed={language === "zh"}
            className={
              "rounded-full px-2 py-1 text-xs font-semibold transition-colors " +
              (language === "zh" ? "bg-ink text-paper" : "text-dusk hover:text-ink")
            }
          >
            中文
          </button>
        </div>
      </nav>
    </header>
  );
}
