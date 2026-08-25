select cron.schedule(
  'event-feedback-summary',
  '17 * * * *',
  $$
  select net.http_post(
    url := 'https://project--002c6236-1171-44e7-80aa-9f0360115c92.lovable.app/api/public/event-feedback-summary',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'email_queue_service_role_key' limit 1)
    ),
    body := '{}'::jsonb
  );
  $$
);