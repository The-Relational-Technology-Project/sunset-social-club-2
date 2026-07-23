-- Remove duplicate signups keeping earliest per lowercased email
DELETE FROM public.email_signups a
USING public.email_signups b
WHERE lower(a.email) = lower(b.email)
  AND (a.created_at, a.id) > (b.created_at, b.id);

-- Prevent future duplicates (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS email_signups_email_lower_unique
  ON public.email_signups ((lower(email)));