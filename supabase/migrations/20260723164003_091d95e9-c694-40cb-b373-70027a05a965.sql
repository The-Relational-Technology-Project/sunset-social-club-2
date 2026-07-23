
-- Tighten permissive INSERT policies (all writes go through server functions using service role)
DROP POLICY IF EXISTS "Anyone can sign up" ON public.email_signups;
CREATE POLICY "Signups via server only" ON public.email_signups
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "Anyone can post ideas" ON public.ideas;
CREATE POLICY "Ideas via server only" ON public.ideas
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Contact via server only" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (false);

-- Revoke authenticated EXECUTE on the SECURITY DEFINER membership check
REVOKE EXECUTE ON FUNCTION public.is_current_user_member() FROM authenticated, anon, PUBLIC;
