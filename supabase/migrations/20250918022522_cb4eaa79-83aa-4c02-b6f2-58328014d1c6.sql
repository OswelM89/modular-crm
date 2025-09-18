-- Add foreign key constraint between companies and profiles tables
ALTER TABLE companies 
ADD CONSTRAINT companies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;