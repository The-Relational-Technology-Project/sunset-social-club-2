import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listPublicQueue } from "@/lib/jukebox.functions";
import { JukeboxForm } from "@/components/JukeboxForm";
import { JukeboxQueue } from "@/components/JukeboxQueue";
import wordmark from "../assets/ssc-script-wordmark-cream.svg.asset.json";

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
    <div className="jukebox-shell min-h-screen w-full flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Logo */}
      <a href="/" className="mb-8 sm:mb-10 opacity-90 hover:opacity-100 transition-opacity">
        <img src={wordmark.url} alt="Sunset Social Club" className="h-10 sm:h-12 w-auto" />
      </a>

      <div className="w-full max-w-[440px] space-y-6">
        {/* Main machine card */}
        <div className="jukebox-machine relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
          <div className="jukebox-stripe absolute top-0 left-0 h-1.5 w-full" />
          <JukeboxForm
            submissionsOpen={data?.submissionsOpen ?? true}
            onSubmitted={refresh}
          />
        </div>

        {/* Queue panel */}
        <div className="jukebox-queue rounded-[1.75rem] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
              Up next
            </h3>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ec6a4c] animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#ec6a4c] animate-pulse [animation-delay:100ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#ec6a4c] animate-pulse [animation-delay:200ms]" />
            </div>
          </div>
          {data ? (
            <JukeboxQueue queue={data.queue} total={data.total} />
          ) : (
            <p className="text-xs text-neutral-500">Loading…</p>
          )}
        </div>
      </div>

      <style>{`
        .jukebox-shell {
          background: #0a0a0a;
          color: #fafafa;
          font-family: 'Nunito', system-ui, sans-serif;
        }
        .jukebox-machine {
          background: #171717;
          border: 3px solid #262626;
          box-shadow: 0 32px 64px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05);
        }
        .jukebox-stripe { background: #ec6a4c; }
        .jukebox-queue {
          background: rgba(23,23,23,0.5);
          border: 1px solid #262626;
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
