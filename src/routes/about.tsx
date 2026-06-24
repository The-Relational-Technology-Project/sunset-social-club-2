import { createFileRoute, Link } from "@tanstack/react-router";
import coffee from "../assets/coffee_and_donuts.jpg.asset.json";

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
  return (
    <main className="view-enter mx-auto max-w-[640px] px-5 py-10">
      <h1 className="font-hand text-[2.4rem] leading-tight">About the club</h1>
      <p className="mt-1 text-ink/70">Who we are and how this started.</p>

      <p className="mt-7 text-lg text-ink/85">
        Sunset Social Club is a small thing with a simple idea: neighbors are better off when they actually know each other.
      </p>
      <p className="mt-5 text-ink/80">
        It started the way most of these things do. A few of us live in the Outer Sunset, love it here, and realized we recognized a lot of faces without knowing many names. We wanted a regular, low-key reason to be in the same room as the people on our blocks, not for a cause or a meeting, just to share a meal and let friendships happen.
      </p>

      <div className="paper-card my-7 overflow-hidden">
        <img src={coffee.url} alt="Sunset Social Club neighbors gathered on the sidewalk" className="block w-full object-cover" />
      </div>

      <p className="text-ink/80">
        So we picked a night. Every Wednesday evening we gather at 4114 Judah Street, near 46th Avenue, in a big old church space a few blocks from Ocean Beach. Most weeks it is a shared supper. Once a month we cook a bigger dinner. Kids are free and welcome, and you do not have to be anybody's idea of a joiner to belong here.
      </p>
      <p className="mt-5 text-ink/80">
        We are at the very beginning. The space is still coming together, the schedule is loose, and a lot of what this becomes will be shaped by who shows up and what they bring. If that sounds like your kind of thing, come to a Wednesday and see.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="text-ink/80">Questions, or want to help?</span>
        <Link to="/contact" className="btn-ghost">Get in touch</Link>
      </div>
    </main>
  );
}
