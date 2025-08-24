```sql
-- Create the organizations table
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE, -- Optional: for friendly URLs or unique identifiers
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_organizations_name ON public.organizations USING btree (name);
CREATE INDEX idx_organizations_slug ON public.organizations USING btree (slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create a trigger function to update the 'updated_at' column automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to the organizations table
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for organizations table
-- Allow authenticated users to insert organizations (they will be the owner)
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT
TO authenticated WITH CHECK (true);

-- Allow authenticated users to view organizations they are part of (will need to be refined with organization_members or owner_id)
-- For now, a basic policy that allows authenticated users to see all organizations (to be refined later)
CREATE POLICY "Authenticated users can view organizations"
ON public.organizations FOR SELECT
TO authenticated USING (true);

-- Allow authenticated users to update organizations they own (will need to be refined with owner_id)
CREATE POLICY "Authenticated users can update organizations"
ON public.organizations FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete organizations they own (will need to be refined with owner_id)
CREATE POLICY "Authenticated users can delete organizations"
ON public.organizations FOR DELETE
TO authenticated USING (true);
```