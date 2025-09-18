-- Create tax-documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tax-documents', 'tax-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for tax-documents bucket
-- Users can view their own documents
CREATE POLICY "Users can view their own tax documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can upload their own documents
CREATE POLICY "Users can upload their own tax documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own documents
CREATE POLICY "Users can update their own tax documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own tax documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);