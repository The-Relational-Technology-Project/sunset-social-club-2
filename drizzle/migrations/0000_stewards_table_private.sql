CREATE TABLE IF NOT EXISTS public.stewards (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.stewards TO service_role;

ALTER TABLE public.stewards ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_steward()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.stewards
    WHERE lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );
$$;

DROP POLICY IF EXISTS "Stewards can read email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Stewards can update email templates" ON public.email_templates;

CREATE POLICY "Stewards can read email templates"
  ON public.email_templates FOR SELECT
  TO authenticated
  USING (public.is_steward());

CREATE POLICY "Stewards can update email templates"
  ON public.email_templates FOR UPDATE
  TO authenticated
  USING (public.is_steward())
  WITH CHECK (public.is_steward());
