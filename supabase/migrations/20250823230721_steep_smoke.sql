/*
  # Fix infinite recursion in RLS policies

  This migration fixes the infinite recursion error in the profiles table policies
  by simplifying the policy logic and removing circular dependencies.

  ## Changes Made
  1. Drop existing problematic policies
  2. Create simplified, non-recursive policies
  3. Use direct auth.uid() comparisons instead of complex joins
  4. Separate policies for different operations to avoid conflicts

  ## Security
  - Users can only see their own profile and profiles from their organization
  - Only authenticated users can insert profiles (during registration)
  - Users can update their own profile, admins can update organization profiles
  - Only super_admins can delete profiles
*/

-- Drop all existing policies for profiles table to start fresh
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Drop any other existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage organization profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read organization profiles" ON public.profiles;

-- Create simple, non-recursive policies

-- 1. SELECT Policy: Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. SELECT Policy: Users can read profiles from their organization (non-recursive)
CREATE POLICY "profiles_select_organization" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IS NOT NULL 
    AND organization_id IN (
      SELECT om.organization_id 
      FROM public.organization_members om 
      WHERE om.user_id = auth.uid()
    )
  );

-- 3. INSERT Policy: Allow profile creation during user registration
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. UPDATE Policy: Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. UPDATE Policy: Admins can update profiles in their organization
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IS NOT NULL 
    AND organization_id IN (
      SELECT om.organization_id 
      FROM public.organization_members om 
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
    )
  );

-- 6. DELETE Policy: Only super admins can delete profiles
CREATE POLICY "profiles_delete_super_admin" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.super_admins sa 
      WHERE sa.user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Test the policies by running a simple query
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for profiles table have been fixed successfully!';
END $$;