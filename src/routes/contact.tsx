import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../components/ContactForm";
import { useLanguage } from "../contexts/LanguageContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Say hello" },
      { name: "description", content: "Want to help or ask a question? Please reach out." },
      { property: "og:title", content: "Say hello" },
      { property: "og:description", content: "Want to help or ask a question? Please reach out." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLanguage();
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 py-10">
      <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">{t("contact.title")}</h1>
      <p className="mt-1 text-ink/70">{t("contact.subtitle")}</p>
      <ContactForm />
    </main>
  );
}
