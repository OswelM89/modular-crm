/*
  # Debug and fix signup database error

  1. Add detailed logging to identify the exact error
  2. Simplify the trigger to avoid complex logic
  3. Add proper error handling
  4. Create a minimal working version first
*/

-- Drop existing trigger and function to recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simplified version with detailed logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  is_first_user BOOLEAN := FALSE;
  org_id UUID;
  first_name_val TEXT;
  last_name_val TEXT;
  email_prefix TEXT;
BEGIN
  -- Log the start
  RAISE LOG 'handle_new_user: Starting for user %', NEW.id;
  
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM auth.users WHERE email_confirmed_at IS NOT NULL;
  is_first_user := (user_count <= 1);
  
  RAISE LOG 'handle_new_user: User count = %, is_first_user = %', user_count, is_first_user;
  
  -- Extract names from metadata or email
  BEGIN
    first_name_val := COALESCE(
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'firstName',
      split_part(NEW.email, '@', 1)
    );
    
    last_name_val := COALESCE(
      NEW.raw_user_meta_data->>'last_name', 
      NEW.raw_user_meta_data->>'lastName',
      'User'
    );
    
    -- Ensure we have valid values
    IF first_name_val IS NULL OR first_name_val = '' THEN
      email_prefix := split_part(NEW.email, '@', 1);
      first_name_val := email_prefix;
    END IF;
    
    IF last_name_val IS NULL OR last_name_val = '' THEN
      last_name_val := 'User';
    END IF;
    
    RAISE LOG 'handle_new_user: Names extracted - first: %, last: %', first_name_val, last_name_val;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: Error extracting names: %', SQLERRM;
    -- Use email as fallback
    email_prefix := split_part(NEW.email, '@', 1);
    first_name_val := email_prefix;
    last_name_val := 'User';
  END;
  
  -- Create profile
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      first_name,
      last_name,
      full_name,
      role
    ) VALUES (
      NEW.id,
      NEW.email,
      first_name_val,
      last_name_val,
      first_name_val || ' ' || last_name_val,
      CASE WHEN is_first_user THEN 'super_admin' ELSE 'user' END
    );
    
    RAISE LOG 'handle_new_user: Profile created successfully';
    
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: Error creating profile: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create profile: %', SQLERRM;
  END;
  
  -- If first user, create organization and super admin entry
  IF is_first_user THEN
    BEGIN
      -- Create organization
      INSERT INTO public.organizations (
        name,
        slug,
        created_by
      ) VALUES (
        first_name_val || ' Organization',
        lower(first_name_val || '-org'),
        NEW.id
      ) RETURNING id INTO org_id;
      
      RAISE LOG 'handle_new_user: Organization created with id %', org_id;
      
      -- Update profile with organization
      UPDATE public.profiles 
      SET organization_id = org_id 
      WHERE id = NEW.id;
      
      -- Add to organization_members
      INSERT INTO public.organization_members (
        user_id,
        organization_id,
        role
      ) VALUES (
        NEW.id,
        org_id,
        'owner'
      );
      
      -- Add to super_admins
      INSERT INTO public.super_admins (
        user_id,
        created_by
      ) VALUES (
        NEW.id,
        NEW.id
      );
      
      RAISE LOG 'handle_new_user: First user setup completed';
      
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'handle_new_user: Error in first user setup: %', SQLERRM;
      RAISE EXCEPTION 'Failed to setup first user: %', SQLERRM;
    END;
  END IF;
  
  RAISE LOG 'handle_new_user: Completed successfully for user %', NEW.id;
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user: Fatal error: %', SQLERRM;
  RAISE EXCEPTION 'handle_new_user failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is properly configured
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Temporary policy to allow profile creation during signup
DROP POLICY IF EXISTS "temp_profiles_insert_policy" ON public.profiles;
CREATE POLICY "temp_profiles_insert_policy" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Temporary policy to allow organization creation during signup  
DROP POLICY IF EXISTS "temp_organizations_insert_policy" ON public.organizations;
CREATE POLICY "temp_organizations_insert_policy" ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Temporary policy to allow organization member creation during signup
DROP POLICY IF EXISTS "temp_organization_members_insert_policy" ON public.organization_members;
CREATE POLICY "temp_organization_members_insert_policy" ON public.organization_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());