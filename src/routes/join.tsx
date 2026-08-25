import { createFileRoute } from "@tanstack/react-router";
import { EmailSignupForm } from "../components/EmailSignupForm";
import { useLanguage } from "../contexts/LanguageContext";

export const Route = createFileRoute("/join")({
  validateSearch: (search: Record<string, unknown>) => ({
    from: search.from === "eventfeedback" ? "eventfeedback" as const : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Join the Club — Sunset Social Club" },
      { name: "description", content: "Join Sunset Social Club and get notes and updates by email." },
      { property: "og:title", content: "Join the Club — Sunset Social Club" },
      { property: "og:description", content: "Join Sunset Social Club and get notes and updates by email." },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const { t } = useLanguage();
  const { from } = Route.useSearch();
  return (
    <main className="view-enter mx-auto max-w-[560px] px-5 pt-14 pb-24 text-center">
      <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight italic sm:text-[2.5rem]">
        {t("join.title")}
      </h1>
      <p className="mt-3 text-ink/80">{t("join.subtitle")}</p>
      <div className="mt-10 text-left">
        <EmailSignupForm returnToFeedback={from === "eventfeedback"} />
      </div>
    </main>
  );
}
