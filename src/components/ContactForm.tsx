import { useState } from "react";
import { CONTACT_EMAIL, submitForm } from "../lib/site-config";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitForm("contact", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="c-name" className="field-label">Your name (required)</label>
        <input id="c-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field-input" />
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">Email (required)</label>
        <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field-input" />
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">Message (required)</label>
        <textarea id="c-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What's on your mind?" className="field-input resize-y" />
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" className="btn-solid">Send it</button>
        <span className="text-sm text-ink/70">
          or email <a href={`mailto:${CONTACT_EMAIL}`} className="text-dusk underline hover:text-ink">{CONTACT_EMAIL}</a>
        </span>
      </div>
      {done && (
        <p role="status" className="text-sunset font-medium">Thanks. We'll write back soon.</p>
      )}
    </form>
  );
}
