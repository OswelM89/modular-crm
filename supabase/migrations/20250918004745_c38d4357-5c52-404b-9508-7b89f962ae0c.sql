-- Actualizar función para usar prefijo Org' con O mayúscula
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
  -- Extraer nombre base del email y agregar prefijo Org' (con O mayúscula)
  org_name := 'Org''' || COALESCE(split_part(NEW.email, '@', 1), 'Mi_Organizacion');
  
  INSERT INTO public.organizations(name) VALUES (org_name) RETURNING id INTO org_id;

  -- El creador siempre como ADMIN
  INSERT INTO public.organization_members(organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'admin');

  INSERT INTO public.profiles(id, first_name, last_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name', NEW.email);

  RETURN NEW;
END;
$$;

-- Actualizar organizaciones existentes de org' a Org' (O mayúscula)
UPDATE public.organizations 
SET name = REPLACE(name, 'org''', 'Org''')
WHERE name LIKE 'org''%';