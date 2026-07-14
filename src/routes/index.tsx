import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";
import { useLanguage } from "../contexts/LanguageContext";


import { Schedule } from "../components/Schedule";
import { IdeaBoard } from "../components/IdeaBoard";
import coffee from "../assets/coffee_and_donuts.jpg.asset.json";
import oceanBeach from "../assets/ocean_beach_sf.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunset Social Club" },
      { name: "description", content: "A club for our neighborhood. Neighbors coming together to strengthen our social fabric." },
      { property: "og:title", content: "Sunset Social Club" },
      { property: "og:description", content: "A club for our neighborhood. Neighbors coming together to strengthen our social fabric." },
    ],
  }),
  component: Home,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[1.75rem] font-extrabold leading-tight tracking-tight italic">
      {children}
    </h2>
  );
}

function Home() {
  const { t } = useLanguage();
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 pb-24 text-center">
      {/* Hero: logo + vision statement */}
      <section className="pt-10 pb-16 text-center sm:pt-14 sm:pb-24">
        <div className="flex flex-col items-center">
          <Logo variant="hero" />
          <div className="mt-8 space-y-1 text-xl italic text-ink/85 sm:text-2xl">
            <p>{t("hero.vision.l1")}</p>
            <p>{t("hero.vision.l2")}</p>
            <p>{t("hero.vision.l3")}</p>
          </div>
        </div>
      </section>

      {/* A club for our neighborhood */}
      <section className="mb-16">
        <p className="text-lg text-ink/85">
          <em className="font-semibold not-italic">{t("home.neighborhood.lead")}</em>{" "}
          {t("home.neighborhood.body")}
        </p>
      </section>

      {/* Coffee photo */}
      <div className="paper-card mb-16 overflow-hidden">
        <img src={coffee.url} alt={t("home.coffeeAlt")} className="block w-full object-cover" />
      </div>

      {/* What do we do together */}
      <section className="mb-16">
        <SectionHeading>{t("home.what.title")}</SectionHeading>
        <p className="mt-5 text-ink/85">{t("home.what.p1")}</p>
        <p className="mt-4 text-ink/85">{t("home.what.p2")}</p>
        <ul className="mt-4 space-y-1.5 text-ink/80">
          <li>{t("home.what.li1")}</li>
          <li>{t("home.what.li2")}</li>
          <li>{t("home.what.li3")}</li>
        </ul>
        <p className="mt-4 text-ink/80">{t("home.what.p3")}</p>
      </section>

      {/* What's coming up */}
      <div className="mb-16">
        <Schedule />
      </div>

      {/* Where we're headed */}
      <section className="mb-16">
        <SectionHeading>{t("home.headed.title")}</SectionHeading>
        <p className="mt-5 text-ink/85">{t("home.headed.p1")}</p>
        <p className="mt-4 text-ink/80">{t("home.headed.p2")}</p>
        <p className="mt-4 text-ink/80">{t("home.headed.p3")}</p>
      </section>

      {/* Ocean photo */}
      <div className="paper-card mb-16 overflow-hidden">
        <img src={oceanBeach.url} alt={t("photo.oceanAlt")} className="block h-48 w-full object-cover sm:h-64" />
      </div>

      {/* Join the Club CTA */}
      <section className="mb-16">
        <div className="paper-card px-6 py-10 text-center">
          <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight italic">
            {t("joinCta.title")}
          </h2>
          <p className="mt-3 text-ink/80">{t("joinCta.body")}</p>
          <Link
            to="/join"
            className="btn-solid mt-6 inline-block"
          >
            {t("joinCta.button")}
          </Link>
        </div>
      </section>

      {/* Idea board */}
      <div>
        <IdeaBoard />
      </div>
    </main>
  );
}

