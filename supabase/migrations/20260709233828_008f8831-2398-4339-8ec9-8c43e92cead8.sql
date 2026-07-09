
-- Jukebox submissions
CREATE TABLE public.jukebox_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name TEXT NOT NULL,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_art_url TEXT,
  duration_ms INTEGER,
  spotify_uri TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','played')),
  submitter_fingerprint TEXT,
  approved_at TIMESTAMPTZ,
  added_to_playlist_at TIMESTAMPTZ,
  spotify_playlist_snapshot_id TEXT,
  approve_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX jukebox_submissions_track_active_idx
  ON public.jukebox_submissions (spotify_track_id)
  WHERE status IN ('pending','approved','played');

CREATE INDEX jukebox_submissions_status_idx ON public.jukebox_submissions (status, created_at DESC);
CREATE INDEX jukebox_submissions_fingerprint_idx ON public.jukebox_submissions (submitter_fingerprint, created_at DESC);

GRANT SELECT ON public.jukebox_submissions TO anon;
GRANT SELECT ON public.jukebox_submissions TO authenticated;
GRANT ALL ON public.jukebox_submissions TO service_role;

ALTER TABLE public.jukebox_submissions ENABLE ROW LEVEL SECURITY;

-- Public can only see approved/played rows (queue display)
CREATE POLICY "Public can view approved queue"
  ON public.jukebox_submissions
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('approved','played'));

-- Jukebox settings singleton
CREATE TABLE public.jukebox_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  submissions_open BOOLEAN NOT NULL DEFAULT true,
  current_event_label TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.jukebox_settings (id, submissions_open) VALUES (1, true);

GRANT SELECT ON public.jukebox_settings TO anon;
GRANT SELECT ON public.jukebox_settings TO authenticated;
GRANT ALL ON public.jukebox_settings TO service_role;

ALTER TABLE public.jukebox_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings"
  ON public.jukebox_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER jukebox_submissions_updated_at
  BEFORE UPDATE ON public.jukebox_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER jukebox_settings_updated_at
  BEFORE UPDATE ON public.jukebox_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
