/*
  # Crear tabla de organizaciones

  1. Nueva tabla organizations
    - `id` (uuid, primary key)
    - `name` (text)
    - `slug` (text, unique)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en organizations
    - Políticas para lectura y actualización
*/

-- Crear tabla de organizaciones
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Políticas para organizations
CREATE POLICY "Users can read their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Super admins can update their organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  ));

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION set_organization_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug
DROP TRIGGER IF EXISTS trigger_set_organization_slug ON organizations;
CREATE TRIGGER trigger_set_organization_slug
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_organization_slug();

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();