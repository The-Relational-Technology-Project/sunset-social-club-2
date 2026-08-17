CREATE TABLE public.potluck_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bringing text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);
GRANT ALL ON public.potluck_signups TO service_role;
ALTER TABLE public.potluck_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public insert" ON public.potluck_signups FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE INDEX potluck_signups_ip_created_idx ON public.potluck_signups (ip_hash, created_at DESC);