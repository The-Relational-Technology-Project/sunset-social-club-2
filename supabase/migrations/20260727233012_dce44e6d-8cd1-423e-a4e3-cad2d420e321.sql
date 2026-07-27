UPDATE public.email_templates
SET subject = 'You''re in, welcome to Sunset Social Club',
    body_markdown = E'You''re now a member of Sunset Social Club. You can access your Member Home at https://sunsetsocialclub.org/member, which includes:\n\n- Things members have shared\n- Photos from our gatherings\n- Community links (e.g. Spotify playlist)\n- Member feedback\n- and more!\n\nSign in with your email any time to take a look.',
    cta_label = 'Go to Member Home',
    cta_url = 'https://sunsetsocialclub.org/member'
WHERE slug = 'member-welcome';