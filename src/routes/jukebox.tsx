import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listPublicQueue } from "@/lib/jukebox.functions";
import { JukeboxForm } from "@/components/JukeboxForm";
import { JukeboxQueue } from "@/components/JukeboxQueue";

export const Route = createFileRoute("/jukebox")({
  head: () => ({
    meta: [
      { title: "Community jukebox · Sunset Social Club" },
      {
        name: "description",
        content: "Add a song to the Sunset Social Club playlist. Neighbors picking neighbors' music.",
      },
      { property: "og:title", content: "Community jukebox · Sunset Social Club" },
      {
        property: "og:description",
        content: "Add a song to the Sunset Social Club playlist.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JukeboxPage,
});

type QueueData = Awaited<ReturnType<typeof listPublicQueue>>;

function JukeboxPage() {
  const fetchQueue = useServerFn(listPublicQueue);
  const [data, setData] = useState<QueueData | null>(null);

  const refresh = () => {
    fetchQueue()
      .then(setData)
      .catch(() => {
        /* silent */
      });
  };

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 15_000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <header className="text-center">
        <p className="eyebrow text-sunset">Community jukebox</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight">
          Pick a song for the club
        </h1>
        <p className="mt-3 text-ink/70">
          Add one to our shared playlist. A steward approves it, then it plays.
        </p>
      </header>

      <section className="mt-8">
        <JukeboxForm
          submissionsOpen={data?.submissionsOpen ?? true}
          onSubmitted={refresh}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-[1.5rem] font-extrabold italic">In the queue</h2>
        <div className="mt-4">
          {data ? (
            <JukeboxQueue queue={data.queue} total={data.total} />
          ) : (
            <p className="text-ink/60">Loading…</p>
          )}
        </div>
      </section>
    </main>
  );
}
