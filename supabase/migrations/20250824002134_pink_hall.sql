/*
  # Crear tabla de negocios/deals

  1. Nueva Tabla
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text, required) - Título del negocio
      - `description` (text) - Descripción detallada
      - `value` (numeric) - Valor estimado del negocio
      - `stage` (text) - Etapa del pipeline
      - `probability` (integer) - Probabilidad de cierre (0-100)
      - `expected_close_date` (date) - Fecha esperada de cierre
      - `contact_id` (uuid) - Relación con contactos
      - `company_id` (uuid) - Relación con empresas
      - `pipeline` (text) - Pipeline al que pertenece
      - `priority` (text) - Prioridad del negocio
      - `deal_type` (text) - Tipo de negocio
      - `responsible_user` (text) - Usuario responsable
      - `notes` (text) - Notas adicionales
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla `deals`
    - Políticas para usuarios autenticados (CRUD completo)

  3. Optimización
    - Índices en campos de búsqueda y filtrado
    - Trigger para actualizar `updated_at`
    - Constraints para validar datos
*/

-- Crear tabla de negocios
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  value numeric(15,2) DEFAULT 0,
  stage text DEFAULT 'prospecting',
  probability integer DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  contact_id uuid,
  company_id uuid,
  pipeline text DEFAULT 'ventas',
  priority text DEFAULT 'media',
  deal_type text DEFAULT 'nuevo',
  responsible_user text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints para validar valores
  CONSTRAINT deals_stage_check CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  CONSTRAINT deals_priority_check CHECK (priority IN ('alta', 'media', 'baja')),
  CONSTRAINT deals_type_check CHECK (deal_type IN ('nuevo', 'existente')),
  CONSTRAINT deals_value_check CHECK (value >= 0)
);

-- Habilitar RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden leer negocios"
  ON deals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear negocios"
  ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar negocios"
  ON deals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar negocios"
  ON deals
  FOR DELETE
  TO authenticated
  USING (true);

-- Índices para optimizar búsquedas y filtros
CREATE INDEX IF NOT EXISTS idx_deals_title ON deals USING btree (title);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals USING btree (stage);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON deals USING btree (priority);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline ON deals USING btree (pipeline);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_company_id ON deals USING btree (company_id);
CREATE INDEX IF NOT EXISTS idx_deals_expected_close_date ON deals USING btree (expected_close_date);
CREATE INDEX IF NOT EXISTS idx_deals_value ON deals USING btree (value);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals USING btree (created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Agregar relaciones opcionales con otras tablas (si existen)
-- Nota: Estas foreign keys son opcionales ya que contact_id y company_id pueden ser null
DO $$
BEGIN
  -- Solo agregar foreign key si la tabla contacts existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contacts') THEN
    ALTER TABLE deals ADD CONSTRAINT deals_contact_id_fkey 
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL;
  END IF;
  
  -- Solo agregar foreign key si la tabla companies existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
    ALTER TABLE deals ADD CONSTRAINT deals_company_id_fkey 
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
  END IF;
END $$;