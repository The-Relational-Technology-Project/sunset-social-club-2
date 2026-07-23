import { LUMA_CALENDAR_EMBED } from "../lib/site-config";
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
    </section>
  );
}
