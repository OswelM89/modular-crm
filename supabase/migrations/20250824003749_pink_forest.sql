/*
  # Actualizar campos de la tabla companies

  1. Modificaciones a la tabla companies
    - Agregar campo `tax_id` (NIT)
    - Renombrar `industry` a `sector` 
    - Agregar campo `city`
    - Agregar campo `country`
    - Actualizar índices correspondientes

  2. Mantener compatibilidad
    - Preservar datos existentes
    - Actualizar índices para optimización
*/

-- Agregar nuevos campos a la tabla companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text;

-- Renombrar industry a sector (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'industry'
  ) THEN
    ALTER TABLE companies RENAME COLUMN industry TO sector;
  END IF;
END $$;

-- Si no existe la columna sector, crearla
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS sector text;

-- Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);

-- Actualizar el índice existente de industry si existe
DROP INDEX IF EXISTS idx_companies_industry;