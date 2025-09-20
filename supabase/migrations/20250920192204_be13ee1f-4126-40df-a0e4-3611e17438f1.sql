-- Crear función para activar suscripción manualmente (para testing)
CREATE OR REPLACE FUNCTION public.activate_subscription_for_order(p_bold_order_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment_order record;
  v_expiry_date timestamp with time zone;
BEGIN
  -- Buscar la orden de pago
  SELECT * INTO v_payment_order 
  FROM payment_orders 
  WHERE bold_order_id = p_bold_order_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment order not found for Bold ID: %', p_bold_order_id;
  END IF;
  
  -- Actualizar estado de la orden a completada
  UPDATE payment_orders 
  SET status = 'completed', updated_at = now()
  WHERE id = v_payment_order.id;
  
  -- Calcular fecha de expiración (30 días)
  v_expiry_date := now() + interval '30 days';
  
  -- Crear o actualizar suscripción
  INSERT INTO subscriptions (organization_id, status, expires_at)
  VALUES (v_payment_order.organization_id, 'active', v_expiry_date)
  ON CONFLICT (organization_id) 
  DO UPDATE SET 
    status = 'active',
    expires_at = v_expiry_date,
    updated_at = now();
    
  RAISE NOTICE 'Subscription activated for organization %', v_payment_order.organization_id;
END;
$$;