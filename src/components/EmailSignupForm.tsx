import { useState } from "react";
import { submitForm } from "../lib/site-config";

export function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitForm("signup", { email, firstName: name });
    setEmail("");
    setName("");
    setDone(true);
  }

  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight">Stay in the loop</h2>
      <p className="mt-1 text-ink/70">We'll send you notes and updates</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="signup-email" className="field-label">Email (required)</label>
          <input
            id="signup-email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" className="field-input"
          />
        </div>
        <div>
          <label htmlFor="signup-name" className="field-label">First name (optional)</label>
          <input
            id="signup-name" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What we'll call you" className="field-input"
          />
        </div>
        <button type="submit" className="btn-solid">Keep me posted</button>
        {done && (
          <p role="status" className="text-sunset font-medium">You're on the list. See you Wednesday.</p>
        )}
      </form>
    </section>
  );
}
