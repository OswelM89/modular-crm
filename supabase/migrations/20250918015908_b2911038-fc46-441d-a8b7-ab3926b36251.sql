-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  nit TEXT NOT NULL,
  sector TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  tax_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
-- Users can view companies in their organization
CREATE POLICY "Users can view companies in their organization" 
ON public.companies 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = companies.organization_id 
  AND m.user_id = auth.uid()
));

-- Users can insert companies in their organization
CREATE POLICY "Users can insert companies in their organization" 
ON public.companies 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = companies.organization_id 
  AND m.user_id = auth.uid()
));

-- Users can update companies in their organization
CREATE POLICY "Users can update companies in their organization" 
ON public.companies 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = companies.organization_id 
  AND m.user_id = auth.uid()
));

-- Users can delete companies in their organization
CREATE POLICY "Users can delete companies in their organization" 
ON public.companies 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = companies.organization_id 
  AND m.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();