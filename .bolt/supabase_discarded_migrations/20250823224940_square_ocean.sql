/*
  # Configuración de autenticación

  1. Configuración de autenticación
    - Habilitar confirmación por email
    - Configurar URLs de redirección
    - Establecer configuración de sesión

  2. Plantillas de email personalizadas
    - Confirmación de cuenta
    - Recuperación de contraseña
    - Invitaciones

  3. Configuración de seguridad
    - Políticas de contraseña
    - Límites de intentos
    - Configuración de JWT
*/

-- Esta migración contiene configuraciones que deben aplicarse manualmente
-- en el Dashboard de Supabase en Authentication > Settings

-- CONFIGURACIÓN MANUAL REQUERIDA:
-- 
-- 1. Authentication > Settings > General:
--    - Site URL: http://localhost:5173 (desarrollo)
--    - Additional Redirect URLs: 
--      * http://localhost:5173/auth/callback
--      * https://tu-dominio.com/auth/callback (producción)
--
-- 2. Authentication > Settings > Email:
--    - Enable email confirmations: ✓
--    - Enable email change confirmations: ✓
--    - Secure email change: ✓
--
-- 3. Authentication > Email Templates:
--    Personalizar plantillas según necesidades del proyecto
--
-- 4. Authentication > Settings > Security:
--    - Password requirements: Mínimo 6 caracteres
--    - Enable phone confirmations: según necesidad
--
-- 5. Authentication > Settings > Advanced:
--    - JWT expiry: 3600 (1 hora)
--    - Refresh token rotation: ✓
--    - Reuse interval: 10 segundos

-- Insertar configuración inicial si es necesario
DO $$
BEGIN
  -- Aquí puedes agregar cualquier configuración inicial que requiera SQL
  -- Por ejemplo, roles por defecto, configuraciones del sistema, etc.
  
  RAISE NOTICE 'Configuración de autenticación lista. Revisar configuración manual en Dashboard.';
END $$;