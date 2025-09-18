-- Arreglar search_path en las funciones para seguridad
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.force_guest_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo forzar si no es el trigger de creación de usuario (que debe ser admin)
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    NEW.role := 'gestor';
  END IF;
  RETURN NEW;
END;
$$;