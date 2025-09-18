-- 1) Enum de roles admin/gestor (idempotente)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin','gestor');
  END IF;
END $$;

-- 2) Normalizar columna role de organization_members a enum y default
ALTER TABLE public.organization_members
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.organization_members
  ALTER COLUMN role TYPE public.user_role
  USING (CASE
    WHEN role IN ('owner','admin') THEN 'admin'::public.user_role
    ELSE 'gestor'::public.user_role
  END);

ALTER TABLE public.organization_members
  ALTER COLUMN role SET DEFAULT 'gestor';

-- 3) Creador (auth.users) entra como ADMIN: reescribir función del trigger de alta de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
  org_name TEXT;
BEGIN
  org_name := COALESCE(split_part(NEW.email, '@', 1), 'Mi Organización');
  INSERT INTO public.organizations(name) VALUES (org_name) RETURNING id INTO org_id;

  -- El creador siempre como ADMIN
  INSERT INTO public.organization_members(organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'admin');

  INSERT INTO public.profiles(id, first_name, last_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name', NEW.email);

  RETURN NEW;
END;
$$;

-- 4) Políticas RLS: solo admin puede invitar
-- (limpiar políticas previas si existieran)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view memberships in their organizations' AND schemaname='public' AND tablename='organization_members') THEN
    DROP POLICY "Users can view memberships in their organizations" ON public.organization_members;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Organization owners can manage members' AND schemaname='public' AND tablename='organization_members') THEN
    DROP POLICY "Organization owners can manage members" ON public.organization_members;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert themselves as members' AND schemaname='public' AND tablename='organization_members') THEN
    DROP POLICY "Users can insert themselves as members" ON public.organization_members;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view organizations they are members of' AND schemaname='public' AND tablename='organizations') THEN
    DROP POLICY "Users can view organizations they are members of" ON public.organizations;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Organization owners can update their organizations' AND schemaname='public' AND tablename='organizations') THEN
    DROP POLICY "Organization owners can update their organizations" ON public.organizations;
  END IF;
END $$;

-- Lectura: cualquier miembro ve sus orgs
CREATE POLICY "member can select own orgs"
ON public.organizations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.organization_members m
  WHERE m.organization_id = organizations.id
    AND m.user_id = auth.uid()
));

-- Lectura: cada usuario ve sus memberships
CREATE POLICY "member can select own memberships"
ON public.organization_members
FOR SELECT
USING (user_id = auth.uid());

-- Insert de miembros: solo ADMIN de esa org
CREATE POLICY "admin can invite members"
ON public.organization_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members m
    WHERE m.organization_id = organization_members.organization_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
  )
);

-- Update org: solo admin
CREATE POLICY "admin can update org"
ON public.organizations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.organization_members m
  WHERE m.organization_id = organizations.id
    AND m.user_id = auth.uid()
    AND m.role = 'admin'
));

-- 5) Forzar que todo invitado entre como 'gestor' (independiente del payload del cliente)
CREATE OR REPLACE FUNCTION public.force_guest_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo forzar si no es el trigger de creación de usuario (que debe ser admin)
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    NEW.role := 'gestor';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_force_guest_role ON public.organization_members;
CREATE TRIGGER trg_force_guest_role
  BEFORE INSERT ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.force_guest_role();

-- 6) Limpiar datos existentes para testing
DELETE FROM public.organization_members;
DELETE FROM public.profiles;
DELETE FROM public.organizations;
DELETE FROM auth.users;