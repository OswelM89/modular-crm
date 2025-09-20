-- Improve cancel_subscription function to handle edge cases better
CREATE OR REPLACE FUNCTION public.cancel_subscription()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org_id uuid;
  v_subscription_count integer;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO v_org_id
  FROM organization_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of any organization';
  END IF;
  
  -- Check if subscription exists and is active
  SELECT COUNT(*) INTO v_subscription_count
  FROM subscriptions 
  WHERE organization_id = v_org_id 
    AND status = 'active';
  
  IF v_subscription_count = 0 THEN
    RAISE EXCEPTION 'No active subscription found to cancel';
  END IF;
  
  -- Update subscription status to cancelled but keep expires_at
  UPDATE subscriptions 
  SET status = 'cancelled', updated_at = now()
  WHERE organization_id = v_org_id 
    AND status = 'active';
END;
$function$;

-- Improve reactivate_subscription function as well
CREATE OR REPLACE FUNCTION public.reactivate_subscription()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_org_id uuid;
  v_subscription_count integer;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO v_org_id
  FROM organization_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of any organization';
  END IF;
  
  -- Check if there's a cancelled subscription that can be reactivated
  SELECT COUNT(*) INTO v_subscription_count
  FROM subscriptions 
  WHERE organization_id = v_org_id 
    AND status = 'cancelled'
    AND expires_at > now();
  
  IF v_subscription_count = 0 THEN
    RAISE EXCEPTION 'No valid cancelled subscription found to reactivate';
  END IF;
  
  -- Update subscription status back to active
  UPDATE subscriptions 
  SET status = 'active', updated_at = now()
  WHERE organization_id = v_org_id 
    AND status = 'cancelled'
    AND expires_at > now();
END;
$function$;