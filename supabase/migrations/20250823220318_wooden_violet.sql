-- =============================================
-- LIMPIEZA Y CONFIGURACIÓN COMPLETA DE SUPABASE
-- =============================================

-- 1. Limpiar políticas existentes si existen
DO $$ 
BEGIN
    -- Eliminar políticas de profiles si existen
    DROP POLICY IF EXISTS "Users can read organization profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Admins can manage organization profiles" ON public.profiles;
    
    -- Eliminar políticas de organizations si existen
    DROP POLICY IF EXISTS "Users can read their organization" ON public.organizations;
    DROP POLICY IF EXISTS "Super admins can update their organization" ON public.organizations;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignorar errores si las políticas no existen
        NULL;
END $$;

-- 2. Eliminar triggers existentes si existen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- 3. Eliminar funciones existentes si existen
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS generate_organization_slug(text);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. Crear extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 5. Crear tabla de organizaciones
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'viewer')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Crear función para generar slug de organización
CREATE OR REPLACE FUNCTION generate_organization_slug(org_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convertir a minúsculas y reemplazar espacios con guiones
  base_slug := lower(regexp_replace(trim(org_name), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  final_slug := base_slug;
  
  -- Verificar si el slug ya existe y agregar número si es necesario
  WHILE EXISTS (SELECT 1 FROM public.organizations WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  org_id uuid;
  org_slug text;
BEGIN
  -- Solo procesar si el usuario tiene metadata
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    
    -- Si es el primer usuario de una organización (super_admin)
    IF (NEW.raw_user_meta_data->>'role') = 'super_admin' AND 
       (NEW.raw_user_meta_data->>'organization_name') IS NOT NULL THEN
      
      -- Generar slug para la organización
      org_slug := generate_organization_slug(NEW.raw_user_meta_data->>'organization_name');
      
      -- Crear la organización
      INSERT INTO public.organizations (name, slug)
      VALUES (
        NEW.raw_user_meta_data->>'organization_name',
        org_slug
      )
      RETURNING id INTO org_id;
      
    END IF;
    
    -- Crear el perfil del usuario
    INSERT INTO public.profiles (
      id,
      organization_id,
      email,
      first_name,
      last_name,
      role
    )
    VALUES (
      NEW.id,
      org_id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Habilitar RLS en las tablas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 11. Crear políticas RLS para organizations
CREATE POLICY "Users can read their organization" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Super admins can update their organization" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 12. Crear políticas RLS para profiles
CREATE POLICY "Users can read organization profiles" ON public.profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage organization profiles" ON public.profiles
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 13. Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Crear triggers para updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CONFIGURACIÓN COMPLETADA
-- =============================================