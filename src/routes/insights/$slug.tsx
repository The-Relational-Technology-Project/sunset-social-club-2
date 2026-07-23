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
      <article className="prose prose-neutral mt-6 max-w-none prose-headings:italic prose-headings:font-extrabold prose-h2:text-2xl prose-p:text-ink/85 prose-li:text-ink/85 prose-a:text-sunset">
        <ReactMarkdown>{insight.markdown}</ReactMarkdown>
      </article>
      <div className="mt-10">
        <Link to="/member" className="text-sm text-ink/60 underline">Back to member home</Link>
      </div>
    </main>
  );
}
