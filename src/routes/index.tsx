import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

import { Schedule } from "../components/Schedule";
import { EmailSignupForm } from "../components/EmailSignupForm";
import { IdeaBoard } from "../components/IdeaBoard";
import coffee from "../assets/coffee_and_donuts.jpg.asset.json";
import oceanBeach from "../assets/ocean_beach_sf.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunset social club" },
      { name: "description", content: "A club for the neighborhood. Neighbors in the Sunset coming together for West Side Wednesdays." },
      { property: "og:title", content: "Sunset social club" },
      { property: "og:description", content: "A club for the neighborhood. Neighbors in the Sunset coming together for West Side Wednesdays." },
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
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 pb-24 text-center">
      {/* Hero: logo only */}
      <section className="pt-10 pb-16 text-center sm:pt-14 sm:pb-24">
        <div className="flex flex-col items-center">
          <Logo variant="hero" />
        </div>
      </section>

      {/* A club for the neighborhood */}
      <section className="mb-16">
        <SectionHeading>A club for the neighborhood</SectionHeading>
        <p className="mt-5 text-lg text-ink/85">Most clubs are built around exclusivity.</p>
        <p className="mt-4 text-lg text-ink/85">Sunset Social Club is built around proximity.</p>
        <p className="mt-4 text-ink/80">
          If you live in the Sunset — or are a friend of the Sunset — you already have something
          meaningful in common with everyone else here. We all have a stake in the places we pass
          every day and the people with whom we share our streets and sidewalks.
        </p>
      </section>

      {/* Coffee photo */}
      <div className="paper-card mb-16 overflow-hidden">
        <img src={coffee.url} alt="Coffee and donuts" className="block w-full object-cover" />
      </div>

      {/* What do we do together */}
      <section className="mb-16">
        <SectionHeading>What do we do together?</SectionHeading>
        <p className="mt-5 text-ink/85">We're starting small with West Side Wednesdays.</p>
        <p className="mt-4 text-ink/85">Every Wednesday evening (~5:30–8 pm), we gather.</p>
        <ul className="mt-4 space-y-1.5 text-ink/80">
          <li>Sometimes we share a meal.</li>
          <li>Sometimes we play games.</li>
          <li>Sometimes someone teaches a skill.</li>
          <li>Sometimes we have (lightly) curated activities.</li>
        </ul>
        <p className="mt-4 text-ink/80">
          Every hour is a social hour. The program changes. And it's up to us to shape it.
        </p>
      </section>

      {/* What's coming up */}
      <div className="mb-16">
        <Schedule />
      </div>

      {/* Where we're headed */}
      <section className="mb-16">
        <SectionHeading>Where we're headed</SectionHeading>
        <p className="mt-5 text-ink/85">
          West Side Wednesday gatherings are just the beginning.
        </p>
        <p className="mt-4 text-ink/80">
          Our hope is that over time, Sunset Social Club becomes a consistent place where neighbors
          know one another by name, share resources, support local businesses, organize projects,
          celebrate together, and collectively shape the future of the neighborhood.
        </p>
        <p className="mt-4 text-ink/80">
          As our community evolves, what we do together will follow suit. We will create new
          traditions, rituals, and initiatives together.
        </p>
      </section>

      {/* Ocean photo */}
      <div className="paper-card mb-16 overflow-hidden">
        <img src={oceanBeach.url} alt="Ocean Beach, San Francisco" className="block h-48 w-full object-cover sm:h-64" />
      </div>

      {/* Stay in the loop */}
      <div className="mb-16">
        <EmailSignupForm />
      </div>

      {/* Idea board */}
      <div>
        <IdeaBoard />
      </div>
    </main>
  );
}
