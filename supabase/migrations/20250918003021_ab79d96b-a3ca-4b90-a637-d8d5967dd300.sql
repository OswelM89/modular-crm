-- Agregar campo organization_type a la tabla organizations
ALTER TABLE public.organizations 
ADD COLUMN organization_type TEXT DEFAULT 'Empresa';

-- Crear índice para optimizar consultas por tipo
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(organization_type);

-- Actualizar trigger para manejar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Aplicar trigger a organizations si no existe
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();