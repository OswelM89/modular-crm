/*
  # Crear tabla de empresas

  1. Nueva Tabla
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, required) - Nombre de la empresa
      - `industry` (text) - Industria/sector
      - `size` (text) - Tamaño de la empresa
      - `website` (text) - Sitio web
      - `address` (text) - Dirección
      - `phone` (text) - Teléfono principal
      - `email` (text) - Email principal
      - `tax_id` (text) - RFC/NIT
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `companies`
    - Políticas para usuarios autenticados (CRUD completo)

  3. Optimización
    - Índices en campos de búsqueda
    - Trigger para actualizar `updated_at`
*/

-- Crear tabla de empresas
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  size text,
  website text,
  address text,
  phone text,
  email text,
  tax_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden leer empresas"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear empresas"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar empresas"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar empresas"
  ON companies
  FOR DELETE
  TO authenticated
  USING (true);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies USING btree (name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies USING btree (industry);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies USING btree (email);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies USING btree (created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();