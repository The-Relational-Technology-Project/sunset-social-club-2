
-- 1. event_feedback: replace permissive insert policy
DROP POLICY IF EXISTS "Anyone can submit event feedback" ON public.event_feedback;

CREATE POLICY "Guests submit anonymous feedback"
  ON public.event_feedback FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Members submit feedback as themselves"
  ON public.event_feedback FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      member_email IS NULL
      OR lower(member_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

-- 2. Membership check: remove enumeration-friendly variant, add self-only variant
DROP FUNCTION IF EXISTS public.is_member_email(text);

CREATE OR REPLACE FUNCTION public.is_current_user_member()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.email_signups
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;

REVOKE ALL ON FUNCTION public.is_current_user_member() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_member() TO authenticated;

-- 3. Lock down email-queue SECURITY DEFINER helpers to service_role only, and pin search_path
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
