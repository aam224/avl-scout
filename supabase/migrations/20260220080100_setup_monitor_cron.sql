-- Enable the pg_cron and pg_net extensions (required for scheduled HTTP calls)
-- pg_cron: schedule recurring tasks
-- pg_net: make HTTP requests from within PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule the monitor-website edge function to run every 60 minutes.
-- This calls the Supabase Edge Function via HTTP POST.
-- The function will check all active monitors and send notifications on changes.
SELECT cron.schedule(
  'check-website-monitors',        -- job name
  '0 * * * *',                     -- every hour at minute 0
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/monitor-website',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
