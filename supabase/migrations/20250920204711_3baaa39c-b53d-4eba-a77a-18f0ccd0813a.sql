-- Add organization_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN organization_id uuid;

-- Update the handle_new_user function to set organization_id when creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
DECLARE
  org_id UUID;
  org_name TEXT;
BEGIN
  -- Extract organization name from email and add prefix 'Org''
  org_name := 'Org''' || COALESCE(split_part(NEW.email, '@', 1), 'Mi_Organizacion');
  
  INSERT INTO public.organizations(name) VALUES (org_name) RETURNING id INTO org_id;

  -- Creator always as ADMIN
  INSERT INTO public.organization_members(organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'admin');

  -- Insert profile with organization_id
  INSERT INTO public.profiles(id, first_name, last_name, email, organization_id)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name', NEW.email, org_id);

  RETURN NEW;
END;
$$;

-- Update existing profiles to have organization_id from their organization membership
UPDATE public.profiles 
SET organization_id = (
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = profiles.id 
  LIMIT 1
)
WHERE organization_id IS NULL;