import { EVENT_RSVP_URL } from "../lib/site-config";

export function EventCard() {
  return (
    <div
      className="paper-card relative overflow-hidden pl-7 pr-6 py-6 sm:py-7"
      style={{ boxShadow: "0 18px 40px -24px rgba(236, 106, 76, 0.45)" }}
    >
      <span aria-hidden className="absolute left-0 top-0 h-full w-[5px] bg-sunset" />
      <p className="eyebrow text-sunset">Next Wednesday · July 22</p>
      <h2 className="mt-2 font-hand text-[2.1rem] leading-tight">
        Volunteer day + community pizza party
      </h2>
      <p className="mt-3 text-ink/80">
        We are getting the space ready together, then eating pizza as a reward. Bring the kids, bring a friend, bring nothing at all. This is the kickoff.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a className="btn-solid" href={EVENT_RSVP_URL} target="_blank" rel="noopener noreferrer">
          Count me in
        </a>
        <span className="text-sm text-ink/70">
          Afternoon work, pizza at dusk · 4114 Judah St (at 46th Ave)
        </span>
      </div>
    </div>
  );
}
