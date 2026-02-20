-- Create website_monitors table to track monitored URLs and notification settings
CREATE TABLE public.website_monitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'USCIS eGov',
  is_active BOOLEAN NOT NULL DEFAULT true,
  check_interval_minutes INTEGER NOT NULL DEFAULT 60,
  content_hash TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_changed_at TIMESTAMP WITH TIME ZONE,
  notify_email TEXT,
  notify_phone TEXT,
  notification_method TEXT NOT NULL DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.website_monitors
ADD CONSTRAINT valid_notification_method CHECK (notification_method IN ('email', 'sms', 'both'));

-- Create website_change_logs table to keep history of detected changes
CREATE TABLE public.website_change_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monitor_id UUID NOT NULL REFERENCES public.website_monitors(id) ON DELETE CASCADE,
  previous_hash TEXT,
  new_hash TEXT NOT NULL,
  diff_summary TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  notification_error TEXT,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.website_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_change_logs ENABLE ROW LEVEL SECURITY;

-- Public access policies (internal tool - no auth required)
CREATE POLICY "Allow all operations on website_monitors"
ON public.website_monitors
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on website_change_logs"
ON public.website_change_logs
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for automatic timestamp updates (reuses existing function)
CREATE TRIGGER update_website_monitors_updated_at
BEFORE UPDATE ON public.website_monitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the default USCIS monitor
INSERT INTO public.website_monitors (url, label, is_active, check_interval_minutes, notification_method)
VALUES ('https://egov.uscis.gov/', 'USCIS eGov Portal', true, 60, 'email');
