-- Create contacts table
CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  id_number text,
  company_id uuid,
  position text,
  email text NOT NULL,
  phone text NOT NULL,
  tax_document_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_organization_id ON public.contacts(organization_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS policies for contacts
CREATE POLICY "Users can view contacts in their organization" 
ON public.contacts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = contacts.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can insert contacts in their organization" 
ON public.contacts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = contacts.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can update contacts in their organization" 
ON public.contacts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = contacts.organization_id 
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can delete contacts in their organization" 
ON public.contacts 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM organization_members m 
  WHERE m.organization_id = contacts.organization_id 
  AND m.user_id = auth.uid()
));

-- Create storage bucket for tax documents
INSERT INTO storage.buckets (id, name, public) VALUES ('tax-documents', 'tax-documents', false);

-- Storage policies for tax documents
CREATE POLICY "Users can view tax documents in their organization" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tax-documents' AND EXISTS (
  SELECT 1 FROM contacts c 
  JOIN organization_members m ON m.organization_id = c.organization_id
  WHERE c.tax_document_url = CONCAT('tax-documents/', name)
  AND m.user_id = auth.uid()
));

CREATE POLICY "Users can upload tax documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();