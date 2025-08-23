/*
# Configuración completa de Row Level Security (RLS)

Este archivo configura políticas de seguridad a nivel de fila para todas las tablas del sistema.

## Tablas configuradas:
1. **profiles** - Usuarios pueden ver/editar su propio perfil y datos de su organización
2. **organizations** - Acceso basado en membresía organizacional
3. **organization_members** - Gestión de miembros por administradores
4. **super_admins** - Acceso restringido solo a super administradores

## Políticas por tabla:
- **SELECT**: Lectura de datos según permisos
- **INSERT**: Creación de registros según roles
- **UPDATE**: Actualización según permisos
- **DELETE**: Eliminación según roles administrativos

## Roles del sistema:
- `super_admin`: Acceso completo al sistema
- `admin`: Gestión de su organización
- `manager`: Gestión limitada de su organización
- `user`: Acceso básico a su información
- `viewer`: Solo lectura
*/

-- Habilitar RLS en todas las tablas (por si no está habilitado)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para recrearlas
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage organization profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read organization profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their organization" ON public.organizations;
DROP POLICY IF EXISTS "Super admins can update their organization" ON public.organizations;
DROP POLICY IF EXISTS "Members can read their organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can manage organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Super admins can read super admins" ON public.super_admins;
DROP POLICY IF EXISTS "Super admins can manage super admins" ON public.super_admins;

-- =====================================================
-- POLÍTICAS PARA LA TABLA PROFILES
-- =====================================================

-- Política SELECT: Los usuarios pueden leer su propio perfil y perfiles de su organización
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (
    -- Puede ver su propio perfil
    auth.uid() = id 
    OR 
    -- Puede ver perfiles de su misma organización
    (
      organization_id IS NOT NULL 
      AND organization_id IN (
        SELECT p.organization_id 
        FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.organization_id IS NOT NULL
      )
    )
  );

-- Política INSERT: Solo se pueden crear perfiles durante el registro (manejado por trigger)
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (
    -- Solo se puede insertar el propio perfil durante el registro
    auth.uid() = id
  );

-- Política UPDATE: Los usuarios pueden actualizar su propio perfil, admins pueden actualizar perfiles de su organización
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (
    -- Puede actualizar su propio perfil
    auth.uid() = id
    OR
    -- Los admins/super_admins pueden actualizar perfiles de su organización
    (
      organization_id IN (
        SELECT p.organization_id 
        FROM public.profiles p 
        WHERE p.id = auth.uid() 
        AND p.role IN ('super_admin', 'admin')
        AND p.organization_id IS NOT NULL
      )
    )
  );

-- Política DELETE: Solo super_admins pueden eliminar perfiles
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- =====================================================
-- POLÍTICAS PARA LA TABLA ORGANIZATIONS
-- =====================================================

-- Política SELECT: Los miembros pueden leer información de su organización
CREATE POLICY "organizations_select_policy" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.organization_id IS NOT NULL
    )
  );

-- Política INSERT: Solo super_admins pueden crear organizaciones
CREATE POLICY "organizations_insert_policy" ON public.organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Política UPDATE: Admins y super_admins pueden actualizar su organización
CREATE POLICY "organizations_update_policy" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('super_admin', 'admin')
      AND p.organization_id IS NOT NULL
    )
  );

-- Política DELETE: Solo super_admins pueden eliminar organizaciones
CREATE POLICY "organizations_delete_policy" ON public.organizations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- =====================================================
-- POLÍTICAS PARA LA TABLA ORGANIZATION_MEMBERS
-- =====================================================

-- Política SELECT: Los miembros pueden ver otros miembros de su organización
CREATE POLICY "organization_members_select_policy" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.organization_id IS NOT NULL
    )
  );

-- Política INSERT: Admins y super_admins pueden agregar miembros a su organización
CREATE POLICY "organization_members_insert_policy" ON public.organization_members
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('super_admin', 'admin')
      AND p.organization_id IS NOT NULL
    )
  );

-- Política UPDATE: Admins y super_admins pueden actualizar membresías de su organización
CREATE POLICY "organization_members_update_policy" ON public.organization_members
  FOR UPDATE USING (
    organization_id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('super_admin', 'admin')
      AND p.organization_id IS NOT NULL
    )
  );

-- Política DELETE: Admins y super_admins pueden remover miembros de su organización
CREATE POLICY "organization_members_delete_policy" ON public.organization_members
  FOR DELETE USING (
    organization_id IN (
      SELECT p.organization_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('super_admin', 'admin')
      AND p.organization_id IS NOT NULL
    )
    OR
    -- Los usuarios pueden removerse a sí mismos
    user_id = auth.uid()
  );

-- =====================================================
-- POLÍTICAS PARA LA TABLA SUPER_ADMINS
-- =====================================================

-- Política SELECT: Solo super_admins pueden ver la tabla de super_admins
CREATE POLICY "super_admins_select_policy" ON public.super_admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Política INSERT: Solo super_admins pueden crear otros super_admins
CREATE POLICY "super_admins_insert_policy" ON public.super_admins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Política UPDATE: Solo super_admins pueden actualizar registros de super_admins
CREATE POLICY "super_admins_update_policy" ON public.super_admins
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Política DELETE: Solo super_admins pueden eliminar otros super_admins
CREATE POLICY "super_admins_delete_policy" ON public.super_admins
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- =====================================================
-- FUNCIÓN AUXILIAR PARA VERIFICAR PERMISOS
-- =====================================================

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.user_has_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario pertenece a una organización
CREATE OR REPLACE FUNCTION public.user_in_organization(org_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener la organización del usuario actual
CREATE OR REPLACE FUNCTION public.current_user_organization()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT organization_id FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otorgar permisos de ejecución a las funciones auxiliares
GRANT EXECUTE ON FUNCTION public.user_has_role(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_in_organization(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_organization() TO anon, authenticated;

-- =====================================================
-- VERIFICACIÓN DE CONFIGURACIÓN
-- =====================================================

-- Verificar que RLS está habilitado en todas las tablas
DO $$
BEGIN
  -- Verificar profiles
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') THEN
    RAISE EXCEPTION 'RLS no está habilitado en la tabla profiles';
  END IF;
  
  -- Verificar organizations
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'organizations') THEN
    RAISE EXCEPTION 'RLS no está habilitado en la tabla organizations';
  END IF;
  
  -- Verificar organization_members
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'organization_members') THEN
    RAISE EXCEPTION 'RLS no está habilitado en la tabla organization_members';
  END IF;
  
  -- Verificar super_admins
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'super_admins') THEN
    RAISE EXCEPTION 'RLS no está habilitado en la tabla super_admins';
  END IF;
  
  RAISE NOTICE 'RLS configurado correctamente en todas las tablas';
END $$;