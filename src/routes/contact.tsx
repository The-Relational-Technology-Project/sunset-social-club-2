import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Say hello" },
      { name: "description", content: "Coming Wednesday, want to help, or just curious. We read everything." },
      { property: "og:title", content: "Say hello" },
      { property: "og:description", content: "Coming Wednesday, want to help, or just curious. We read everything." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 py-10">
      <h1 className="text-[2.1rem] font-extrabold leading-tight tracking-tight">Say hello</h1>
      <p className="mt-1 text-ink/70">Coming Wednesday, want to help, or just curious. We read everything.</p>
      <ContactForm />
    </main>
  );
}
