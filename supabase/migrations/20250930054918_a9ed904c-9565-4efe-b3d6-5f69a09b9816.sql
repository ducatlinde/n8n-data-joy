-- Create a table for industrial gas plants
CREATE TABLE public.industrial_gas_plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id TEXT NOT NULL UNIQUE,
  plant_name TEXT NOT NULL,
  gas_type TEXT NOT NULL,
  daily_capacity_tons NUMERIC NOT NULL,
  status TEXT NOT NULL,
  last_maintenance DATE NOT NULL,
  responsible_engineer TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.industrial_gas_plants ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this appears to be operational data)
CREATE POLICY "Allow all operations on industrial_gas_plants" 
ON public.industrial_gas_plants 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_industrial_gas_plants_updated_at
BEFORE UPDATE ON public.industrial_gas_plants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();