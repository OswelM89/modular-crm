-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that restricts profile visibility to organization members only
CREATE POLICY "Users can view profiles in their organization"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT m.organization_id 
    FROM public.organization_members m 
    WHERE m.user_id = auth.uid()
  )
  OR id = auth.uid()  -- Users can always see their own profile
);

-- Also create a policy to allow users to view profiles of users in organizations they're members of
-- This covers cases where someone might not have organization_id set but is still a member
CREATE POLICY "Users can view organization member profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members m1, public.organization_members m2
    WHERE m1.user_id = auth.uid() 
      AND m2.user_id = profiles.id
      AND m1.organization_id = m2.organization_id
  )
  OR id = auth.uid()  -- Users can always see their own profile
);

-- Drop the second policy as it would be redundant with the first one
DROP POLICY IF EXISTS "Users can view organization member profiles" ON public.profiles;

-- The final policy should cover both cases: same organization_id or shared organization membership
CREATE POLICY "Users can view organization profiles only"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- User can see their own profile
  id = auth.uid()
  OR
  -- User can see profiles of people in their organizations
  EXISTS (
    SELECT 1 
    FROM public.organization_members m1, public.organization_members m2
    WHERE m1.user_id = auth.uid() 
      AND m2.user_id = profiles.id
      AND m1.organization_id = m2.organization_id
  )
);