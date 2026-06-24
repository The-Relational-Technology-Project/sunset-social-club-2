import { createFileRoute, Link } from "@tanstack/react-router";
import coffee from "../assets/coffee_and_donuts.jpg.asset.json";
import { useLanguage } from "../contexts/LanguageContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the club" },
      { name: "description", content: "Who we are and how this started." },
      { property: "og:title", content: "About the club" },
      { property: "og:description", content: "Who we are and how this started." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useLanguage();
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 py-10">
      <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">{t("about.title")}</h1>
      <p className="mt-1 text-ink/70">{t("about.subtitle")}</p>

      <p className="mt-7 text-lg text-ink/85">{t("about.p1")}</p>
      <p className="mt-5 text-ink/80">{t("about.p2")}</p>

      <div className="paper-card my-7 overflow-hidden">
        <img src={coffee.url} alt={t("hero.photoAlt")} className="block w-full object-cover" />
      </div>

      <p className="text-ink/80">{t("about.p3")}</p>
      <p className="mt-5 text-ink/80">{t("about.p4")}</p>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="text-ink/80">{t("about.cta")}</span>
        <Link to="/contact" className="btn-ghost">{t("about.ctaButton")}</Link>
      </div>
    </main>
  );
}
