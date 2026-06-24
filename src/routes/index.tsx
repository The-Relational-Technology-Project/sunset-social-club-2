import { createFileRoute } from "@tanstack/react-router";
import { AntennaLogo } from "../components/AntennaLogo";
import { Wordmark } from "../components/Wordmark";
import { EventCard } from "../components/EventCard";
import { Schedule } from "../components/Schedule";
import { EmailSignupForm } from "../components/EmailSignupForm";
import { IdeaBoard } from "../components/IdeaBoard";
import oceanBeach from "../assets/ocean_beach_sf.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunset social club" },
      { name: "description", content: "A neighborhood club in the Outer Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us." },
      { property: "og:title", content: "Sunset social club" },
      { property: "og:description", content: "A neighborhood club in the Outer Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 pb-16">
      <section className="relative pt-10 pb-8 text-center">
        <div className="hero-glow" aria-hidden />
        <div className="relative z-10 flex flex-col items-center">
          <AntennaLogo variant="hero" className="h-44 w-44 sm:h-52 sm:w-52" />
          <div className="mt-4">
            <Wordmark variant="hero" />
          </div>
          <p className="mt-5 max-w-[34rem] text-ink/80">
            A neighborhood club in the Outer Sunset that meets on Wednesday evenings to share a meal and get to know the people who live around us.
          </p>
        </div>
      </section>

      <div className="paper-card mb-10 overflow-hidden">
        <img src={oceanBeach.url} alt="Ocean Beach, San Francisco" className="block h-40 w-full object-cover sm:h-52" />
      </div>

      <div className="mb-12">
        <EventCard />
      </div>

      <div className="mb-12">
        <Schedule />
      </div>

      <div className="mb-12">
        <EmailSignupForm />
      </div>

      <div className="mb-4">
        <IdeaBoard />
      </div>
    </main>
  );
}
