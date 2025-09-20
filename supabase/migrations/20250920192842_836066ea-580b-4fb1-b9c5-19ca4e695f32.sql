-- Limpiar datos para testing desde cero
DELETE FROM subscriptions;
DELETE FROM payment_orders;

-- Verificar que se eliminaron los datos
SELECT 'Subscriptions remaining:' as info, COUNT(*) as count FROM subscriptions
UNION ALL
SELECT 'Payment orders remaining:' as info, COUNT(*) as count FROM payment_orders;