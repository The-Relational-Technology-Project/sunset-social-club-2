import { useState } from "react";
import { submitForm } from "../lib/site-config";

type Idea = { idea: string; name: string };

// Seeded session state. Future upgrade: a shared datastore so ideas persist
// across visitors. For now the emailed copy is how the club actually receives ideas.
const SEED: Idea[] = [
  { idea: "A Saturday morning repair cafe, fix bikes and lamps and toasters", name: "Mara" },
  { idea: "Cantonese home-cooking night, the aunties teach the rest of us", name: "Wei" },
  { idea: "Sidewalk chalk for the kids, coffee for the grown-ups", name: "Dani" },
];

export function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>(SEED);
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Idea = { idea: idea.trim(), name: name.trim() };
    setIdeas((prev) => [next, ...prev]);
    await submitForm("idea", { idea: next.idea, name: next.name });
    setIdea("");
    setName("");
  }

  return (
    <section>
      <h2 className="font-hand text-[2rem] leading-tight">Got an idea for the club?</h2>
      <p className="mt-1 text-ink/70">A club bulletin board. Pin up something you'd want to happen here, or that you'd help make happen.</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="idea-text" className="field-label">Your idea</label>
          <textarea
            id="idea-text" required value={idea} rows={3}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="A Saturday repair cafe? A Cantonese cooking night? Say it here."
            className="field-input resize-y"
          />
        </div>
        <div>
          <label htmlFor="idea-name" className="field-label">Your name</label>
          <input
            id="idea-name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So we know who to thank" className="field-input"
          />
        </div>
        <button type="submit" className="btn-ghost">Pin it up</button>
      </form>

      <ul className="mt-7 space-y-3">
        {ideas.map((it, i) => (
          <li key={i} className="paper-card px-5 py-4">
            <p className="text-ink">&ldquo;{it.idea}&rdquo;</p>
            <p className="mt-1 text-sm text-ink/55">by {it.name}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink/70">Ideas go up with a name, no votes and no ranking. We read every one.</p>
    </section>
  );
}
