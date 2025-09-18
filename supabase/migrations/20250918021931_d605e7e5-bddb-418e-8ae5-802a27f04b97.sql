-- Create RLS policies for the tax-documents storage bucket

-- Allow users to upload their own tax documents
CREATE POLICY "Users can upload their own tax documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own tax documents
CREATE POLICY "Users can view their own tax documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own tax documents
CREATE POLICY "Users can update their own tax documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own tax documents
CREATE POLICY "Users can delete their own tax documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tax-documents' AND auth.uid()::text = (storage.foldername(name))[1]);