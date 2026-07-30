
-- 1) Membership helper
CREATE OR REPLACE FUNCTION public.is_club_member()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.email_signups s
    WHERE lower(s.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION public.is_club_member() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_club_member() TO authenticated, service_role;

-- 2) photos: require real membership; allow owners to manage unapproved photos
DROP POLICY IF EXISTS "Members insert own photos" ON public.photos;
DROP POLICY IF EXISTS "Members see approved or own photos" ON public.photos;

CREATE POLICY "Members insert own photos"
ON public.photos FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_club_member());

CREATE POLICY "Members see approved or own photos"
ON public.photos FOR SELECT TO authenticated
USING (public.is_club_member() AND (approved = true OR user_id = auth.uid()));

CREATE POLICY "Members update own photos"
ON public.photos FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND public.is_club_member())
WITH CHECK (user_id = auth.uid() AND public.is_club_member() AND approved = false);

CREATE POLICY "Members delete own photos"
ON public.photos FOR DELETE TO authenticated
USING (user_id = auth.uid() AND public.is_club_member());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO authenticated;

-- 3) event_feedback: authenticated submissions require membership
DROP POLICY IF EXISTS "Members submit feedback as themselves" ON public.event_feedback;
CREATE POLICY "Members submit feedback as themselves"
ON public.event_feedback FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND public.is_club_member()
  AND (member_email IS NULL OR lower(member_email) = lower(COALESCE(auth.jwt() ->> 'email', '')))
);

-- 4) email_signups: no client reads at all (server/service role only)
REVOKE SELECT ON public.email_signups FROM anon, authenticated;
GRANT ALL ON public.email_signups TO service_role;

-- 5) jukebox_submissions: hide submitter_fingerprint from public clients
REVOKE SELECT ON public.jukebox_submissions FROM anon, authenticated;
GRANT SELECT (id, spotify_track_id, spotify_uri, track_name, artist_name, album_art_url, duration_ms, requester_name, status, created_at, approved_at, added_to_playlist_at, updated_at)
  ON public.jukebox_submissions TO anon, authenticated;
GRANT ALL ON public.jukebox_submissions TO service_role;
