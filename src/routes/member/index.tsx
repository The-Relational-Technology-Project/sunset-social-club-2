import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useMemberSession } from "@/lib/member-session";
import { PhotoGallery } from "@/components/PhotoGallery";
import { deleteMyAccount } from "@/lib/account.functions";
import {
  COMMUNITY_PLAYLIST_URL,
  PIZZA_PARTY_FEEDBACK_SLUG,
  JULY_22_INSIGHTS_SLUG,
} from "@/lib/site-config";

export const Route = createFileRoute("/member/")({
  head: () => ({
    meta: [
      { title: "Member Home — Sunset Social Club" },
      { name: "description", content: "Your Sunset Social Club member home: event feedback, photos, community insights, and more." },
      { property: "og:title", content: "Member Home — Sunset Social Club" },
      { property: "og:description", content: "Your Sunset Social Club member home." },
    ],
  }),
  component: MemberHome,
});

function MemberHome() {
  const navigate = useNavigate();
  const { loading, user, isMember } = useMemberSession();

  useEffect(() => {
    if (loading) return;
    if (!user || !isMember) navigate({ to: "/member/signin" });
  }, [loading, user, isMember, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/member/signin" });
  }

  if (loading) {
    return <main className="mx-auto max-w-2xl px-5 py-14">Loading…</main>;
  }
  if (!user || !isMember) {
    return <main className="mx-auto max-w-2xl px-5 py-14">Redirecting to sign in…</main>;
  }

  return (
    <main className="view-enter mx-auto max-w-2xl px-5 py-12">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold italic">Member home</h1>
          <p className="mt-1 text-ink/70">Welcome back, {user.email}.</p>
        </div>
        <button onClick={signOut} className="btn-ghost text-sm">Sign out</button>
      </header>

      {/* Event feedback */}
      <section className="paper-card mt-10 px-6 py-6">
        <h2 className="text-xl font-extrabold italic">Event feedback</h2>
        <p className="mt-2 text-ink/75">
          Help shape what we do next. Share your thoughts on our first Kick-off Pizza Party.
        </p>
        <Link
          to="/feedback/$slug"
          params={{ slug: PIZZA_PARTY_FEEDBACK_SLUG }}
          className="btn-solid mt-4 inline-block"
        >
          Kick-off Pizza Party reflections →
        </Link>
      </section>

      {/* Community insights */}
      <section className="paper-card mt-6 px-6 py-6">
        <h2 className="text-xl font-extrabold italic">Community insights</h2>
        <p className="mt-2 text-ink/75">
          What neighbors shared on the walls, in their own words.
        </p>
        <Link
          to="/insights/$slug"
          params={{ slug: JULY_22_INSIGHTS_SLUG }}
          className="btn-ghost mt-4 inline-block"
        >
          July 22 kickoff: what went up on the walls →
        </Link>
      </section>

      {/* Photos */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold italic">Photos</h2>
        <p className="mt-2 text-ink/75">
          Share photos of the neighborhood, club events, or neighbors together. Photos are reviewed
          by stewards before appearing in the gallery.
        </p>
        <div className="mt-5">
          <PhotoGallery user={user} />
        </div>
      </section>

      {/* Playlist + Idea */}
      <section className="paper-card mt-10 px-6 py-6">
        <h2 className="text-xl font-extrabold italic">Community links</h2>
        <ul className="mt-3 space-y-3">
          <li>
            <a
              href={COMMUNITY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sunset underline hover:opacity-80"
            >
              🎵 Community playlist on Spotify →
            </a>
          </li>
          <li>
            <Link to="/jukebox" className="text-sunset underline hover:opacity-80">
              🎶 Add a song to the club jukebox →
            </Link>
          </li>
          <li>
            <Link to="/" hash="ideas" className="text-sunset underline hover:opacity-80">
              💡 Submit an idea for the club →
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
