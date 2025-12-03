-- Add file_url column to screening_sessions
ALTER TABLE public.screening_sessions ADD COLUMN file_url TEXT;

-- Create storage bucket for IE reports
INSERT INTO storage.buckets (id, name, public) VALUES ('ie-reports', 'ie-reports', true);

-- Allow public uploads to the bucket
CREATE POLICY "Allow public uploads to ie-reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ie-reports');

-- Allow public reads from the bucket
CREATE POLICY "Allow public reads from ie-reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'ie-reports');