select vault.create_secret(
  (select current_setting('app.settings.dummy', true)),
  'noop_placeholder_ignore',
  'placeholder'
) where false;