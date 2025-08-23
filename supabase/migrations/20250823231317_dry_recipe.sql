/*
  # Fix: Crear organización automáticamente para el primer usuario

  1. Función mejorada handle_new_user
    - Detecta si es el primer usuario (super admin)
    - Crea automáticamente una organización
    - Asigna al usuario como owner de la organización
    - Crea el perfil con organization_id

  2. Función auxiliar para generar slug único
    - Convierte nombre a slug válido
    - Maneja caracteres especiales y espacios

  3. Políticas actualizadas
    - Permite inserción en organizations durante registro
    - Permite inserción en organization_members durante registro
*/

-- Función para generar slug único de organización
CREATE OR REPLACE FUNCTION generate_organization_slug(org_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convertir nombre a slug básico
  base_slug := lower(trim(org_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Si está vacío, usar default
  IF base_slug = '' THEN
    base_slug := 'organization';
  END IF;
  
  final_slug := base_slug;
  
  -- Verificar si el slug ya existe y agregar número si es necesario
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Función mejorada para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_first_user boolean;
  new_org_id uuid;
  org_name text;
  org_slug text;
BEGIN
  -- Verificar si es el primer usuario
  SELECT COUNT(*) = 0 INTO is_first_user FROM auth.users WHERE id != NEW.id;
  
  IF is_first_user THEN
    -- Es el primer usuario - será super admin con su propia organización
    
    -- Generar nombre de organización basado en email
    org_name := split_part(NEW.email, '@', 1) || ' Organization';
    org_slug := generate_organization_slug(org_name);
    
    -- Crear organización
    INSERT INTO organizations (name, slug, created_by)
    VALUES (org_name, org_slug, NEW.id)
    RETURNING id INTO new_org_id;
    
    -- Crear perfil como super admin con organización
    INSERT INTO profiles (
      id, 
      email, 
      first_name, 
      last_name, 
      role, 
      organization_id
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      'super_admin',
      new_org_id
    );
    
    -- Agregar a super_admins
    INSERT INTO super_admins (user_id, created_by)
    VALUES (NEW.id, NEW.id);
    
    -- Agregar como owner de la organización
    INSERT INTO organization_members (user_id, organization_id, role, invited_by)
    VALUES (NEW.id, new_org_id, 'owner', NEW.id);
    
  ELSE
    -- Usuario regular - sin organización inicialmente
    INSERT INTO profiles (
      id, 
      email, 
      first_name, 
      last_name, 
      role
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      'user'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Políticas temporales para permitir inserción durante registro
DROP POLICY IF EXISTS "temp_organizations_insert_policy" ON organizations;
CREATE POLICY "temp_organizations_insert_policy"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "temp_organization_members_insert_policy" ON organization_members;
CREATE POLICY "temp_organization_members_insert_policy"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Política para que los usuarios puedan leer su propia organización recién creada
DROP POLICY IF EXISTS "organizations_select_own" ON organizations;
CREATE POLICY "organizations_select_own"
  ON organizations FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ));

-- Verificar que las funciones existan
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_organization_slug') THEN
    RAISE EXCEPTION 'Function generate_organization_slug was not created properly';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    RAISE EXCEPTION 'Function handle_new_user was not created properly';
  END IF;
  
  RAISE NOTICE 'Auto-organization creation configured successfully!';
END $$;