import { LUMA_CALENDAR_EMBED, PARTNER_EVENTS } from "../lib/site-config";
import { useLanguage } from "../contexts/LanguageContext";

export function Schedule() {
  const { t } = useLanguage();
  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight italic">{t("schedule.title")}</h2>
      <div
        className="paper-card mt-5 overflow-auto p-2"
        style={{ minHeight: 260, maxHeight: 320 }}
        // LUMA_CALENDAR_EMBED is a trusted iframe string pasted by the site owner.
        dangerouslySetInnerHTML={{ __html: LUMA_CALENDAR_EMBED }}
      />

      {PARTNER_EVENTS.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight italic">
            {t("schedule.partners.title")}
          </h3>
          <p className="mt-2 text-sm text-ink/70">{t("schedule.partners.subtitle")}</p>
          <ul className="mt-4 space-y-3">
            {PARTNER_EVENTS.map((event) => (
              <li key={event.url}>
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-card block px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
                >
                  <span className="block font-semibold text-ink">{event.title}</span>
                  <span className="mt-1 block text-sm text-ink/70">{event.when}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
