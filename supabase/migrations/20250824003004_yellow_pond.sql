/*
  # Crear tabla de organizaciones

  1. Nueva tabla
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `organizations`
    - Agregar políticas para usuarios autenticados

  3. Índices
    - Índice en `name` para búsquedas
    - Índice en `slug` para identificadores únicos
*/

-- Crear función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_organization_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear función para actualizar updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear tabla organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- Crear trigger para generar slug automáticamente
DROP TRIGGER IF EXISTS set_organization_slug ON organizations;
CREATE TRIGGER set_organization_slug
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION generate_organization_slug();

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS básicas (estas deberán ser refinadas según tus necesidades)
CREATE POLICY "Usuarios autenticados pueden crear organizaciones"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer organizaciones"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden actualizar organizaciones"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar organizaciones"
  ON organizations
  FOR DELETE
  TO authenticated
  USING (true);