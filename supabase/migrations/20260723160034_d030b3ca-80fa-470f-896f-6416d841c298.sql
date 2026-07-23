
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  heading TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stewards can read email templates"
  ON public.email_templates FOR SELECT
  TO authenticated
  USING (lower((auth.jwt() ->> 'email')) IN ('joshuanesbit@gmail.com','sandi.lamharder@gmail.com'));

CREATE POLICY "Stewards can update email templates"
  ON public.email_templates FOR UPDATE
  TO authenticated
  USING (lower((auth.jwt() ->> 'email')) IN ('joshuanesbit@gmail.com','sandi.lamharder@gmail.com'))
  WITH CHECK (lower((auth.jwt() ->> 'email')) IN ('joshuanesbit@gmail.com','sandi.lamharder@gmail.com'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.email_templates (slug, subject, heading, body_markdown, cta_label, cta_url)
VALUES (
  'member-welcome',
  'You''re in — welcome to Sunset Social Club',
  'Welcome{{firstNameComma}}.',
  'You''re now a member of Sunset Social Club. Sign in to your Member Home for feedback forms, photos, insights, and the community jukebox.',
  'Go to Member Home',
  'https://sunsetsocialclub.org/member/signin'
);
