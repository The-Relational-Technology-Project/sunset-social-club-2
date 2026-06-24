import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { Logo } from "./Logo";
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
        <div className="mx-auto flex max-w-[960px] flex-col items-center justify-center gap-1 px-5 py-4 text-center sm:flex-row sm:gap-4 sm:py-5">
          <span className="eyebrow text-[0.8rem] opacity-90">{t("banner.eyebrow")}</span>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">
            {t("banner.title")}
          </span>
          <span className="text-sm opacity-95 sm:text-base">{t("banner.cta")}</span>
        </div>
      </a>
      <div className="mx-auto flex max-w-[640px] items-center justify-between px-5 py-4">
        <Link to="/" aria-label="Sunset social club, home" className="flex items-center">
          <Logo variant="wordmark-nav" />
        </Link>
        <nav className="flex items-center gap-3 text-[0.95rem] sm:gap-5">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-ink" }} className="text-dusk hover:text-ink">
            {t("nav.home")}
          </Link>
          <Link to="/about" activeProps={{ className: "text-ink" }} className="text-dusk hover:text-ink">
            {t("nav.about")}
          </Link>
          <div
            role="group"
            aria-label="Language"
            className="ml-1 inline-flex items-center gap-1 rounded-full border border-[rgba(29,28,26,0.18)] bg-paper p-0.5"
          >
            <Languages className="ml-1.5 hidden h-3.5 w-3.5 text-dusk sm:block" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors " +
                (language === "en"
                  ? "bg-ink text-paper"
                  : "text-dusk hover:text-ink")
              }
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("zh")}
              aria-pressed={language === "zh"}
              className={
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors " +
                (language === "zh"
                  ? "bg-ink text-paper"
                  : "text-dusk hover:text-ink")
              }
            >
              中文
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
