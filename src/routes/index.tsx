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
      { name: "description", content: "A neighborhood club in the Sunset that exists to strengthen our social fabric." },
      { property: "og:title", content: "Sunset social club" },
      { property: "og:description", content: "A neighborhood club in the Sunset that exists to strengthen our social fabric." },
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
            A neighborhood club in the Sunset that exists to strengthen our social fabric.
          </p>
        </div>
      </section>

      {/* Coffee + donuts photo right under the description */}
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
