import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

import { Schedule } from "../components/Schedule";
import { EmailSignupForm } from "../components/EmailSignupForm";
import { IdeaBoard } from "../components/IdeaBoard";
import { EVENT_RSVP_URL } from "../lib/site-config";
import coffee from "../assets/coffee_and_donuts.jpg.asset.json";
import oceanBeach from "../assets/ocean_beach_sf.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunset social club" },
      { name: "description", content: "A neighborhood club in the Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us." },
      { property: "og:title", content: "Sunset social club" },
      { property: "og:description", content: "A neighborhood club in the Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 pb-24">
      {/* Hero: logo + intro, no glow, lots of room. */}
      <section className="pt-12 pb-16 text-center sm:pt-16">
        <div className="flex flex-col items-center">
          <Logo variant="hero" />
          <p className="mt-8 max-w-[34rem] text-ink/80">
            A neighborhood club in the Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us.
          </p>
        </div>
      </section>



      {/* July 22 kickoff banner */}
      <a
        href={EVENT_RSVP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-20 block rounded-2xl bg-sunset px-6 py-5 text-paper transition-transform hover:-translate-y-0.5"
        style={{ boxShadow: "0 18px 40px -22px rgba(236, 106, 76, 0.7)" }}
      >
        <p className="eyebrow opacity-90">July 22 · Kickoff</p>
        <p className="mt-1 font-hand text-[1.75rem] leading-tight">
          Volunteer Day + Pizza Party
        </p>
        <p className="mt-1 text-sm opacity-90">Tap for details and to RSVP on Luma</p>
      </a>

      {/* Coffee + donuts photo on the landing page */}
      <div className="paper-card mb-20 overflow-hidden">
        <img src={coffee.url} alt="Sunset Social Club neighbors gathered on the sidewalk" className="block w-full object-cover" />
      </div>


      <div className="mb-20">
        <Schedule />
      </div>

      <div className="mb-20">
        <EmailSignupForm />
      </div>

      {/* Waves photo, between Stay in the loop and Got an idea */}
      <div className="paper-card mb-20 overflow-hidden">
        <img src={oceanBeach.url} alt="Ocean Beach, San Francisco" className="block h-48 w-full object-cover sm:h-64" />
      </div>

      <div>
        <IdeaBoard />
      </div>

    </main>
  );
}
