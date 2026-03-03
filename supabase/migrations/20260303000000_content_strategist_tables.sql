-- Create content_topics table for storing discovered renewable energy topics
CREATE TABLE public.content_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 50,
  trending_reason TEXT,
  source_references TEXT[],
  status TEXT NOT NULL DEFAULT 'discovered',
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add check constraints
ALTER TABLE public.content_topics
ADD CONSTRAINT valid_topic_category CHECK (category IN (
  'Solar', 'Wind', 'Hydrogen', 'Battery Storage', 'EV Infrastructure',
  'Grid Modernization', 'Policy & Regulation', 'Green Finance',
  'Emerging Tech', 'Market Trends'
));

ALTER TABLE public.content_topics
ADD CONSTRAINT valid_topic_status CHECK (status IN ('discovered', 'script_pending', 'script_ready', 'published'));

ALTER TABLE public.content_topics
ADD CONSTRAINT valid_topic_region CHECK (region IN (
  'Global', 'North America', 'Europe', 'Asia Pacific', 'Middle East & Africa',
  'Latin America', 'India', 'China'
));

-- Enable RLS
ALTER TABLE public.content_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on content_topics"
ON public.content_topics
FOR ALL
USING (true)
WITH CHECK (true);

-- Create content_scripts table for generated scripts
CREATE TABLE public.content_scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.content_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  call_to_action TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  estimated_duration TEXT NOT NULL DEFAULT '5-7 minutes',
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  script_type TEXT NOT NULL DEFAULT 'video',
  status TEXT NOT NULL DEFAULT 'draft',
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_scripts
ADD CONSTRAINT valid_script_type CHECK (script_type IN ('video', 'podcast', 'blog', 'social_media'));

ALTER TABLE public.content_scripts
ADD CONSTRAINT valid_script_status CHECK (status IN ('draft', 'review', 'approved', 'published'));

-- Enable RLS
ALTER TABLE public.content_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on content_scripts"
ON public.content_scripts
FOR ALL
USING (true)
WITH CHECK (true);

-- Create weekly_briefs table for weekly digest
CREATE TABLE public.weekly_briefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  summary TEXT NOT NULL,
  topic_count INTEGER NOT NULL DEFAULT 0,
  script_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'generating',
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(week_number, year)
);

ALTER TABLE public.weekly_briefs
ADD CONSTRAINT valid_brief_status CHECK (status IN ('generating', 'ready', 'sent'));

-- Enable RLS
ALTER TABLE public.weekly_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on weekly_briefs"
ON public.weekly_briefs
FOR ALL
USING (true)
WITH CHECK (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_content_topics_updated_at
BEFORE UPDATE ON public.content_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_scripts_updated_at
BEFORE UPDATE ON public.content_scripts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_briefs_updated_at
BEFORE UPDATE ON public.weekly_briefs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
