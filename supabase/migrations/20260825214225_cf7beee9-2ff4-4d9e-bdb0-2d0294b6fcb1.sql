CREATE TABLE public.quick_event_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  met_neighbor boolean NOT NULL,
  would_recommend boolean NOT NULL,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  summarized_at timestamptz
);

GRANT ALL ON public.quick_event_feedback TO service_role;

ALTER TABLE public.quick_event_feedback ENABLE ROW LEVEL SECURITY;

CREATE INDEX quick_event_feedback_summary_idx
  ON public.quick_event_feedback (summarized_at, created_at);