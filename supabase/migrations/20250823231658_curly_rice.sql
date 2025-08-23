/*
  # Fix signup database error

  1. Problem
    - The handle_new_user trigger is failing during signup
    - Likely due to NOT NULL constraints or missing metadata handling

  2. Solution
    - Update the trigger to properly handle user metadata
    - Make first_name and last_name nullable temporarily if needed
    - Add better error handling in the trigger function

  3. Changes
    - Fix the handle_new_user function to properly extract metadata
    - Ensure all required fields have proper defaults
    - Add logging for debugging
*/

-- First, let's make sure the columns can accept null values temporarily
ALTER TABLE profiles 
ALTER COLUMN first_name DROP NOT NULL,
ALTER COLUMN last_name DROP NOT NULL;

-- Drop and recreate the trigger function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_first_name TEXT;
  user_last_name TEXT;
  user_email TEXT;
  is_first_user BOOLEAN;
  new_org_id UUID;
  org_name TEXT;
BEGIN
  -- Extract user information
  user_email := NEW.email;
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- If first_name or last_name are empty, use email prefix as fallback
  IF user_first_name = '' THEN
    user_first_name := SPLIT_PART(user_email, '@', 1);
  END IF;
  
  IF user_last_name = '' THEN
    user_last_name := 'User';
  END IF;

  -- Check if this is the first user in the system
  SELECT NOT EXISTS (SELECT 1 FROM profiles LIMIT 1) INTO is_first_user;

  -- Create the profile first
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    organization_id
  ) VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    CASE WHEN is_first_user THEN 'super_admin' ELSE 'user' END,
    NULL -- Will be updated after organization creation
  );

  -- If this is the first user, make them super admin and create organization
  IF is_first_user THEN
    -- Add to super_admins table
    INSERT INTO super_admins (user_id, created_by)
    VALUES (NEW.id, NEW.id);

    -- Create organization name
    org_name := user_first_name || ' Organization';

    -- Create organization
    INSERT INTO organizations (name, created_by)
    VALUES (org_name, NEW.id)
    RETURNING id INTO new_org_id;

    -- Update profile with organization_id
    UPDATE profiles 
    SET organization_id = new_org_id
    WHERE id = NEW.id;

    -- Add user as owner of the organization
    INSERT INTO organization_members (
      user_id,
      organization_id,
      role,
      invited_by
    ) VALUES (
      NEW.id,
      new_org_id,
      'owner',
      NEW.id
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    -- Re-raise the exception to fail the signup
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add back NOT NULL constraints with proper defaults
UPDATE profiles 
SET first_name = COALESCE(first_name, 'User')
WHERE first_name IS NULL OR first_name = '';

UPDATE profiles 
SET last_name = COALESCE(last_name, 'User')  
WHERE last_name IS NULL OR last_name = '';

-- Now add back the constraints
ALTER TABLE profiles 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;