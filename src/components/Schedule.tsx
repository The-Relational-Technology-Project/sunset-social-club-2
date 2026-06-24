import { LUMA_CALENDAR_EMBED } from "../lib/site-config";

export function Schedule() {
  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight">What's coming up</h2>
      <p className="mt-1 text-ink/70">We gather most Wednesdays!</p>
      <div
        className="paper-card mt-5 overflow-auto p-2"
        style={{ minHeight: 420 }}
        // LUMA_CALENDAR_EMBED is a trusted iframe string pasted by the site owner.
        dangerouslySetInnerHTML={{ __html: LUMA_CALENDAR_EMBED }}
      />
      <p className="mt-3 text-sm text-ink/70">
        Dates and plans shift with the fog. Sign up below and we will tell you what is actually happening each week.
      </p>
    </section>
  );
}
