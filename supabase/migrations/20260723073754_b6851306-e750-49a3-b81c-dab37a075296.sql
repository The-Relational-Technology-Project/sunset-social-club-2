
-- Helper: is this email on the club signup list?
CREATE OR REPLACE FUNCTION public.is_member_email(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.email_signups WHERE lower(email) = lower(_email)
  )
$$;
GRANT EXECUTE ON FUNCTION public.is_member_email(text) TO anon, authenticated;

-- event_feedback_forms: editable form definitions
CREATE TABLE public.event_feedback_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_feedback_forms TO anon, authenticated;
GRANT ALL ON public.event_feedback_forms TO service_role;
ALTER TABLE public.event_feedback_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read feedback forms"
  ON public.event_feedback_forms FOR SELECT USING (true);
CREATE TRIGGER trg_event_feedback_forms_updated
  BEFORE UPDATE ON public.event_feedback_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- event_feedback: submissions
CREATE TABLE public.event_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_slug text NOT NULL,
  member_email text,
  user_id uuid,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.event_feedback TO anon, authenticated;
GRANT ALL ON public.event_feedback TO service_role;
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit event feedback"
  ON public.event_feedback FOR INSERT WITH CHECK (true);

-- community_insights: markdown editable posts
CREATE TABLE public.community_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  markdown text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_insights TO anon, authenticated;
GRANT ALL ON public.community_insights TO service_role;
ALTER TABLE public.community_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published insights"
  ON public.community_insights FOR SELECT USING (published = true);
CREATE TRIGGER trg_community_insights_updated
  BEFORE UPDATE ON public.community_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- photos: member uploads with steward approval
CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  uploaded_by_email text,
  storage_path text NOT NULL,
  caption text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see approved or own photos"
  ON public.photos FOR SELECT TO authenticated
  USING (approved = true OR user_id = auth.uid());
CREATE POLICY "Members insert own photos"
  ON public.photos FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Seed: July 22 pizza party feedback form
INSERT INTO public.event_feedback_forms (slug, title, intro, questions) VALUES (
  'pizza-party-2026-07-22',
  'Kick-off Pizza Party — reflections',
  'We were so inspired by how you all showed up last night. Thank you for coming and contributing! We''re grateful for your feedback, too.',
  '[
    {"key":"best_part","label":"What was the best part?","type":"textarea"},
    {"key":"change_try","label":"What would you like to see us change or try?","type":"textarea"},
    {"key":"neighbors_met","label":"How many neighbors would you estimate you met for the first time?","type":"number"},
    {"key":"lead_contribute","label":"Is there an event, workshop, or activity you''d like to lead? Another way you''d like to contribute?","type":"textarea"},
    {"key":"anything_else","label":"Anything else to share?","type":"textarea"}
  ]'::jsonb
);

-- Seed: July 22 community insights recap
INSERT INTO public.community_insights (slug, title, markdown) VALUES (
  'july-22-kickoff',
  'July 22 kickoff: what went up on the walls',
$md$Wednesday night we packed the space at 4114 Judah for the first Sunset Social Club gathering, and by the end of the night three big sheets of kraft paper were covered in marker and sticker dots. Here's all of it, because the specifics are the whole point.

## Wall one: what should we do together?

Potlucks ran away with it, collecting more dots than anything else on any wall. Close behind:

- Clothing swaps
- Book swaps
- Mahjong
- Astrology and moon circles
- Game night (written twice, once in all caps)

Also collecting dots:

- Holiday celebrations
- Silent disco
- Craft fairs featuring local artists
- Yoga with pets
- Surf movies
- Book club
- Movie nights
- An unfinished project show and tell
- Meditation and yoga
- Live jazz
- Talks and panels
- A drawing class
- Sound baths
- Chess
- D&D for teens
- Family dance parties
- A singles event, with "(for over 50, too!)" added right below

On the wall, waiting for their people:

- Standup comedy
- Indoor playdates
- Middle school movie nights
- A fundraiser casino night
- A neighborhood garage sale day
- A doggie social
- Run club
- Toy swaps
- Book club nature walks
- Pilates

Someone started recruiting for a surf crew in the corner and left a number. A toddler contributed a generous field of scribbles across the bottom, which we're counting as a vote for more kid programming.

## Wall two: what could you teach?

More than twenty offers went up, about half of them signed:

- Guitar, songwriting, and musicianship
- Woodworking, drywall, and basic construction
- How to make a chair from bullsh*t (their words)
- Financial literacy for teens and adults
- Investing for women
- Creative clothing repair
- Sewing
- Cooking a meal
- Ayurvedic cooking
- Making pho, candles, and stickers
- Gardening in the fog
- Native plants
- Open water swimming and water polo
- Track and field
- Creative movement and dance for kids and adults
- Meditation and yoga
- Immigration law basics and citizenship
- Basic drawing and art classes, advanced on offer if there's interest
- Poetry
- Astrology
- Fantasy football
- How to change a tire
- A fully staffed dad joke booth, sample provided: what's red and smells like blue paint? Red paint.

## Wall three: what would you love to learn?

The prompt promised serious and ridiculous answers were both welcome. Delivered:

- Mahjong (+5)
- Knitting and crochet (+5)
- Local history (+5)
- Woodworking (+4)
- More about native plants (+3)
- Ocean life and tides (+3)
- How to surf (+1)
- Job search support (+1)
- Card games (+1)
- Crabbing and fishing
- Writing (a novel, an essay)
- Basic DIY and mending
- Kids art classes
- Painting and art
- How to sing
- Birds, plants, and trees
- Career coaching
- Forming businesses
- Indigenous history
- Local politics and community
- Practicing languages (Spanish, French, and Portuguese came up)
- Cooking
- Guitar
- Piano
- Drums

## Now put the walls next to each other

- Woodworking was offered on one wall, and four dots want to learn it
- Native plants were offered, three dots want more, and birds, plants, and trees made the learn wall too
- Guitar was offered, and guitar, piano, and drums were requested (a house band is forming)
- Songwriting and musicianship were offered, and how to sing was requested
- Drawing and art classes were offered, and kids art classes and painting were requested
- Mahjong collected dots as a thing to do together and five more as a thing to learn
- Clothing repair and sewing were offered, and mending, knitting, and crochet were requested
- Financial literacy was offered, and career coaching, job search support, and forming businesses were requested
- The ocean keeps writing itself in: surf movies, a surf crew forming in the margins, how to surf, ocean life and tides, crabbing and fishing, and an open water swimmer offering to teach

This neighborhood is already carrying its own curriculum!$md$
);
