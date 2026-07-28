import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { useLanguage } from "@/contexts/LanguageContext";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Terms — Sunset Social Club" },
      { name: "description", content: "How Sunset Social Club handles your information, and the simple terms for using this site." },
      { property: "og:title", content: "Privacy & Terms — Sunset Social Club" },
      { property: "og:description", content: "How Sunset Social Club handles your information, and the simple terms for using this site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <main className="view-enter mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-extrabold italic">{t("privacy.title")}</h1>

      <div className="mt-8 space-y-8 text-ink/80">
        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.who.title")}</h2>
          <p className="mt-2">{t("privacy.who.p1")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.privacy.title")}</h2>
          <div className="mt-2 space-y-3">
            <p>{t("privacy.privacy.p1")}</p>
            <p>{t("privacy.privacy.p2")}</p>
            <p>{t("privacy.privacy.p3")}</p>
            <p>{t("privacy.privacy.p4")}</p>
            <p>{t("privacy.privacy.p5")}</p>
            <p>{t("privacy.privacy.p6")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.email.title")}</h2>
          <div className="mt-2 space-y-3">
            <p>{t("privacy.email.p1")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.terms.title")}</h2>
          <div className="mt-2 space-y-3">
            <p>{t("privacy.terms.p1")}</p>
            <p>{t("privacy.terms.p2")}</p>
            <p>{t("privacy.terms.p3")}</p>
            <p>{t("privacy.terms.p4")}</p>
            <p>{t("privacy.terms.p5")}</p>
            <p>{t("privacy.terms.p6")}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.care.title")}</h2>
          <p className="mt-2">{t("privacy.care.p1")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">{t("privacy.questions.title")}</h2>
          <p className="mt-2">
            {t("privacy.questions.p1")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sunset underline hover:opacity-80">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
