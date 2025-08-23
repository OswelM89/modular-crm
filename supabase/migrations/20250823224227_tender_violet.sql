/*
  # Crear tablas principales del sistema

  1. Nuevas Tablas
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, nombre de la organización)
      - `logo_url` (text, URL del logo)
      - `created_by` (uuid, referencia al usuario creador)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `profiles` (actualizada)
      - `id` (uuid, primary key, referencia a auth.users)
      - `email` (text, email del usuario)
      - `full_name` (text, nombre completo)
      - `first_name` (text, nombre)
      - `last_name` (text, apellido)
      - `role` (text, rol base del usuario)
      - `organization_id` (uuid, referencia a organizations)
      - `avatar_url` (text, URL del avatar)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `organization_members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `organization_id` (uuid, referencia a organizations)
      - `role` (text, rol en la organización)
      - `invited_by` (uuid, referencia al usuario que invitó)
      - `joined_at` (timestamp)
      - `created_at` (timestamp)
    
    - `super_admins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `created_by` (uuid, referencia al usuario que lo creó)
      - `created_at` (timestamp)

  2. Índices
    - Índices únicos para evitar duplicados
    - Índices compuestos para consultas optimizadas
    - Índices en foreign keys para joins rápidos

  3. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas de acceso por organización
    - Políticas especiales para super admins

  4. Triggers
    - Auto-actualización de timestamps
    - Creación automática de perfil al registrarse
    - Validaciones de integridad
*/

-- Crear tabla organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  logo_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT organizations_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

-- Actualizar tabla profiles (mantener compatibilidad)
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT profiles_role_check CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'viewer')),
  CONSTRAINT profiles_name_length CHECK (
    char_length(first_name) >= 1 AND char_length(first_name) <= 50 AND
    char_length(last_name) >= 1 AND char_length(last_name) <= 50
  )
);

-- Crear tabla organization_members
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT organization_members_role_check CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  CONSTRAINT unique_user_organization UNIQUE (user_id, organization_id)
);

-- Crear tabla super_admins
CREATE TABLE IF NOT EXISTS super_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_super_admin UNIQUE (user_id)
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(role);
CREATE INDEX IF NOT EXISTS idx_organization_members_invited_by ON organization_members(invited_by);

CREATE INDEX IF NOT EXISTS idx_super_admins_user_id ON super_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_super_admins_created_by ON super_admins(created_by);

-- Función para generar slug automático
CREATE OR REPLACE FUNCTION generate_organization_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
    
    -- Asegurar unicidad del slug
    WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar full_name automáticamente
CREATE OR REPLACE FUNCTION update_full_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name := trim(NEW.first_name || ' ' || NEW.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      trim(COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)) || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers
CREATE TRIGGER trigger_generate_organization_slug
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION generate_organization_slug();

CREATE TRIGGER trigger_update_full_name
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_full_name();

CREATE TRIGGER trigger_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER trigger_update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en todas las tablas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Políticas para organizations
CREATE POLICY "Users can read their organization" ON organizations
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their organization" ON organizations
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Authenticated users can create organizations" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Políticas para profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can read organization profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Organization admins can manage profiles" ON profiles
  FOR ALL TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Políticas para organization_members
CREATE POLICY "Users can read organization members" ON organization_members
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage members" ON organization_members
  FOR ALL TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Políticas para super_admins
CREATE POLICY "Super admins can read super_admins table" ON super_admins
  FOR SELECT TO authenticated
  USING (
    user_id IN (SELECT user_id FROM super_admins) OR
    auth.uid() IN (SELECT user_id FROM super_admins)
  );

CREATE POLICY "Super admins can manage super_admins" ON super_admins
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM super_admins));

-- Insertar datos de ejemplo (opcional)
DO $$
DECLARE
  org_id uuid;
  user_id uuid;
BEGIN
  -- Crear organización de ejemplo solo si no existe
  IF NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Modular CRM Demo') THEN
    INSERT INTO organizations (name, slug) 
    VALUES ('Modular CRM Demo', 'modular-crm-demo')
    RETURNING id INTO org_id;
  END IF;
END $$;