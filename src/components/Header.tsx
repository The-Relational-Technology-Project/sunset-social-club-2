import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useMemberSession } from "@/lib/member-session";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useMemberSession();
  const isSignedIn = Boolean(user);


  return (
    <header className="w-full border-b border-[rgba(29,28,26,0.10)]">
      <nav className="mx-auto flex max-w-[720px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 text-sm sm:gap-x-6 sm:py-4 sm:text-[0.95rem]">
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
          to="/member"
          activeProps={{ className: "text-ink" }}
          className="text-dusk hover:text-ink"
        >
          {isSignedIn ? t("nav.memberHome") : t("nav.memberSignIn")}
        </Link>

        <Link
          to="/join"
          search={{ from: undefined }}
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
          <Languages className="ml-1.5 hidden h-3.5 w-3.5 text-dusk sm:block" aria-hidden="true" />
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
