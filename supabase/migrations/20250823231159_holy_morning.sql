/*
  # Configurar primer usuario como super admin automáticamente

  1. Función mejorada para manejar nuevos usuarios
     - Detecta si es el primer usuario del sistema
     - Asigna rol super_admin automáticamente al primer usuario
     - Crea perfil con rol correcto
     - Agrega entrada en tabla super_admins si corresponde

  2. Políticas actualizadas
     - Permite que usuarios autenticados lean su propio perfil
     - Maneja correctamente el caso del primer usuario

  3. Trigger actualizado
     - Ejecuta la nueva lógica automáticamente
*/

-- Eliminar función anterior y crear nueva versión mejorada
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  is_first_user BOOLEAN := FALSE;
  user_role TEXT := 'user';
BEGIN
  -- Contar usuarios existentes en auth.users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- Si es el primer usuario, será super admin
  IF user_count <= 1 THEN
    is_first_user := TRUE;
    user_role := 'super_admin';
  END IF;

  -- Crear perfil del usuario
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    role,
    organization_id,
    avatar_url
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      (NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name'),
      NEW.email
    ),
    user_role,
    NULL, -- Sin organización inicialmente
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Si es el primer usuario, agregarlo a super_admins
  IF is_first_user THEN
    INSERT INTO public.super_admins (user_id, created_by)
    VALUES (NEW.id, NEW.id);
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log del error pero no fallar
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Actualizar políticas para permitir que usuarios autenticados lean su perfil
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para que super admins puedan leer todos los perfiles
DROP POLICY IF EXISTS "profiles_select_super_admin" ON profiles;
CREATE POLICY "profiles_select_super_admin"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins sa 
      WHERE sa.user_id = auth.uid()
    )
  );

-- Política para que usuarios puedan leer perfiles de su organización
DROP POLICY IF EXISTS "profiles_select_organization" ON profiles;
CREATE POLICY "profiles_select_organization"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IS NOT NULL 
    AND organization_id IN (
      SELECT om.organization_id 
      FROM organization_members om 
      WHERE om.user_id = auth.uid()
    )
  );

-- Política de inserción simplificada (solo durante el trigger)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política de actualización para propio perfil
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política de actualización para admins
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IS NOT NULL 
    AND organization_id IN (
      SELECT om.organization_id 
      FROM organization_members om 
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
    )
  );

-- Política de eliminación solo para super admins
DROP POLICY IF EXISTS "profiles_delete_super_admin" ON profiles;
CREATE POLICY "profiles_delete_super_admin"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM super_admins sa 
      WHERE sa.user_id = auth.uid()
    )
  );

-- Función para verificar si un usuario ya existe (útil para testing)
CREATE OR REPLACE FUNCTION check_first_user_setup()
RETURNS TABLE (
  total_users INTEGER,
  super_admin_count INTEGER,
  first_user_email TEXT,
  first_user_role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM auth.users),
    (SELECT COUNT(*)::INTEGER FROM super_admins),
    (SELECT email FROM profiles ORDER BY created_at LIMIT 1),
    (SELECT role FROM profiles ORDER BY created_at LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Configuración de primer usuario como super admin completada exitosamente';
  RAISE NOTICE 'El primer usuario que se registre será automáticamente super admin';
END $$;