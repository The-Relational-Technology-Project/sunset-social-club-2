import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listPublicQueue } from "@/lib/jukebox.functions";
import { JukeboxForm } from "@/components/JukeboxForm";
import { JukeboxQueue } from "@/components/JukeboxQueue";
import wordmark from "../assets/ssc-script-wordmark-cream.svg.asset.json";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
    <div className="jukebox-shell min-h-screen w-full flex flex-col items-center px-4 py-6 sm:py-10">
      {/* Home link */}
      <a
        href="/"
        className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500 hover:text-[#ec6a4c] transition-colors"
      >
        ← sunsetsocialclub.org
      </a>

      <div className="w-full max-w-[460px]">
        {/* Jukebox cabinet */}
        <div className="jukebox-cabinet relative">
          {/* Arched crown */}
          <div className="jukebox-crown relative">
            <div className="jukebox-bulbs" aria-hidden />
            <div className="jukebox-marquee">
              <img src={wordmark.url} alt="Sunset Social Club" className="h-8 sm:h-10 w-auto" />
            </div>
            <div className="jukebox-bulbs jukebox-bulbs--bottom" aria-hidden />
          </div>

          {/* Speaker grilles + title plate */}
          <div className="jukebox-neck">
            <div className="jukebox-grille" aria-hidden />
            <div className="jukebox-plate">
              <span className="jukebox-plate-eyebrow">{t("jukebox.plateEyebrow")}</span>
              <span className="jukebox-plate-title">{t("jukebox.plateTitle")}</span>
            </div>
            <div className="jukebox-grille" aria-hidden />
          </div>

          {/* Selection window (form) */}
          <div className="jukebox-window">
            <div className="jukebox-window-inner">
              <JukeboxForm
                submissionsOpen={data?.submissionsOpen ?? true}
                onSubmitted={refresh}
              />
            </div>
          </div>

          {/* Coin slot base */}
          <div className="jukebox-base">
            <div className="jukebox-coinslot" aria-hidden>
              <span />
            </div>
            <div className="jukebox-base-text">
              <span className="jukebox-base-eyebrow">{t("jukebox.baseEyebrow")}</span>
              <span className="jukebox-base-sub">{t("jukebox.baseSub")}</span>
            </div>
            <div className="jukebox-lights" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        {/* Queue panel */}
        <div className="jukebox-queue mt-6 rounded-[1.75rem] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
              {t("jukebox.nowSpinning")}
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
            <p className="text-xs text-neutral-500">{t("jukebox.loading")}</p>
          )}
        </div>
      </div>

      <style>{`
        .jukebox-shell {
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(236,106,76,0.18), transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232,163,61,0.12), transparent 60%),
            #0a0a0a;
          color: #fafafa;
          font-family: 'Nunito', system-ui, sans-serif;
        }

        /* Cabinet shell */
        .jukebox-cabinet {
          background: linear-gradient(180deg, #1c1c1c 0%, #141414 100%);
          border: 3px solid #2a2a2a;
          border-radius: 140px 140px 32px 32px;
          box-shadow:
            0 40px 80px -20px rgba(0,0,0,0.9),
            inset 0 2px 0 rgba(255,255,255,0.06),
            inset 0 -2px 0 rgba(0,0,0,0.6);
          overflow: hidden;
          padding: 0;
        }

        /* Arched crown with marquee */
        .jukebox-crown {
          background:
            radial-gradient(ellipse 80% 100% at 50% 100%, rgba(236,106,76,0.35), transparent 70%),
            linear-gradient(180deg, #221410 0%, #171717 100%);
          padding: 28px 24px 20px;
          border-bottom: 2px solid #2a2a2a;
          text-align: center;
        }
        .jukebox-marquee {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 14px 16px;
          background: linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2));
          border: 1px solid rgba(236,106,76,0.35);
          border-radius: 999px;
          box-shadow:
            inset 0 0 24px rgba(236,106,76,0.25),
            0 0 24px rgba(236,106,76,0.15);
        }
        .jukebox-bulbs {
          display: flex;
          justify-content: space-between;
          padding: 0 8px 14px;
        }
        .jukebox-bulbs--bottom { padding: 14px 8px 0; }
        .jukebox-bulbs::before,
        .jukebox-bulbs::after,
        .jukebox-bulbs {
          --bulb: radial-gradient(circle, #ffd28a 0%, #e8a33d 45%, #7a4a10 100%);
        }
        .jukebox-bulbs {
          background-image:
            radial-gradient(circle at 6% 50%, #ffd28a 0 3px, transparent 4px),
            radial-gradient(circle at 20% 50%, #e8a33d 0 3px, transparent 4px),
            radial-gradient(circle at 34% 50%, #ffd28a 0 3px, transparent 4px),
            radial-gradient(circle at 50% 50%, #ec6a4c 0 3px, transparent 4px),
            radial-gradient(circle at 66% 50%, #ffd28a 0 3px, transparent 4px),
            radial-gradient(circle at 80% 50%, #e8a33d 0 3px, transparent 4px),
            radial-gradient(circle at 94% 50%, #ffd28a 0 3px, transparent 4px);
          height: 8px;
          animation: bulb-flicker 2s ease-in-out infinite;
        }

        /* Speaker neck */
        .jukebox-neck {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: linear-gradient(180deg, #171717, #121212);
          border-bottom: 2px solid #2a2a2a;
        }
        .jukebox-grille {
          height: 44px;
          border-radius: 8px;
          background-image: repeating-linear-gradient(
            90deg,
            #0a0a0a 0 3px,
            #262626 3px 5px
          );
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.8);
        }
        .jukebox-plate {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 18px;
          background: linear-gradient(180deg, #ec6a4c, #c94a2c);
          border-radius: 10px;
          box-shadow:
            0 2px 0 rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .jukebox-plate-eyebrow {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .jukebox-plate-title {
          font-family: 'Caveat', 'Nunito', cursive;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-top: -2px;
        }

        /* Selection window (contains form) */
        .jukebox-window {
          padding: 18px;
          background: linear-gradient(180deg, #0e0e0e, #141414);
        }
        .jukebox-window-inner {
          background: #171717;
          border: 2px solid #262626;
          border-radius: 20px;
          padding: 22px 20px;
          box-shadow:
            inset 0 2px 8px rgba(0,0,0,0.6),
            inset 0 0 40px rgba(236,106,76,0.04);
        }

        /* Base with coin slot */
        .jukebox-base {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 16px 22px 20px;
          background: linear-gradient(180deg, #121212, #0a0a0a);
          border-top: 2px solid #2a2a2a;
        }
        .jukebox-coinslot {
          width: 44px;
          height: 26px;
          border-radius: 6px;
          background: #050505;
          border: 1.5px solid #2a2a2a;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .jukebox-coinslot span {
          display: block;
          width: 22px;
          height: 3px;
          border-radius: 2px;
          background: #000;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
        }
        .jukebox-base-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .jukebox-base-eyebrow {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #ec6a4c;
        }
        .jukebox-base-sub {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #737373;
          margin-top: 2px;
        }
        .jukebox-lights {
          display: flex;
          gap: 6px;
        }
        .jukebox-lights span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #e8a33d;
          box-shadow: 0 0 8px rgba(232,163,61,0.7);
          animation: light-pulse 1.4s ease-in-out infinite;
        }
        .jukebox-lights span:nth-child(2) {
          background: #ec6a4c;
          box-shadow: 0 0 8px rgba(236,106,76,0.7);
          animation-delay: 0.2s;
        }
        .jukebox-lights span:nth-child(3) { animation-delay: 0.4s; }

        /* Queue panel */
        .jukebox-queue {
          background: rgba(23,23,23,0.6);
          border: 1px solid #262626;
          backdrop-filter: blur(8px);
        }

        @keyframes bulb-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes light-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        @media (max-width: 420px) {
          .jukebox-cabinet { border-radius: 110px 110px 24px 24px; }
          .jukebox-crown { padding: 22px 18px 16px; }
          .jukebox-window { padding: 14px; }
          .jukebox-window-inner { padding: 18px 16px; }
          .jukebox-base { padding: 14px 18px 16px; }
          .jukebox-grille { height: 36px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .jukebox-bulbs, .jukebox-lights span { animation: none; }
        }
      `}</style>
    </div>
  );
}
