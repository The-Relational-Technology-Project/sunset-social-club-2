import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

interface Insight {
  slug: string;
  title: string;
  markdown: string;
}

export const Route = createFileRoute("/insights/$slug")({
  head: () => ({
    meta: [
      { title: "Community Insights — Sunset Social Club" },
      { name: "description", content: "Community insights from Sunset Social Club gatherings." },
      { property: "og:title", content: "Community Insights — Sunset Social Club" },
      { property: "og:description", content: "Community insights from Sunset Social Club gatherings." },
    ],
  }),
  component: InsightPage,
});

function InsightPage() {
  const { slug } = useParams({ from: "/insights/$slug" });
  const [insight, setInsight] = useState<Insight | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("community_insights")
        .select("slug, title, markdown")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) return setNotFound(true);
      setInsight(data as Insight);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (notFound) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-5 sm:py-14">
        <h1 className="text-2xl font-extrabold">Not found</h1>
        <Link to="/" className="btn-ghost btn-block-mobile mt-6">Back home</Link>
      </main>
    );
  }
  if (!insight) return <main className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-14">Loading…</main>;

  return (
    <main className="view-enter mx-auto max-w-2xl px-4 py-8 sm:px-5 sm:py-12">
      <h1 className="text-2xl font-extrabold italic sm:text-3xl">{insight.title}</h1>
      <article className="mt-6 max-w-none text-ink/85 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="mt-8 mb-3 text-2xl font-extrabold italic text-ink sm:mt-10 sm:mb-4 sm:text-3xl" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mt-8 mb-3 text-xl font-extrabold italic text-ink sm:mt-10 sm:mb-4 sm:text-2xl" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-6 mb-2 text-lg font-bold italic text-ink sm:mt-8 sm:mb-3 sm:text-xl" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="my-3 text-[15px] leading-relaxed sm:my-4 sm:text-base" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="my-3 list-disc space-y-1.5 pl-5 text-[15px] marker:text-ink/40 sm:my-4 sm:pl-6 sm:text-base" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="my-3 list-decimal space-y-1.5 pl-5 text-[15px] marker:text-ink/40 sm:my-4 sm:pl-6 sm:text-base" {...props} />
            ),
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-sunset underline hover:opacity-80" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="my-5 border-l-4 border-sunset/40 pl-4 italic text-ink/70 sm:my-6" {...props} />
            ),
            hr: () => <hr className="my-6 border-ink/10 sm:my-8" />,
            strong: ({ node, ...props }) => <strong className="font-bold text-ink" {...props} />,
            code: ({ node, ...props }) => (
              <code className="rounded bg-ink/5 px-1.5 py-0.5 text-sm" {...props} />
            ),
          }}
        >
          {insight.markdown}
        </ReactMarkdown>
      </article>
      <div className="mt-10">
        <Link to="/member" className="text-sm text-ink/60 underline">Back to member home</Link>
      </div>
    </main>
  );
}
