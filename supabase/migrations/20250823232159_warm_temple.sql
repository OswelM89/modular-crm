/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - Current policies create infinite recursion when fetching profiles
    - Policies reference profiles table within profiles policies
    - This creates circular dependencies

  2. Solution
    - Drop all existing problematic policies
    - Create simple, non-recursive policies
    - Use auth.uid() directly instead of subqueries to profiles table

  3. New Policies
    - Users can read their own profile (simple auth.uid() check)
    - Users can update their own profile
    - Super admins can manage all profiles
    - Organization members can read profiles in their organization
*/

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read organization profiles" ON profiles;
DROP POLICY IF EXISTS "Organization admins can manage profiles" ON profiles;
DROP POLICY IF EXISTS "temp_profiles_insert_policy" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Super admins can manage all profiles (using super_admins table directly)
CREATE POLICY "profiles_super_admin_all"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM super_admins
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM super_admins
    )
  );

-- Organization members can read profiles in their organization
-- (using organization_members table directly, not profiles)
CREATE POLICY "profiles_organization_read"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );