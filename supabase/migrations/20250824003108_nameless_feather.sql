/*
  # Agregar organization_id a todas las tablas

  1. Modificaciones a tablas existentes
    - Agregar columna `organization_id` a `contacts`
    - Agregar columna `organization_id` a `companies` 
    - Agregar columna `organization_id` a `deals`
    - Crear índices para optimización
    - Agregar foreign keys para integridad referencial

  2. Actualizar políticas RLS
    - Modificar políticas existentes para filtrar por organización
    - Asegurar aislamiento completo de datos entre organizaciones

  3. Crear tabla de membresía (opcional)
    - `organization_members` para usuarios que pertenecen a múltiples organizaciones
*/

-- Agregar organization_id a la tabla contacts
ALTER TABLE contacts 
ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Agregar organization_id a la tabla companies
ALTER TABLE companies 
ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Agregar organization_id a la tabla deals
ALTER TABLE deals 
ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_companies_organization_id ON companies(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_organization_id ON deals(organization_id);

-- Crear tabla de membresía de organizaciones (para usuarios que pueden pertenecer a múltiples organizaciones)
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Habilitar RLS en organization_members
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Índices para organization_members
CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);

-- Trigger para updated_at en organization_members
CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ACTUALIZAR POLÍTICAS RLS PARA CONTACTS
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer contactos" ON contacts;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear contactos" ON contacts;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar contactos" ON contacts;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar contactos" ON contacts;

-- Nuevas políticas para contacts con filtro por organización
CREATE POLICY "Users can view contacts from their organizations"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create contacts in their organizations"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update contacts from their organizations"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete contacts from their organizations"
  ON contacts FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- ACTUALIZAR POLÍTICAS RLS PARA COMPANIES
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer empresas" ON companies;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear empresas" ON companies;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar empresas" ON companies;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar empresas" ON companies;

-- Nuevas políticas para companies con filtro por organización
CREATE POLICY "Users can view companies from their organizations"
  ON companies FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create companies in their organizations"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update companies from their organizations"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete companies from their organizations"
  ON companies FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- ACTUALIZAR POLÍTICAS RLS PARA DEALS
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer negocios" ON deals;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear negocios" ON deals;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar negocios" ON deals;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar negocios" ON deals;

-- Nuevas políticas para deals con filtro por organización
CREATE POLICY "Users can view deals from their organizations"
  ON deals FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deals in their organizations"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update deals from their organizations"
  ON deals FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete deals from their organizations"
  ON deals FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- POLÍTICAS PARA ORGANIZATION_MEMBERS
CREATE POLICY "Users can view their own organization memberships"
  ON organization_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Organization owners can manage members"
  ON organization_members FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ACTUALIZAR POLÍTICAS PARA ORGANIZATIONS
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer organizaciones" ON organizations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear organizaciones" ON organizations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar organizaciones" ON organizations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar organizaciones" ON organizations;

-- Nuevas políticas para organizations
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization owners can update their organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Organization owners can delete their organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );