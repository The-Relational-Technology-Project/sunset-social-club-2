import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { CONTACT_EMAIL } from "../lib/site-config";
import { useLanguage } from "../contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-[rgba(29,28,26,0.10)]">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3 px-5 py-8 text-sm text-dusk sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/contact" className="hover:text-ink">{t("nav.contact")}</Link>
          <Link to="/privacy" className="hover:text-ink">{t("footer.privacy")}</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">{CONTACT_EMAIL}</a>
          <a
            href="https://www.instagram.com/oursunsetsocialclub/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sunset Social Club on Instagram"
            className="inline-flex items-center hover:text-ink"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
        <p className="sm:text-right">{t("footer.tagline")}</p>
      </div>
    </footer>
  );
}

