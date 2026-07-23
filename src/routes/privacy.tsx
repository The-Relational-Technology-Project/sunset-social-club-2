import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "@/lib/site-config";

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
  return (
    <main className="view-enter mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-extrabold italic">Privacy & Terms</h1>

      <div className="mt-8 space-y-8 text-ink/80">
        <section>
          <h2 className="text-xl font-semibold text-ink">Who we are</h2>
          <p className="mt-2">
            Sunset Social Club is a neighborhood club run by people who live in the Sunset in San Francisco.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Privacy</h2>
          <div className="mt-2 space-y-3">
            <p>We don't sell or share your data.</p>
            <p>We don't use tracking cookies.</p>
            <p>
              If you give us your contact information when joining the club, submitting an idea, or contacting us,
              we'll only use it for the purpose you expect (like sending you club updates or replying to your note).
            </p>
            <p>Members can delete their account and associated data at any time from the Member Home page.</p>
            <p>You can also ask us to delete your information at any time.</p>
            <p>This site is intended for people 14 and older.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Email</h2>
          <div className="mt-2 space-y-3">
            <p>
              If you join the club, we'll email you occasional updates about what's happening. You can unsubscribe
              at any time using the link in any email.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Terms of Use</h2>
          <div className="mt-2 space-y-3">
            <p>Please use this site with care and respect.</p>
            <p>You are responsible for your own actions when participating in events and gatherings.</p>
            <p>We don't endorse user-submitted content.</p>
            <p>We accept no liability for what happens in and around this club.</p>
            <p>This site is operated in CA, USA and any disputes are subject to its laws.</p>
            <p>We may update these terms if needed, but we'll keep them simple and human.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Community Care</h2>
          <p className="mt-2">
            We know things don't always go perfectly. If a misunderstanding or conflict arises,
            our stewards are happy to help neighbors talk it through and find repair.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Questions?</h2>
          <p className="mt-2">
            Reach us at{" "}
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
