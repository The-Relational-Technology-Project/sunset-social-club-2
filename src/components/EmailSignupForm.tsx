import { useState } from "react";
import { submitForm } from "../lib/site-config";
import { useLanguage } from "../contexts/LanguageContext";

export function EmailSignupForm() {
  const { t } = useLanguage();
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
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight italic">{t("signup.title")}</h2>
      <p className="mt-1 text-ink/70">{t("signup.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="signup-email" className="field-label">{t("signup.emailLabel")}</label>
          <input
            id="signup-email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("signup.emailPlaceholder")} className="field-input"
          />
        </div>
        <div>
          <label htmlFor="signup-name" className="field-label">{t("signup.nameLabel")}</label>
          <input
            id="signup-name" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("signup.namePlaceholder")} className="field-input"
          />
        </div>
        <button type="submit" className="btn-solid">{t("signup.submit")}</button>
        {done && (
          <p role="status" className="text-sunset font-medium">{t("signup.done")}</p>
        )}
      </form>
    </section>
  );
}
