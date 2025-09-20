-- Create function to cancel subscription (mark as cancelled but keep expires_at)
CREATE OR REPLACE FUNCTION public.cancel_subscription()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org_id uuid;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO v_org_id
  FROM organization_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of any organization';
  END IF;
  
  -- Update subscription status to cancelled but keep expires_at
  UPDATE subscriptions 
  SET status = 'cancelled', updated_at = now()
  WHERE organization_id = v_org_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No subscription found for organization';
  END IF;
END;
$function$;

-- Create function to reactivate subscription
CREATE OR REPLACE FUNCTION public.reactivate_subscription()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org_id uuid;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO v_org_id
  FROM organization_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of any organization';
  END IF;
  
  -- Update subscription status back to active
  UPDATE subscriptions 
  SET status = 'active', updated_at = now()
  WHERE organization_id = v_org_id 
    AND status = 'cancelled'
    AND expires_at > now(); -- Only if not expired
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No valid cancelled subscription found to reactivate';
  END IF;
END;
$function$;