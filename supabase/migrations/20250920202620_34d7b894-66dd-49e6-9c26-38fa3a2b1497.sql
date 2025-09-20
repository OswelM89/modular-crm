-- Corregir la referencia de organización en la suscripción activa
-- Transferir la suscripción a la organización correcta del usuario
UPDATE subscriptions 
SET organization_id = 'ade51ac9-5ae8-464b-828b-eb660dc85ef3',
    updated_at = now()
WHERE organization_id = 'de6e67ff-7d20-424e-8f67-e5a7340c7278'
  AND status = 'active';

-- También corregir la orden de pago para consistencia
UPDATE payment_orders 
SET organization_id = 'ade51ac9-5ae8-464b-828b-eb660dc85ef3',
    updated_at = now()
WHERE organization_id = 'de6e67ff-7d20-424e-8f67-e5a7340c7278'
  AND status = 'completed';