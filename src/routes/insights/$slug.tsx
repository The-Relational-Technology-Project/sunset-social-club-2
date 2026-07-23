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
      <main className="mx-auto max-w-xl px-5 py-14">
        <h1 className="text-2xl font-extrabold">Not found</h1>
        <Link to="/" className="btn-ghost mt-6 inline-block">Back home</Link>
      </main>
    );
  }
  if (!insight) return <main className="mx-auto max-w-2xl px-5 py-14">Loading…</main>;

  return (
    <main className="view-enter mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-extrabold italic">{insight.title}</h1>
      <article className="mt-6 max-w-none text-ink/85 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="mt-10 mb-4 text-3xl font-extrabold italic text-ink" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mt-10 mb-4 text-2xl font-extrabold italic text-ink" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-8 mb-3 text-xl font-bold italic text-ink" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="my-4 text-base leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="my-4 list-disc space-y-1.5 pl-6 marker:text-ink/40" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="my-4 list-decimal space-y-1.5 pl-6 marker:text-ink/40" {...props} />
            ),
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-sunset underline hover:opacity-80" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="my-6 border-l-4 border-sunset/40 pl-4 italic text-ink/70" {...props} />
            ),
            hr: () => <hr className="my-8 border-ink/10" />,
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
