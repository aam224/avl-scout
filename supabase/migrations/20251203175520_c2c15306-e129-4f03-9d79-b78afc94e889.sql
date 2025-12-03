-- Create screening_sessions table
CREATE TABLE public.screening_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  llm_input_text TEXT,
  scores_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add check constraints for enum-like fields
ALTER TABLE public.screening_sessions 
ADD CONSTRAINT valid_product_type CHECK (product_type IN ('BESS', 'Inverter', 'EV Charger', 'Microgrid Controller'));

ALTER TABLE public.screening_sessions 
ADD CONSTRAINT valid_region CHECK (region IN ('US', 'EU', 'India', 'APAC', 'LATAM'));

ALTER TABLE public.screening_sessions 
ADD CONSTRAINT valid_status CHECK (status IN ('uploaded', 'processing', 'completed', 'error'));

-- Enable Row Level Security
ALTER TABLE public.screening_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (internal tool - no auth required)
CREATE POLICY "Allow all operations on screening_sessions" 
ON public.screening_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_screening_sessions_updated_at
BEFORE UPDATE ON public.screening_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();