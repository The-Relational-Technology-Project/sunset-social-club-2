import { useEffect, useState } from "react";
import { submitForm } from "../lib/site-config";
import { supabase } from "../integrations/supabase/client";
import { useLanguage } from "../contexts/LanguageContext";

type Idea = { idea: string; name: string };

const SEED: Idea[] = [
  { idea: "A Saturday morning repair cafe, fix bikes and lamps and toasters", name: "Mara" },
  { idea: "Cantonese home-cooking night, the aunties teach the rest of us", name: "Wei" },
  { idea: "Sidewalk chalk for the kids, coffee for the grown-ups", name: "Dani" },
];

export function IdeaBoard() {
  const { t } = useLanguage();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("idea, name")
        .order("created_at", { ascending: false })
        .limit(100);
      if (cancelled) return;
      if (error || !data) {
        setIdeas(SEED);
      } else {
        setIdeas(data.length ? data : SEED);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Idea = { idea: idea.trim(), name: name.trim() };
    if (!next.idea || !next.name) return;
    setIdeas((prev) => [next, ...prev.filter((i) => i !== SEED[0] || loaded)]);
    setIdea("");
    setName("");
    await submitForm("idea", { idea: next.idea, name: next.name });
  }

  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight">{t("ideas.title")}</h2>
      <p className="mt-1 text-ink/70">{t("ideas.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="idea-text" className="field-label">{t("ideas.ideaLabel")}</label>
          <textarea
            id="idea-text" required value={idea} rows={3} maxLength={1000}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={t("ideas.ideaPlaceholder")}
            className="field-input resize-y"
          />
        </div>
        <div>
          <label htmlFor="idea-name" className="field-label">{t("ideas.nameLabel")}</label>
          <input
            id="idea-name" type="text" required value={name} maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("ideas.namePlaceholder")} className="field-input"
          />
        </div>
        <button type="submit" className="btn-ghost">{t("ideas.submit")}</button>
      </form>

      <ul className="mt-7 space-y-3">
        {ideas.map((it, i) => (
          <li key={i} className="paper-card px-5 py-4">
            <p className="text-ink">&ldquo;{it.idea}&rdquo;</p>
            <p className="mt-1 text-sm text-ink/55">{t("ideas.byline")} {it.name}</p>
          </li>
        ))}
      </ul>

    </section>
  );
}
