/*
  # Crear tabla de contactos

  1. Nueva Tabla
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `email` (text, unique)
      - `phone` (text)
      - `position` (text)
      - `company_id` (uuid, foreign key to companies)
      - `id_number` (text)
      - `tax_document` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `contacts`
    - Política para que usuarios autenticados puedan leer todos los contactos
    - Política para que usuarios autenticados puedan crear contactos
    - Política para que usuarios autenticados puedan actualizar contactos
    - Política para que usuarios autenticados puedan eliminar contactos

  3. Índices
    - Índice en `email` para búsquedas rápidas
    - Índice en `company_id` para relaciones
    - Índice en `first_name` y `last_name` para búsquedas
</*/

-- Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  position text,
  company_id uuid,
  id_number text,
  tax_document text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (permitir todo para usuarios autenticados por ahora)
CREATE POLICY "Usuarios autenticados pueden leer contactos"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear contactos"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar contactos"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar contactos"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (true);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts (company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_first_name ON contacts (first_name);
CREATE INDEX IF NOT EXISTS idx_contacts_last_name ON contacts (last_name);
CREATE INDEX IF NOT EXISTS idx_contacts_full_name ON contacts (first_name, last_name);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();