import { useState } from "react";
import { submitForm } from "../lib/site-config";
import { useLanguage } from "../contexts/LanguageContext";

export function EmailSignupForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [crossStreets, setCrossStreets] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitForm("signup", { email, firstName: name, crossStreets });
    setEmail("");
    setName("");
    setCrossStreets("");
    setDone(true);
  }

  return (
    <section>
      <form onSubmit={onSubmit} className="space-y-4">
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
        <div>
          <label htmlFor="signup-cross" className="field-label">{t("signup.crossStreetsLabel")}</label>
          <input
            id="signup-cross" type="text" value={crossStreets}
            onChange={(e) => setCrossStreets(e.target.value)}
            placeholder={t("signup.crossStreetsPlaceholder")} className="field-input"
          />
        </div>
        <button type="submit" className="btn-solid">{t("signup.submit")}</button>
        <p className="text-xs text-ink/60 leading-relaxed">{t("signup.consent")}</p>
        {done && (
          <p role="status" className="text-sunset font-medium">{t("signup.done")}</p>
        )}
      </form>
    </section>
  );
}
